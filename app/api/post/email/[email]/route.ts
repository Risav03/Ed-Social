import { connectToDB } from "@/controllers/databaseController";
import { AuthService } from "@/services/authService";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AwsUploadService } from "@/services/awsUploadService";
import Post from "@/schemas/postSchema";
import { getToken } from "next-auth/jwt";

export async function POST(req:any){
    await AuthService.getAuthenticatedUser(req)
    try{
        await connectToDB();
        
        const formData = await req.formData();
        const content = formData.get('content');
        const media = formData.get('media');
        const session = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET
        });
        const id = formData.get('id')

        const date = Date.now()

        if(content.length > 200){
            return NextResponse.json({error:"Content exceeding length limit"}, {status:406})
        }

        console.log(content, media, session?.email, date);

        var mediaKey = ""

        if(media){
            const buffer = Buffer.from(await media.arrayBuffer());
            const key = `users/${session?.email?.replace("@","-")}/posts/${date}`
            const res = await AwsUploadService(buffer,key);

            if(!res){
                return NextResponse.json({message: "Upload to aws failed"}, {status:406})
            }
            mediaKey = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${session?.email?.replace("@","-")}/posts/${date}`
        }


        console.log("Workds till here");
        const post = await Post.create({
            createdBy: id,
            content:content,
            media: mediaKey
        })


        return NextResponse.json({post:post},{status:200});
    }
    catch(err){
        return NextResponse.json({error:err},{status:500})
    }
}