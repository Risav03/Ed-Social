import { PostType, UserType } from '@/types/types';
import axios from 'axios';
import Image from 'next/image'
import Link from 'next/link'
import React, { Dispatch, SetStateAction } from 'react'
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';

export const PostComponent = ({ getPosts, image, user, id, content, userimage, username, userhandle, dateData, setPosts }: { setPosts:Dispatch<SetStateAction<PostType[]>>, dateData:string, getPosts:()=>void, image?: string, content?: string, user: UserType, id:string, userimage: string, username: string, userhandle: string }) => {

  function returnDate(input:string){
    const date = new Date(String(input));
    return (String(date.getDate()) + "/" + String(date.getMonth()+1) + "/" + String(date.getFullYear() +"    "+ String(date.getHours() + ":" + String(date.getMinutes()))))
  }

  async function deletePost(){
    try{
      await axios.delete("/api/post/id/"+id+"?userId="+user._id);
      setPosts([])
      toast.success("Post deleted");
      getPosts();
    }
    catch(err){
      console.error(err);
    }
  }

  const convertUrlsToLinks = (text:string) => {
    const words = text.split(' ');
    return words.map((word, index) => {
      if (word.startsWith('https://')) {
        return (
          <React.Fragment key={index}>
            <a 
              href={word}
              className="text-blue-500 hover:text-blue-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {word}
            </a>
            {' '}
          </React.Fragment>
        );
      }
      return word + ' ';
    });
  };
  
  return (
    <div className='border-b-[1px] border-slate-400/20 md:py-6 md:px-8 py-3 px-4 w-full'>
      <div className='flex gap-2 items-center'>
        <div className='flex gap-2'>
          <div className='rounded-full h-10 w-10 overflow-hidden object-contain'>
            {userimage && userimage != "" ? <Image src={userimage as string} alt='profile' width={1080} height={1080} className='w-full h-full object-cover' /> :
            <div className='w-full h-full bg-slate-400'></div>}
          </div>
          <div>
            <Link href={`/profile/${userhandle}`} className='font-bold hover:underline text-nowrap text-lg leading-none'>{username}</Link>
            <h3 className='text-sm leading-none text-slate-500'>@{userhandle}</h3>
          </div>
        </div>
        {user?.userhandle == userhandle && <div className='w-[80%] flex justify-end'>
          <button onClick={()=>{deletePost()}} className='text-slate-400 p-2 border-[1px] border-slate-400/20 hover:bg-slate-200/10 duration-200 rounded-lg'><MdDelete/></button>
        </div>}
      </div>
      <div className='flex flex-col mt-4'>
        <div>
        {content?.split("\r\n").map((item) => (
          <h3 className='min-h-6'>
          {convertUrlsToLinks(item)}
        </h3>
        ))}
        </div>
        {image && image !== "" && <Image src={image as string} alt='image' width={1920} height={1080} className=' rounded-xl mt-4 border-2 border-slate-400/30' />}
      </div>
      <h3 className='text-sm text-slate-500 mt-5 text-end'>{returnDate(dateData)}</h3>
    </div>
  )
}
