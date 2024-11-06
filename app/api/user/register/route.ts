import { NextResponse } from "next/server";
import crypto from "crypto"
import User from "@/schemas/userSchema";
import { getServerSession } from "next-auth/next";

export async function POST(req:any){
    try{
        const body = await req.json();
        const{email, username, pwd} = body;

        const hmac = crypto.createHmac('sha256', process.env.KEY as string);
        hmac.update(pwd);
        const hashedPassword = hmac.digest('hex');

        const existingUser = await User.findOne({email: email});
        if(existingUser){
            return NextResponse.json({message:"User with same email exists"},{status:405})
        }

        const userhandle = Math.random()*100000000

        const userhandleExists = await User.findOne({userhandle:userhandle});
        if(userhandleExists){
            return NextResponse.json({message:"Same userhandle generated"},{status:406})
        }

        const user = await User.create({
            email:email, username:username, pwd:hashedPassword, userhandle:userhandle
        });

        return NextResponse.json({message:user},{status:200});

    }
    catch(err){
        return NextResponse.json({message:err},{status:500})
    }
}