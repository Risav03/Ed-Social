import { connectToDB } from "@/controllers/databaseController";
import Post from "@/schemas/postSchema";
import User from "@/schemas/userSchema";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req:any){
    try{
        revalidatePath("/","layout");
        await connectToDB();

        const handle = req.nextUrl.pathname.split("/")[3];

        const user:UserType | null = await User.findOne({userhandle:handle});
        if(!user){
            return NextResponse.json({error:"User not found"},{status:404})
        }

        const posts = await Post.find({createdBy:user?._id}).populate('createdBy');
        
        return NextResponse.json({posts:posts.reverse()},{status:200})
    }
    catch(err){
        return NextResponse.json({error:err},{status:500})
    }
}