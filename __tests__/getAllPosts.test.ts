import { GET } from '@/app/api/post/route';
import { connectToDB } from "@/lib/db/db";
import Post from "@/schemas/postSchema";
import { revalidatePath } from "next/cache";

jest.mock("@/lib/db/db");
jest.mock("next/cache");
jest.mock("@/schemas/postSchema");

type MockPost = {
  id: number;
  title: string;
  createdBy?: any;
};

describe('GET Posts API Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return posts with default pagination', async () => {
    const mockPosts: MockPost[] = [
      { id: 1, title: 'Post 1' },
      { id: 2, title: 'Post 2' }
    ];

    const countSpy = jest.spyOn(Post, 'countDocuments').mockImplementation(() => 
      Promise.resolve(2) as any
    );

    const findSpy = jest.spyOn(Post, 'find').mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(mockPosts)
    }) as any);

    const request = new Request('http://localhost:3000/api/posts');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toEqual(mockPosts);
    expect(data.isLastPage).toBe(true);
    expect(findSpy).toHaveBeenCalled();
    expect(countSpy).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
  });

  it('should handle custom pagination parameters', async () => {
    const mockPosts: MockPost[] = Array.from({ length: 5 }, (_, i) => ({ 
      id: i + 1, 
      title: `Post ${i + 1}` 
    }));
    const totalPosts = 15;

    const countSpy = jest.spyOn(Post, 'countDocuments').mockImplementation(() => 
      Promise.resolve(totalPosts) as any
    );

    const chainMock = {
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(mockPosts)
    };

    const findSpy = jest.spyOn(Post, 'find').mockImplementation(() => chainMock as any);

    const request = new Request('http://localhost:3000/api/posts?pageSize=5&pageIndex=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toEqual(mockPosts);
    expect(data.isLastPage).toBe(false);
    expect(chainMock.skip).toHaveBeenCalledWith(5);
    expect(chainMock.limit).toHaveBeenCalledWith(5);
  });

  it('should handle empty results', async () => {
    const countSpy = jest.spyOn(Post, 'countDocuments').mockImplementation(() => 
      Promise.resolve(0) as any
    );

    const chainMock = {
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([])
    };

    const findSpy = jest.spyOn(Post, 'find').mockImplementation(() => chainMock as any);

    const request = new Request('http://localhost:3000/api/posts');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toEqual([]);
    expect(data.isLastPage).toBe(true);
  });

  it('should handle database connection errors', async () => {
    const error = new Error('Database connection failed');
    (connectToDB as jest.Mock).mockRejectedValue(error);

    const request = new Request('http://localhost:3000/api/posts');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
  });

});