import User from "@/schemas/userSchema";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req:any){
    try{

        revalidatePath('/', 'layout');
        const handle = req.nextUrl.pathname.split('/')[3];

        const user = await User.findOne({userhandle: handle});

        return NextResponse.json({user:user},{status:200});

    }
    catch(err){
        return NextResponse.json({error:err},{status:500})
    }
}