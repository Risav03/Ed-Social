import { connectToDB } from "@/lib/db/db";
import Post from "@/schemas/postSchema";
import { AuthService } from "@/services/authService";
import { NextResponse } from "next/server";

export async function DELETE(req: any) {
    try {
        const user = await AuthService.getAuthenticatedUser(req);
        
        const url = new URL(req.url);
        const requestedUserId = url.searchParams.get('userId');
        const postId = req.nextUrl.pathname.split("/")[4];

        if (!requestedUserId) {
            return NextResponse.json(
                { error: "userId query parameter is required" },
                { status: 400 }
            );
        }

        // Validate that the authenticated user matches the requested userId
        if (user.id !== requestedUserId) {
            return NextResponse.json(
                { error: "Unauthorized: You can only delete your own posts" },
                { status: 403 }
            );
        }

        await connectToDB();

        const post = await Post.findById(postId);

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        if (post.createdBy.toString() !== requestedUserId) {
            return NextResponse.json(
                { error: "Unauthorized: This post doesn't belong to you" },
                { status: 403 }
            );
        }

        const deleted = await Post.findByIdAndDelete(postId);

        return NextResponse.json(
            { message: "Post deleted successfully", deleted },
            { status: 200 }
        );
    } catch (err) {
        console.error('Error deleting post:', err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}