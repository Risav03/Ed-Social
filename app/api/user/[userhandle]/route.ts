import { connectToDB } from "@/lib/db/db";
import User from "@/schemas/userSchema";
import { AuthService } from "@/services/authService";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req:any){
    revalidatePath('/', 'layout');
    try{
        await connectToDB()
        const handle = req.nextUrl.pathname.split('/')[3];

        const user = await User.findOne({userhandle: handle});

        if(!user){
            return NextResponse.json({error:"User not found"},{status:404});
        }

        return NextResponse.json({user:user},{status:200});

    }
    catch(err){
        return NextResponse.json({error:err},{status:500})
    }
}