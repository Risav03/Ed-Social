import { GET } from '@/app/api/post/[userhandle]/route'; // Adjust import path as needed

import { connectToDB } from "@/controllers/databaseController";
import Post from "@/schemas/postSchema";
import User from "@/schemas/userSchema";
import { revalidatePath } from "next/cache";
import { NextRequest } from 'next/server';

// Mock the dependencies
jest.mock('@/controllers/databaseController', () => ({
  connectToDB: jest.fn(),
}));

jest.mock('@/schemas/postSchema', () => ({
  find: jest.fn(),
}));

jest.mock('@/schemas/userSchema', () => ({
  findOne: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('GET User Posts Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock data
  const mockUser = {
    _id: '123',
    userhandle: 'testuser',
    name: 'Test User'
  };

  const mockPosts = [
    {
      _id: 'post1',
      content: 'Test post 1',
      createdBy: mockUser,
      createdAt: new Date()
    },
    {
      _id: 'post2',
      content: 'Test post 2',
      createdBy: mockUser,
      createdAt: new Date()
    }
  ];

  // Helper function to create mock NextRequest
  const createMockRequest = (handle: string): NextRequest => {
    const url = new URL(`http://localhost/api/posts/user/${handle}`);
    return new NextRequest(url, {
      method: 'GET',
    });
  };

  describe('Successful Scenarios', () => {
    it('should return posts for valid user handle', async () => {
      // Set up mocks
      (connectToDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Post.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(mockPosts)
      }));

      const req = createMockRequest('testuser');
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ posts: mockPosts.reverse() });
      expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
      expect(User.findOne).toHaveBeenCalledWith({ userhandle: 'testuser' });
    });

    it('should return empty posts array when user has no posts', async () => {
      (connectToDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Post.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue([])
      }));

      const req = createMockRequest('testuser');
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ posts: [] });
    });
  });

  describe('Error Scenarios', () => {
    it('should return 404 for non-existent user', async () => {
      (connectToDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const req = createMockRequest('nonexistentuser');
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'User not found' });
    });

    it('should return 500 on database connection error', async () => {
      const dbError = new Error('Database connection failed');
      (connectToDB as jest.Mock).mockRejectedValue(dbError);

      const req = createMockRequest('testuser');
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: dbError });
    });
  });

  describe('URL Parameter Handling', () => {
    it('should correctly parse handle from URL', async () => {
      (connectToDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Post.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(mockPosts)
      }));

      const req = createMockRequest('testuser');
      await GET(req);

      expect(User.findOne).toHaveBeenCalledWith({ userhandle: 'testuser' });
    });

    it('should handle special characters in handle', async () => {
      const handleWithSpecialChars = 'test-user_123';
      (connectToDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      
      const req = createMockRequest(handleWithSpecialChars);
      await GET(req);

      expect(User.findOne).toHaveBeenCalledWith({ 
        userhandle: handleWithSpecialChars 
      });
    });
  });

  describe('Response Format', () => {
    it('should return posts in reverse chronological order', async () => {
      const chronologicalPosts = [
        { _id: 'post1', createdAt: new Date('2024-01-01') },
        { _id: 'post2', createdAt: new Date('2024-01-02') }
      ];

      (connectToDB as jest.Mock).mockResolvedValue(undefined);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Post.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(chronologicalPosts)
      }));

      const req = createMockRequest('testuser');
      const response = await GET(req);
      const data = await response.json();

      expect(data.posts[0]._id).toBe('post2');
      expect(data.posts[1]._id).toBe('post1');
    });
  });
});