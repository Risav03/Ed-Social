import { connectToDB } from "@/lib/db/db";
import { AuthService } from "@/services/authService";
import { NextResponse } from "next/server";
import { AwsUploadService } from "@/services/awsUploadService";
import Post from "@/schemas/postSchema";
import { getToken } from "next-auth/jwt";
import { descriptionLimit } from "@/lib/constants";

export async function POST(req: any) {
    await AuthService.getAuthenticatedUser(req);
    try {
        await connectToDB();
        
        const formData = await req.formData();
        const content = formData.get('content');
        const media = formData.get('media');
        const id = formData.get('id');
        
        const session = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET
        });

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        if (content.length > descriptionLimit) {
            return NextResponse.json({ error: "Content exceeding length limit" }, { status: 406 });
        }

        let mediaUrl = "";

        if (media && media instanceof Blob) {
            const date = Date.now();
            const buffer = Buffer.from(await media.arrayBuffer());
            const key = `users/${session?.email?.replace("@", "-")}/posts/${date}`;
            const uploadResult = await AwsUploadService(buffer, key);

            if (!uploadResult) {
                return NextResponse.json({ message: "Upload to aws failed" }, { status: 406 });
            }

            mediaUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
        }

        const post = await Post.create({
            createdBy: id,
            content: content,
            media: mediaUrl
        });

        return NextResponse.json({ post: post }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 500 });
    }
}