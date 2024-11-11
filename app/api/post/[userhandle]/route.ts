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

    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const pageIndex = parseInt(searchParams.get('pageIndex') || '0');
    const handle = request.url.split('/')[5].split("?")[0];

    console.log(handle);

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
  } catch (err:any) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}