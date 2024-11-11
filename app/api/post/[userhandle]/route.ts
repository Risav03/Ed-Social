import { connectToDB } from "@/lib/db/db";
import Post from "@/schemas/postSchema";
import User from "@/schemas/userSchema";
import { UserType } from "@/types/types";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    revalidatePath("/", "layout");
    await connectToDB();

    const url = new URL(request.url);
    const { searchParams } = url;
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const pageIndex = parseInt(searchParams.get('pageIndex') || '0');
    
    // Extract userhandle from URL path
    const urlParts = url.pathname.split('/');
    const handle = urlParts[urlParts.length - 1];

    const user: UserType | null = await User.findOne({ userhandle: handle });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalPostCount = await Post.countDocuments({ createdBy: user._id });
    const posts = await Post.find({ createdBy: user._id })
      .populate('createdBy')
      .skip(pageIndex * pageSize)
      .limit(pageSize)
      .sort({ _id: -1 });

    const isLastPage = (pageIndex + 1) * pageSize >= totalPostCount;

    return NextResponse.json({ posts, isLastPage }, { status: 200 });
  } catch (err: any) {
    console.error('Error in GET:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}