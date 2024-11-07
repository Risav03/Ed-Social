import { connectToDB } from "@/controllers/databaseController";
import { AuthService } from "@/services/authService";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AwsUploadService } from "@/services/awsUploadService";
import Post from "@/schemas/postSchema";

export async function POST(req:any){
    await AuthService.getAuthenticatedUser(req)
    try{
        await connectToDB();
        
        const formData = await req.formData();
        const content = formData.get('content');
        const media = formData.get('media');
        const email = req.nextUrl.pathname.split("/")[4];
        const id = formData.get('id')

        const date = Date.now()

        console.log(content, media, email, date);

        if(media){
            const buffer = Buffer.from(await media.arrayBuffer());
            const key = `users/${email.replace("@","-")}/posts/${date}`
            const res = await AwsUploadService(buffer,key);

            if(!res){
                return NextResponse.json({message: "Upload to aws failed"}, {status:406})
            }
        }

        const mediaKey = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${email.replace("@","-")}/posts/${date}`

        console.log("Workds till here");
        const post = await Post.create({
            createdBy: id,
            content:content,
            media: mediaKey
        })
        console.log("Workds till here2222");


        return NextResponse.json({post:post},{status:200});
    }
    catch(err){
        return NextResponse.json({error:err},{status:500})
    }
}