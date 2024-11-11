import { createMocks } from 'node-mocks-http';
import { GET, PATCH } from '@/app/api/user/email/[email]/route';
import { connectToDB } from "@/lib/db/db";
import User from "@/schemas/userSchema";
import { AuthService } from "@/services/authService";
import { AwsUploadService } from "@/services/awsUploadService";
import { NextResponse } from 'next/server';

// Mock the external dependencies
jest.mock("@/controllers/databaseController");
jest.mock("@/schemas/userSchema");
jest.mock("@/services/authService");
jest.mock("@/services/awsUploadService");
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe('User API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.AWS_S3_BUCKET_NAME = 'test-bucket';
    process.env.AWS_S3_REGION = 'test-region';
  });

  describe('GET Route', () => {
    it('should return user data when user exists', async () => {
      const mockUser = {
        email: 'test@example.com',
        username: 'testuser',
      };
    // @ts-ignore
      User.findOne.mockResolvedValueOnce(mockUser);

      const req = {
        nextUrl: {
          pathname: '/api/user/email/test@example.com'
        }
      };

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ user: mockUser });
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should return 404 when user is not found', async () => {
    // @ts-ignore
      User.findOne.mockResolvedValueOnce(null);

      const req = {
        nextUrl: {
          pathname: '/api/user/email/nonexistent@example.com'
        }
      };

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'User not found' });
    });

    it('should return 500 on database error', async () => {
    // @ts-ignore
      User.findOne.mockRejectedValueOnce(new Error('Database error'));

      const req = {
        nextUrl: {
          pathname: '/api/user/email/test@example.com'
        }
      };

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });

  describe('PATCH Route', () => {
    beforeEach(() => {
    // @ts-ignore
      AuthService.getAuthenticatedUser.mockResolvedValue(true);
    });

    it('should successfully update user data without files', async () => {
      const mockUser = {
        email: 'test@example.com',
        username: 'oldUsername',
        save: jest.fn().mockResolvedValue(true)
      };
    // @ts-ignore
      User.findOne.mockResolvedValueOnce(mockUser);

      const formData = {
        get: jest.fn((key) => {
          const data = {
            username: 'newUsername',
            userhandle: 'newHandle',
            bio: 'New bio'
          };
    // @ts-ignore
          return data[key];
        }),
      };

      const req = {
        nextUrl: {
          pathname: '/api/user/email/test@example.com'
        },
        formData: () => Promise.resolve(formData)
      };

      const response = await PATCH(req);
      const data = await response?.json();

      expect(response?.status).toBe(200);
      expect(data.updatedUser).toBeDefined();
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should reject bio exceeding length limit', async () => {
      const formData = {
        get: jest.fn((key) => {
          const data:any = {
            username: 'newUsername',
            userhandle: 'newHandle',
            bio: 'X'.repeat(201)
          };
          return data[key];
        }),
      };

      const req = {
        nextUrl: {
          pathname: '/api/user/email/test@example.com'
        },
        formData: () => Promise.resolve(formData)
      };

      const response = await PATCH(req);
      const data = await response?.json();

      expect(response?.status).toBe(406);
      expect(data.error).toBe('Bio exceeding length limit');
    });

    it('should handle file uploads correctly', async () => {
      const mockUser = {
        email: 'test@example.com',
        save: jest.fn().mockResolvedValue(true)
      };
    // @ts-ignore
      User.findOne.mockResolvedValueOnce(mockUser);

      // Mock File object with arrayBuffer method
      const mockFile = {
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      };

      const formData = {
        get: jest.fn((key) => {
          const data:any = {
            username: 'newUsername',
            userhandle: 'newHandle',
            bio: 'New bio',
            profilePic: mockFile,
            banner: mockFile
          };
          return data[key];
        }),
      };

      const req = {
        nextUrl: {
          pathname: '/api/user/email/test@example.com'
        },
        formData: () => Promise.resolve(formData)
      };
    // @ts-ignore
      AwsUploadService.mockResolvedValue(true);

      const response = await PATCH(req);
      const data = await response?.json();

      expect(response?.status).toBe(200);
      expect(AwsUploadService).toHaveBeenCalledTimes(2);
      expect(data.updatedUser.profileImage).toContain('test-bucket');
      expect(data.updatedUser.banner).toContain('test-bucket');
    });

    it('should return 400 when user is not found', async () => {
    // @ts-ignore
      User.findOne.mockResolvedValueOnce(null);

      const formData = {
        get: jest.fn((key) => {
          const data:any = {
            username: 'newUsername',
            userhandle: 'newHandle',
            bio: 'New bio'
          };
          return data[key];
        }),
      };

      const req = {
        nextUrl: {
          pathname: '/api/user/email/nonexistent@example.com'
        },
        formData: () => Promise.resolve(formData)
      };

      const response = await PATCH(req);
      const data = await response?.json();

      expect(response?.status).toBe(400);
      expect(data.error).toBe('User not found');
    });
  });
});