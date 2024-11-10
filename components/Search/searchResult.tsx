import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import Image from 'next/image'
import React from 'react'

export const SearchResult = ({image, username, userhandle, setHistoryData, userId, router}:{ router:AppRouterInstance, userId:string,setHistoryData:(userId: string) => Promise<void>,image:string, username:string, userhandle:string}) => {
  return (
    <button onClick={()=>{setHistoryData(userId); router.push("/profile/"+userhandle)}} className='flex gap-1 items-center w-full bg-black border-b-[1px] border-slate-400/20 py-2 px-2 '>
        {image && image != "" ? <Image src={image} alt='image' width={1080} height={1080} className='w-10 h-10 rounded-full border-[1px] border-slate-400/20' /> : 
        <div className='w-10 h-10 rounded-full bg-slate-400'></div>}
        <div>
            <h2 className='text-lg leading-none max-w-32 overflow-hidden font-bold'>{username}</h2>
            <h2 className='text-sm text-left leading-none max-w-32 overflow-hidden text-slate-400' >@{userhandle}</h2>
        </div>
    </button>
  )
}
