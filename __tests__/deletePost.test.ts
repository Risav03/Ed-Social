import { DELETE } from '@/app/api/post/id/[id]/route';  // Adjust the import path as needed
import Post from '@/schemas/postSchema';
import { AuthService } from '@/services/authService';
import { NextResponse } from 'next/server';

// Mock dependencies
jest.mock("@/lib/db/db");

jest.mock('@/schemas/postSchema');
jest.mock('@/services/authService');

describe('DELETE Post Route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(true);
    });

    it('should successfully delete a post', async () => {
        // Arrange
        const mockPostId = '123456789';
        const mockDeletedPost = {
            _id: mockPostId,
            content: 'Test post',
            createdBy: 'user123'
        };

        const mockRequest = {
            nextUrl: {
                pathname: `/api/post/email/${mockPostId}`
            }
        };

        (Post.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeletedPost);

        // Act
        const response = await DELETE(mockRequest);
        const data = await response.json();

        // Assert
        expect(response.status).toBe(200);
        expect(data.deleted).toEqual(mockDeletedPost);
        expect(Post.findByIdAndDelete).toHaveBeenCalledWith({ _id: mockPostId });
    });

    it('should return 500 if deletion fails', async () => {
        // Arrange
        const mockPostId = '123456789';
        const mockError = new Error('Database error');

        const mockRequest = {
            nextUrl: {
                pathname: `/api/post/email/${mockPostId}`
            }
        };

        (Post.findByIdAndDelete as jest.Mock).mockRejectedValue(mockError);

        // Act
        const response = await DELETE(mockRequest);
        const data = await response.json();

        // Assert
        expect(response.status).toBe(500);
        expect(data.error).toBeDefined();
    });

    it('should check authentication before deletion', async () => {
        // Arrange
        const mockPostId = '123456789';
        const mockRequest = {
            nextUrl: {
                pathname: `/api/post/email/${mockPostId}`
            }
        };

        // Act
        await DELETE(mockRequest);

        // Assert
        expect(AuthService.getAuthenticatedUser).toHaveBeenCalledWith(mockRequest);
    });

    it('should handle authentication failure', async () => {
        // Arrange
        const mockPostId = '123456789';
        const mockRequest = {
            nextUrl: {
                pathname: `/api/post/email/${mockPostId}`
            }
        };

        const mockAuthError = new Error('Unauthorized');
        (AuthService.getAuthenticatedUser as jest.Mock).mockRejectedValue(mockAuthError);

        // Act & Assert
        await expect(DELETE(mockRequest)).rejects.toThrow('Unauthorized');
        expect(Post.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it('should handle non-existent post', async () => {
        // Arrange
        const mockPostId = 'nonexistentId';
        const mockRequest = {
            nextUrl: {
                pathname: `/api/post/email/${mockPostId}`
            }
        };

        (Post.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        // Act
        const response = await DELETE(mockRequest);
        const data = await response.json();

        // Assert
        expect(response.status).toBe(200);
        expect(data.deleted).toBeNull();
    });

    it('should extract post ID correctly from pathname', async () => {
        // Arrange
        const mockPostId = '123456789';
        const mockRequest = {
            nextUrl: {
                pathname: `/api/post/email/${mockPostId}/additional/segments`
            }
        };

        (Post.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: mockPostId });

        // Act
        await DELETE(mockRequest);

        // Assert
        expect(Post.findByIdAndDelete).toHaveBeenCalledWith({ _id: mockPostId });
    });
});