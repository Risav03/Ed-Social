'use client'
import React from 'react'
import { useGlobalContext } from '@/context/MainContext'
import { PostComponent } from './postComponent'
import { UserType } from '@/types/types'
import { RiLoader5Fill } from 'react-icons/ri'

export const PostFetcher = () => {

    const{posts, user, getPosts, postsLoading, setPageIndex, lastPage} = useGlobalContext()

  return (
    <div className=''>
      {posts && posts?.length > 0 ? <>
        {posts?.map((item)=>(
            <PostComponent dateData={String(item?.createdAt)} getPosts={getPosts} id={item?._id as string} user={user as UserType} image={item?.media} userhandle={item?.createdBy?.userhandle as string} userimage={item?.createdBy?.profileImage as string} username={item?.createdBy?.username as string} content={item?.content}  />
        ))}
      </>: <h3 className='w-full h-40 flex items-center justify-center border-b-[1px] border-slate-400/20 text-xl font-bold'>
          No Posts yet :(
        </h3>}
        {!lastPage && <button onClick={()=>{setPageIndex(prev => prev+1)}} className=' h-20 font-bold w-full hover:bg-slate-400/20 duration-200'>{postsLoading ? <div className='flex items-center justify-center text-2xl h-20'> <RiLoader5Fill className='animate-spin' /></div> : "SHOW MORE"}</button>}

    </div>
  )
}
