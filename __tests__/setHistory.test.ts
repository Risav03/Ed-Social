import { POST } from '@/app/api/search/setSearchHistory/route';
import { connectToDB } from "@/lib/db/db";
import User from "@/schemas/userSchema";
import { AuthService } from "@/services/authService";
import { getToken } from "next-auth/jwt";


jest.mock("@/lib/db/db");
jest.mock("@/schemas/userSchema");
jest.mock("@/services/authService");
jest.mock("next-auth/jwt");

describe('POST /api/search-history', () => {
    let mockReq:any;
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        mockReq = {
            json: jest.fn()
        };
        
        (connectToDB as jest.Mock).mockResolvedValue(undefined);
    });

    it('should add new search term to empty search history', async () => {

        const mockUser = {
            email: 'test@example.com',
            searchHistory: [],
            save: jest.fn().mockResolvedValue(true)
        };
        
        mockReq.json.mockResolvedValue({ search: 'test search' });
        (getToken as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(true);

        const response = await POST(mockReq);
        const responseData = await response.json();

        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(mockUser.save).toHaveBeenCalled();
        expect(responseData.updated.searchHistory).toContain('test search');
        expect(response.status).toBe(200);
    });

    it('should add new search term to existing search history', async () => {
        const mockUser = {
            email: 'test@example.com',
            searchHistory: ['existing search'],
            save: jest.fn().mockResolvedValue(true)
        };
        
        mockReq.json.mockResolvedValue({ search: 'new search' });
        (getToken as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(true);

        const response = await POST(mockReq);
        const responseData = await response.json();

        expect(responseData.updated.searchHistory).toContain('new search');
        expect(responseData.updated.searchHistory).toContain('existing search');
        expect(response.status).toBe(200);
    });

    it('should not add duplicate search term', async () => {
        const mockUser = {
            email: 'test@example.com',
            searchHistory: ['existing search'],
            save: jest.fn().mockResolvedValue(true)
        };
        
        mockReq.json.mockResolvedValue({ search: 'existing search' });
        (getToken as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(true);

        const response = await POST(mockReq);
        const responseData = await response.json();

        expect(responseData.message).toBe('Search already exists in history');
        expect(mockUser.save).not.toHaveBeenCalled();
        expect(response.status).toBe(200);
    });

    it('should return 404 if user not found', async () => {
        mockReq.json.mockResolvedValue({ search: 'test search' });
        (getToken as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(true);

        const response = await POST(mockReq);
        const responseData = await response.json();


        expect(responseData.error).toBe('Error does not exist');
        expect(response.status).toBe(404);
    });

    it('should return 500 if database operation fails', async () => {

        mockReq.json.mockResolvedValue({ search: 'test search' });
        (getToken as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
        (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));
        (AuthService.getAuthenticatedUser as jest.Mock).mockResolvedValue(true);

        const response = await POST(mockReq);
        const responseData = await response.json();

        // Assert
        expect(responseData.error).toBeTruthy();
        expect(response.status).toBe(500);
    });

});