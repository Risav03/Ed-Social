import { GET } from '@/app/api/search/route';
import User from "@/schemas/userSchema";
import { getToken } from "next-auth/jwt";
import { revalidatePath } from 'next/cache';


jest.mock("@/lib/db/db");

jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}));

jest.mock("@/schemas/userSchema", () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
}));

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({
      json: () => Promise.resolve(body),
      status: init?.status || 200,
    })),
  },
}));

describe('GET User Search API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Missing search query
  it('should return 400 when search query is missing', async () => {
    const req = new Request('http://localhost:3000/api/search');

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Search query is required');
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');

  });

  it('should return search results without history for unauthenticated user', async () => {
    const mockUsers = [
      { id: '1', username: 'john' },
      { id: '2', username: 'johnny' }
    ];

    (User.find as jest.Mock).mockResolvedValue(mockUsers);
    (getToken as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/search?query=john');

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.result).toEqual(mockUsers.slice(0, 5));
    expect(data.history).toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');

  });

  it('should return search results and history for authenticated user', async () => {
    const mockUsers = [
      { id: '1', username: 'john' },
      { id: '2', username: 'johnny' }
    ];

    const mockSession = {
      email: 'test@example.com'
    };

    const mockUser = {
      email: 'test@example.com',
      searchHistory: ['3', '4']
    };

    const mockHistoryUsers = [
      { id: '3', username: 'jane' },
      { id: '4', username: 'jake' }
    ];

    (User.find as jest.Mock).mockResolvedValue(mockUsers);
    (getToken as jest.Mock).mockResolvedValue(mockSession);
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (User.findById as jest.Mock)
      .mockResolvedValueOnce(mockHistoryUsers[0])
      .mockResolvedValueOnce(mockHistoryUsers[1]);

    const req = new Request('http://localhost:3000/api/search?query=john');

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.result).toEqual(mockUsers.slice(0, 5));
    expect(data.history).toEqual(mockHistoryUsers);
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');

  });

  it('should handle empty search results', async () => {
    (User.find as jest.Mock).mockResolvedValue([]);
    (getToken as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/search?query=nonexistent');

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.result).toEqual([]);
    expect(data.history).toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');

  });

  it('should handle authenticated user with empty search history', async () => {
    const mockUsers = [{ id: '1', username: 'john' }];
    const mockSession = { email: 'test@example.com' };
    const mockUser = {
      email: 'test@example.com',
      searchHistory: []
    };

    (User.find as jest.Mock).mockResolvedValue(mockUsers);
    (getToken as jest.Mock).mockResolvedValue(mockSession);
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const req = new Request('http://localhost:3000/api/search?query=john');

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.result).toEqual(mockUsers);
    expect(data.history).toEqual([]);
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');

  });
});