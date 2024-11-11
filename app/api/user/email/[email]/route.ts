import { connectToDB } from "@/controllers/databaseController";
import User from "@/schemas/userSchema";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { AuthService } from "@/services/authService";
import { AwsUploadService } from "@/services/awsUploadService";

export async function GET(req:any){
    revalidatePath("/","layout");
    try{
        await connectToDB();

        const url = req.nextUrl.pathname.split("/")[4];
        console.log(url);
        const user = await User.findOne({email:url})

        if(user){
            return NextResponse.json({user:user},{status:200})
        }else{
            return NextResponse.json({error:"User not found"},{status:404})
        }
    }
    catch(err){
        return NextResponse.json({error:err},{status:500})
    }
}

export async function PATCH(req:any){
    await AuthService.getAuthenticatedUser(req);
    try{
        const formData = await req.formData();
        const username = formData.get('username');
        const userhandle = formData.get('userhandle');
        const bio = formData.get('bio');
        const email = await req.nextUrl.pathname.split("/")[4];

        if(bio.length > 200){
            return NextResponse.json({error:"Bio exceeding length limit"}, {status:406})
        }

        const profilePic = formData.get('profilePic');
        const banner = formData.get('banner');

        const user = await User.findOne({email:email});


        if(!user){
            return NextResponse.json({error: "User not found"}, {status:400});
        }

        if(profilePic){
            const profileBuffer = Buffer.from(await profilePic.arrayBuffer());
            const key = `users/${email.replace("@", "-")}/info/profilePic`
            await AwsUploadService(profileBuffer, key);
        }

        if(banner){
            const bannerBuffer = Buffer.from(await banner.arrayBuffer());
            const key = `users/${email.replace("@", "-")}/info/banner`
            await AwsUploadService(bannerBuffer, key);
        }

        const profilePicLink = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${email.replace("@","-")}/info/profilePic`;
        const bannerLink = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${email.replace("@","-")}/info/banner`;

        user.username = username;
        user.userhandle = userhandle;
        user.bio = bio;
        if(profilePic)
        user.profileImage = profilePicLink;

        if(banner)
        user.banner = bannerLink;

        await user.save();

        return NextResponse.json({updatedUser: user},{status:200})

    }
    catch(err){
        console.log(err);
    }
}