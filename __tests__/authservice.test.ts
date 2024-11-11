import { GET } from '@/app/api/search/route';
import User from "@/schemas/userSchema";
import { getToken } from "next-auth/jwt";
import { revalidatePath } from 'next/cache';

jest.mock("@/schemas/userSchema", () => ({
    findOne: jest.fn(),
  }));
  
  jest.mock("next-auth/jwt", () => ({
    getToken: jest.fn(),
  }));
  
  jest.mock("../lib/db/db", () => ({
    connectToDB: jest.fn(),
  }));
  
  import { AuthService } from "@/services/authService";
import { connectToDB } from '@/lib/db/db';
  
  describe("AuthService", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("should return authenticated user", async () => {
      const mockSession = {
        email: "test@example.com",
      };
  
      const mockUser = {
        email: "test@example.com",
        name: "Test User",
      };
  
      (getToken as jest.Mock).mockResolvedValue(mockSession);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
  
      const req = {
        // Mock request object
      };
  
      const user = await AuthService.getAuthenticatedUser(req);
      expect(user).toEqual(mockUser);
      expect(getToken).toHaveBeenCalledWith({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      expect(User.findOne).toHaveBeenCalledWith({ email: mockSession.email });
      expect(connectToDB).toHaveBeenCalled();
    });
  
    it("should throw error when session is missing", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
  
      const req = {
        // Mock request object
      };
  
      await expect(AuthService.getAuthenticatedUser(req)).rejects.toThrow(
        "Unauthorized"
      );
      expect(getToken).toHaveBeenCalledWith({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      expect(User.findOne).not.toHaveBeenCalled();
      expect(connectToDB).not.toHaveBeenCalled();
    });
  
    it("should throw error when user is not found", async () => {
      const mockSession = {
        email: "test@example.com",
      };
  
      (getToken as jest.Mock).mockResolvedValue(mockSession);
      (User.findOne as jest.Mock).mockResolvedValue(null);
  
      const req = {
        // Mock request object
      };
  
      await expect(AuthService.getAuthenticatedUser(req)).rejects.toThrow(
        "User Not Found"
      );
      expect(getToken).toHaveBeenCalledWith({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      expect(User.findOne).toHaveBeenCalledWith({ email: mockSession.email });
      expect(connectToDB).toHaveBeenCalled();
    });
  });