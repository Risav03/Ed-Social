import { connectToDB } from "@/lib/db/db";
import Post from "@/schemas/postSchema";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = 'edge'; // 'nodejs' is the default
// execute this function on iad1 or hnd1, based on the connecting client location
export const preferredRegion = ['bom1'];

export async function GET(request: Request) {
  revalidatePath('/', 'layout');
  
  try {
    await connectToDB();
    console.log("CONNECTED TO DB")
    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const pageIndex = parseInt(searchParams.get('pageIndex') || '0');

    console.log("PI PS",pageIndex, pageSize);

    const totalPostCount = await Post.countDocuments();
    const posts = await Post.find()
      .populate('createdBy')
      .skip(pageIndex * pageSize)
      .limit(pageSize)
      .sort({ _id: -1 });

      console.log("POSTS",posts)

    const isLastPage = (pageIndex + 1) * pageSize >= totalPostCount;

    console.log("LAST PAGE",isLastPage);


    return NextResponse.json({ posts, isLastPage }, { status: 200 });
  } catch (err:any) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}