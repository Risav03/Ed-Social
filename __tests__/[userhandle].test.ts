import { GET } from '@/app/api/post/[userhandle]/route';
import { connectToDB } from "@/lib/db/db";
import Post from "@/schemas/postSchema";
import User from "@/schemas/userSchema";
import { revalidatePath } from "next/cache";
import { UserType } from "@/types/types";
import mongoose from 'mongoose';

// Mock the dependencies
jest.mock("@/lib/db/db", () => ({
  connectToDB: jest.fn().mockResolvedValue(undefined)
}));
jest.mock("@/schemas/postSchema");
jest.mock("@/schemas/userSchema");
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn()
}));

describe('GET User Posts API Endpoint', () => {
  // Mock user data
  const mockUser: Partial<UserType> = {
    _id: '507f1f77bcf86cd799439011',
    userhandle: 'testuser',
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default successful DB connection
    (connectToDB as jest.Mock).mockResolvedValue(undefined);
  });

  it('should return user posts with default pagination', async () => {
    const mockPosts = [
      {
        _id: new mongoose.Types.ObjectId(),
        content: 'Test post 1',
        createdBy: mockUser,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        content: 'Test post 2',
        createdBy: mockUser,
      }
    ];

    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(Post, 'countDocuments').mockResolvedValue(2);
    const chainMock = {
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(mockPosts)
    };
    jest.spyOn(Post, 'find').mockReturnValue(chainMock as any);

    const request = new Request('http://localhost:3000/api/post/testuser');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toEqual(mockPosts);
    expect(data.isLastPage).toBe(true);
    expect(User.findOne).toHaveBeenCalledWith({ userhandle: 'testuser' });
    expect(Post.find).toHaveBeenCalledWith({ createdBy: mockUser._id });
  });

  it('should handle non-existent user', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/post/nonexistentuser');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
  });

  it('should handle custom pagination parameters', async () => {
    const mockPosts = Array.from({ length: 5 }, (_, i) => ({
      _id: new mongoose.Types.ObjectId(),
      content: `Test post ${i + 1}`,
      createdBy: mockUser,
    }));

    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(Post, 'countDocuments').mockResolvedValue(15);
    const chainMock = {
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(mockPosts)
    };
    jest.spyOn(Post, 'find').mockReturnValue(chainMock as any);

    const request = new Request('http://localhost:3000/api/post/testuser?pageSize=5&pageIndex=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toEqual(mockPosts);
    expect(data.isLastPage).toBe(false);
    expect(chainMock.skip).toHaveBeenCalledWith(5);
    expect(chainMock.limit).toHaveBeenCalledWith(5);
  });

  it('should handle database connection errors', async () => {
    const error = new Error('Database connection failed');
    (connectToDB as jest.Mock).mockRejectedValue(error);

    const request = new Request('http://localhost:3000/api/post/testuser');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Database connection failed');
  });

  it('should handle empty results', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(Post, 'countDocuments').mockResolvedValue(0);
    const chainMock = {
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([])
    };
    jest.spyOn(Post, 'find').mockReturnValue(chainMock as any);

    const request = new Request('http://localhost:3000/api/post/testuser');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toEqual([]);
    expect(data.isLastPage).toBe(true);
  });

  
});