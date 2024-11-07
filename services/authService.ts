import User from "@/schemas/userSchema";
import { getToken } from "next-auth/jwt";
import { connectToDB } from "../controllers/databaseController";

export class AuthService {
  static async getAuthenticatedUser(req: any) {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!session) throw new Error("Unauthorized");

    await connectToDB();
    const user = await User.findOne({ email: session.email });
    if (!user) throw new Error("User Not Found");

    return user;
  }
}
