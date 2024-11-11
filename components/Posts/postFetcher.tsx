'use client'
import React from 'react'
import { usePostHooks } from '../../lib/hooks/post.hooks'
import { useGlobalContext } from '@/context/MainContext'
import { PostComponent } from './postComponent'

export const PostFetcher = () => {

    const{posts, user, getPosts} = useGlobalContext()

  return (
    <div className=''>
      {posts && posts?.length > 0 ? <>
        {posts?.map((item)=>(
            <PostComponent dateData={String(item?.createdAt)} getPosts={getPosts} id={item?._id as string} user={user as UserType} image={item?.media} userhandle={item?.createdBy?.userhandle as string} userimage={item?.createdBy?.profileImage as string} username={item?.createdBy?.username as string} content={item?.content}  />
        ))}
      </>: <h3 className='w-full h-40 flex items-center justify-center border-b-[1px] border-slate-400/20 text-xl font-bold'>
          No Posts yet :(
        </h3>}
    </div>
  )
}
