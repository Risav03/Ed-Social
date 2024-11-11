"use client"
import { useGlobalContext } from '@/context/MainContext'
import React from 'react'
import { PostComponent } from '../Posts/postComponent'
import { UserType } from '@/types/types'

export const Timeline = () => {

    const{posts, user, getPosts} = useGlobalContext()

  return (
    <div>
        <div className='p-4 text-2xl font-bold border-b-[1px] border-slate-400/20'>
            Timeline
        </div>
        <div>
        {posts && posts?.length > 0 ? <>
        {posts?.map((item)=>(
            <PostComponent dateData={String(item?.createdAt)} getPosts={getPosts} id={item?._id as string} user={user as UserType} image={item?.media} userhandle={item?.createdBy.userhandle as string} userimage={item?.createdBy?.profileImage as string} username={item?.createdBy?.username as string} content={item?.content}  />
        ))}
      </>: <h3 className='w-full h-40 flex items-center justify-center border-b-[1px] border-slate-400/20 text-xl font-bold'>
          No Posts yet :(
        </h3>}
        </div>
    </div>
  )
}
