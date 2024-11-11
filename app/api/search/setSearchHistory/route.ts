import { connectToDB } from "@/lib/db/db";
import User from "@/schemas/userSchema";
import { AuthService } from "@/services/authService";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req:any){
    await AuthService.getAuthenticatedUser(req)
    try{
        await connectToDB();
        const body = await req.json();
        const{search} = body;

        const session = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET
        });

        console.log(session?.email);

        const user = await User.findOne({email: session?.email});

        if(!user){
            return NextResponse.json({error:"Error does not exist"},{status:404});
        }

        if(user.searchHistory){
            if (user.searchHistory.includes(search)) {
                return NextResponse.json({ message: "Search already exists in history" }, { status: 200 });
            }
            else{
                user.searchHistory.push(search);
            }
        }
        else{
            user.searchHistory = [search];
        }
        await user.save();

        return NextResponse.json({updated:user},{status:200});

    }
    catch(err){
        return NextResponse.json({error:err},{status:500});
    }
}