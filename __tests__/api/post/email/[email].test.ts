import { POST } from '@/app/api/post/email/[email]/route';
import { connectToDB } from "@/controllers/databaseController";
import { AuthService } from "@/services/authService";
import Post from "@/schemas/postSchema";
import { getToken } from "next-auth/jwt";
import { AwsUploadService } from "@/services/awsUploadService";
import { NextResponse } from 'next/server';

jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn().mockImplementation((data, options) => ({
            status: options?.status || 200,
            json: async () => data,
        })),
    },
}));

jest.mock('@/controllers/databaseController', () => ({
    connectToDB: jest.fn(),
}));

jest.mock('@/schemas/postSchema', () => ({
    create: jest.fn(),
}));

jest.mock('next-auth/jwt', () => ({
    getToken: jest.fn(),
}));

jest.mock('@/services/authService', () => ({
    AuthService: {
        getAuthenticatedUser: jest.fn(),
    },
}));

jest.mock('@/services/awsUploadService', () => ({
    AwsUploadService: jest.fn(),
}));

describe('POST /api/post/email/[email]', () => {
    const mockSession = {
        email: 'test@example.com',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.AWS_S3_BUCKET_NAME = 'test-bucket';
        process.env.AWS_S3_REGION = 'test-region';
        (getToken as jest.Mock).mockResolvedValue(mockSession);
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(true);
        (AwsUploadService as jest.Mock).mockResolvedValue(true);
    });

    it('should create a post without media', async () => {
        const mockContent = 'Test post content';
        const mockId = '123456';
        const mockPost = {
            _id: 'post123',
            content: mockContent,
            createdBy: mockId,
            media: '',
        };

        const formData = new FormData();
        formData.append('content', mockContent);
        formData.append('id', mockId);

        const mockRequest = {
            formData: jest.fn().mockResolvedValue(formData),
        };

        (Post.create as jest.Mock).mockResolvedValue(mockPost);

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(AuthService.getAuthenticatedUser).toHaveBeenCalledWith(mockRequest);
        expect(connectToDB).toHaveBeenCalled();
        expect(Post.create).toHaveBeenCalledWith({
            createdBy: mockId,
            content: mockContent,
            media: ''
        });
        expect(AwsUploadService).not.toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(data.post).toEqual(mockPost);
    });

    it('should create a post with media', async () => {
        const mockContent = 'Test post content';
        const mockId = '123456';
        const mockMedia = new Blob(['test'], { type: 'image/jpeg' });
        const mockDate = 1234567890;

        jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

        const formData = new FormData();
        formData.append('content', mockContent);
        formData.append('id', mockId);
        formData.append('media', mockMedia);

        const mockRequest = {
            formData: jest.fn().mockResolvedValue(formData),
        };

        const expectedMediaUrl = `https://test-bucket.s3.test-region.amazonaws.com/users/test-example.com/posts/${mockDate}`;
        
        const mockPost = {
            _id: 'post123',
            content: mockContent,
            createdBy: mockId,
            media: expectedMediaUrl,
        };

        (Post.create as jest.Mock).mockResolvedValue(mockPost);

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(AwsUploadService).toHaveBeenCalled();
        expect(Post.create).toHaveBeenCalledWith({
            createdBy: mockId,
            content: mockContent,
            media: expectedMediaUrl,
        });
        expect(response.status).toBe(200);
        expect(data.post.media).toBe(expectedMediaUrl);
    });

    it('should handle missing content', async () => {
        const formData = new FormData();
        formData.append('id', '123');

        const mockRequest = {
            formData: jest.fn().mockResolvedValue(formData),
        };

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Content is required');
        expect(Post.create).not.toHaveBeenCalled();
    });

    it('should reject posts with content exceeding length limit', async () => {
        const longContent = 'a'.repeat(201);
        
        const formData = new FormData();
        formData.append('content', longContent);
        formData.append('id', '123');

        const mockRequest = {
            formData: jest.fn().mockResolvedValue(formData),
        };

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(response.status).toBe(406);
        expect(data.error).toBe('Content exceeding length limit');
        expect(Post.create).not.toHaveBeenCalled();
    });

    it('should handle AWS upload failure', async () => {
        const mockContent = 'Test post content';
        const mockId = '123456';
        const mockMedia = new Blob(['test'], { type: 'image/jpeg' });

        const formData = new FormData();
        formData.append('content', mockContent);
        formData.append('id', mockId);
        formData.append('media', mockMedia);

        const mockRequest = {
            formData: jest.fn().mockResolvedValue(formData),
        };

        (AwsUploadService as jest.Mock).mockResolvedValue(false);

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(response.status).toBe(406);
        expect(data.message).toBe('Upload to aws failed');
        expect(Post.create).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
        const mockContent = 'Test post content';
        const mockId = '123456';

        const formData = new FormData();
        formData.append('content', mockContent);
        formData.append('id', mockId);

        const mockRequest = {
            formData: jest.fn().mockResolvedValue(formData),
        };

        const mockError = new Error('Database error');
        (Post.create as jest.Mock).mockRejectedValue(mockError);

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBeDefined();
    });

    it('should handle authentication failure', async () => {
        (AuthService.getAuthenticatedUser as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

        const mockRequest = {
            formData: jest.fn(),
        };

        await expect(POST(mockRequest)).rejects.toThrow('Unauthorized');
        expect(Post.create).not.toHaveBeenCalled();
    });
});