import { GET } from '@/app/api/user/[userhandle]/route'; // Adjust the import path as needed
import { connectToDB } from "@/lib/db/db";
import User from "@/schemas/userSchema";

import { revalidatePath } from "next/cache";


jest.mock("@/lib/db/db");

jest.mock("@/schemas/userSchema");
jest.mock("next/cache");

describe('GET User Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRequest = (handle:any) => ({
    nextUrl: {
      pathname: `/api/users/${handle}`
    }
  });

  it('should successfully fetch a user by handle', async () => {
    const mockUser = {
      userhandle: 'testuser',
      email: 'test@example.com'
    };
    
    // @ts-ignore
    User.findOne.mockResolvedValueOnce(mockUser);
    const req = mockRequest('testuser');

    const response = await GET(req);
    const data = await response.json();

    expect(connectToDB).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ userhandle: 'testuser' });
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    expect(response.status).toBe(200);
    expect(data).toEqual({ user: mockUser });
  });

  it('should return null when user is not found', async () => {

    // @ts-ignore
    User.findOne.mockResolvedValueOnce(null);
    const req = mockRequest('nonexistentuser');

    const response = await GET(req);
    const data = await response.json();

    expect(User.findOne).toHaveBeenCalledWith({ userhandle: 'nonexistentuser' });
    expect(response.status).toBe(404);
    expect(data).toEqual({ error: "User not found" });
  });

  it('should handle database connection errors', async () => {
    const dbError = new Error('Database connection failed');
    // @ts-ignore
    connectToDB.mockRejectedValueOnce(dbError);
    const req = mockRequest('testuser');

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: dbError });
  });

  it('should handle database query errors', async () => {
    const queryError = new Error('Database query failed');
    // @ts-ignore
    User.findOne.mockRejectedValueOnce(queryError);
    const req = mockRequest('testuser');

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: queryError });
  });

 
});