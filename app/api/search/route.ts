import { connectToDB } from "@/lib/db/db";
import User from "@/schemas/userSchema";
import { getToken } from "next-auth/jwt";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req: any) {
    revalidatePath('/', 'layout');
    try {
        await connectToDB();
        const url = new URL(req.url);
        const searchString = url.searchParams.get('query');

        if (!searchString) {
            return NextResponse.json({ error: "Search query is required" }, { status: 400 });
        }

        const result = await User.find({ username: { $regex: searchString, $options: 'i' } });

        const slicedResult = result?.slice(0, 5) || [];

        const session = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET
        });
    
        if (!session) {
            return NextResponse.json({ history: null, result: slicedResult}, { status: 200 });
        }

        const user = await User.findOne({ email: session.email });
        
        const arr = user?.searchHistory;

        var historyArr = []

        if(arr && arr.length > 0){
            historyArr = await Promise.all(arr?.map(async (userId:string) => {
                const historyUser = await User.findById(userId);
                return historyUser;
            }));
        }
    
        return NextResponse.json({ history: historyArr, result: slicedResult}, { status: 200 });
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}