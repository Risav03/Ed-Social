import { DELETE } from '@/app/api/post/id/[id]/route';
import { connectToDB } from "@/lib/db/db";
import Post from "@/schemas/postSchema";
import { AuthService } from "@/services/authService";
import { NextResponse } from "next/server";

// Mock dependencies
jest.mock("@/lib/db/db", () => ({
    connectToDB: jest.fn()
}));
jest.mock("@/schemas/postSchema", () => ({
    findById: jest.fn(),
    findByIdAndDelete: jest.fn()
}));
jest.mock("@/services/authService", () => ({
    AuthService: {
        getAuthenticatedUser: jest.fn()
    }
}));

describe('DELETE Post Handler', () => {
    // Setup common test variables
    const mockUser = { id: 'user123' };
    const mockPost = {
        _id: 'post123',
        createdBy: 'user123',
        title: 'Test Post',
        toString: () => 'user123' // Add toString method for MongoDB ObjectId simulation
    };

    // Reset all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        // Setup default successful connection
        (connectToDB as jest.Mock).mockResolvedValue(undefined);
    });

    // Helper function to create mock request
    const createMockRequest = (userId: string | null, postId: string) => ({
        url: userId ? `http://localhost:3000/api/posts?userId=${userId}` : 'http://localhost:3000/api/posts',
        nextUrl: {
            pathname: `/api/post/${postId}/route`,
            searchParams: new URLSearchParams(userId ? { userId } : {})
        }
    });

    it('should return 400 if userId is missing', async () => {
        // Setup
        const req = createMockRequest(null, 'post123');
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);

        // Execute
        const response = await DELETE(req);
        const responseData = await response.json();

        // Assert
        expect(response.status).toBe(400);
        expect(responseData.error).toBe('userId query parameter is required');
    });

    it('should return 403 if authenticated user does not match requested userId', async () => {
        // Setup
        const req = createMockRequest('user456', 'post123');
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);

        // Execute
        const response = await DELETE(req);
        const responseData = await response.json();

        // Assert
        expect(response.status).toBe(403);
        expect(responseData.error).toBe('Unauthorized: You can only delete your own posts');
    });

    it('should return 404 if post is not found', async () => {
        // Setup
        const req = createMockRequest('user123', 'post123');
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
        (Post.findById as jest.Mock).mockResolvedValue(null);

        // Execute
        const response = await DELETE(req);
        const responseData = await response.json();

        // Assert
        expect(response.status).toBe(404);
        expect(responseData.error).toBe('Post not found');
    });

    it('should return 403 if post belongs to different user', async () => {
        // Setup
        const req = createMockRequest('user123', 'post123');
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
        (Post.findById as jest.Mock).mockResolvedValue({
            ...mockPost,
            createdBy: {
                toString: () => 'user456' // Different user
            }
        });

        // Execute
        const response = await DELETE(req);
        const responseData = await response.json();

        // Assert
        expect(response.status).toBe(403);
        expect(responseData.error).toBe("Unauthorized: This post doesn't belong to you");
    });

    it('should return 500 if database operation fails', async () => {
        // Setup
        const req = createMockRequest('user123', 'post123');
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
        (Post.findById as jest.Mock).mockRejectedValue(new Error('Database error'));
        
        // Spy on console.error
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        // Execute
        const response = await DELETE(req);
        const responseData = await response.json();

        // Assert
        expect(response.status).toBe(500);
        expect(responseData.error).toBe('Internal server error');
        expect(consoleSpy).toHaveBeenCalled();
        
        // Clean up
        consoleSpy.mockRestore();
    });
});