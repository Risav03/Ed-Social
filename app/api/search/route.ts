import { connectToDB } from "@/controllers/databaseController";
import User from "@/schemas/userSchema";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req: any) {
    try {
        await connectToDB();
        const url = new URL(req.url);
        const searchString = url.searchParams.get('query');

        if (!searchString) {
            return new NextResponse(JSON.stringify({ error: "Search query is required" }), { status: 400 });
        }

        const result = await User.find({ username: { $regex: searchString, $options: 'i' } });

        const slicedResult = result?.slice(0, 5) || [];

        const session = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET
        });
    
        if (!session) {
            return new NextResponse(JSON.stringify({ history: null, result: slicedResult}), { status: 200 });
        }

        const user = await User.findOne({ email: session.email });
        const arr = user.searchHistory;

        const historyArr = await Promise.all(arr.map(async (userId:string) => {
            const historyUser = await User.findById(userId);
            return historyUser;
        }));

        return new NextResponse(JSON.stringify({ history: historyArr, result: slicedResult}), { status: 200 });
    } catch (error) {
        console.error("Error in GET request:", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}