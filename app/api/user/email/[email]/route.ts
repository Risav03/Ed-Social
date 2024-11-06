import { connectToDB } from "@/controllers/databaseController";
import User from "@/schemas/userSchema";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req:any){
    try{
        revalidatePath("/","layout");
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