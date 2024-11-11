import { connectToDB } from "@/controllers/databaseController";
import Post from "@/schemas/postSchema";
import { AuthService } from "@/services/authService";
import { NextResponse } from "next/server";

export async function DELETE(req:any){
    await AuthService.getAuthenticatedUser(req)
    try{
        await connectToDB()
        const id = req.nextUrl.pathname.split("/")[4];
        const deleted = await Post.findByIdAndDelete({_id:id});

        return NextResponse.json({deleted: deleted},{status:200});
    }
    catch(err){
        return NextResponse.json({error: err},{status:500})
    }
}