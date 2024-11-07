import Post from "@/schemas/postSchema";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req:any){
    revalidatePath('/', 'layout');
    try{
        const posts = await Post.find().populate('createdBy');

        return NextResponse.json({posts:posts.reverse()},{status:200});
    }
    catch(err){
        return NextResponse.json({error:err},{status:500})
    }
}