import { POST } from '@/app/api/search/setSearchHistory/route';
import { connectToDB } from "@/lib/db/db";
import User from "@/schemas/userSchema";
import { AuthService } from "@/services/authService";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Mock dependencies
jest.mock("@/controllers/databaseController");
jest.mock("@/schemas/userSchema");
jest.mock("@/services/authService");
jest.mock("next-auth/jwt");

describe('POST /api/search-history', () => {
    let mockReq:any;
    
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        
        // Mock request object
        mockReq = {
            json: jest.fn()
        };
        
        // Mock successful DB connection
        (connectToDB as jest.Mock).mockResolvedValue(undefined);
    });

    it('should add new search term to empty search history', async () => {
        // Arrange
        const mockUser = {
            email: 'test@example.com',
            searchHistory: [],
            save: jest.fn().mockResolvedValue(true)
        };
        
        mockReq.json.mockResolvedValue({ search: 'test search' });
        (getToken as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(true);

        // Act
        const response = await POST(mockReq);
        const responseData = await response.json();

        // Assert
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(mockUser.save).toHaveBeenCalled();
        expect(responseData.updated.searchHistory).toContain('test search');
        expect(response.status).toBe(200);
    });

    it('should add new search term to existing search history', async () => {
        // Arrange
        const mockUser = {
            email: 'test@example.com',
            searchHistory: ['existing search'],
            save: jest.fn().mockResolvedValue(true)
        };
        
        mockReq.json.mockResolvedValue({ search: 'new search' });
        (getToken as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(true);

        // Act
        const response = await POST(mockReq);
        const responseData = await response.json();

        // Assert
        expect(responseData.updated.searchHistory).toContain('new search');
        expect(responseData.updated.searchHistory).toContain('existing search');
        expect(response.status).toBe(200);
    });

    it('should not add duplicate search term', async () => {
        // Arrange
        const mockUser = {
            email: 'test@example.com',
            searchHistory: ['existing search'],
            save: jest.fn().mockResolvedValue(true)
        };
        
        mockReq.json.mockResolvedValue({ search: 'existing search' });
        (getToken as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(true);

        // Act
        const response = await POST(mockReq);
        const responseData = await response.json();

        // Assert
        expect(responseData.message).toBe('Search already exists in history');
        expect(mockUser.save).not.toHaveBeenCalled();
        expect(response.status).toBe(200);
    });

    it('should return 404 if user not found', async () => {
        // Arrange
        mockReq.json.mockResolvedValue({ search: 'test search' });
        (getToken as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(true);

        // Act
        const response = await POST(mockReq);
        const responseData = await response.json();

        // Assert
        expect(responseData.error).toBe('Error does not exist');
        expect(response.status).toBe(404);
    });

    it('should return 500 if database operation fails', async () => {
        // Arrange
        mockReq.json.mockResolvedValue({ search: 'test search' });
        (getToken as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
        (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(true);

        // Act
        const response = await POST(mockReq);
        const responseData = await response.json();

        // Assert
        expect(responseData.error).toBeTruthy();
        expect(response.status).toBe(500);
    });

});