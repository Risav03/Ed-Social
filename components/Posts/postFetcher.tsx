'use client'
import React from 'react'
import { usePostHooks } from './post.hooks'
import { useGlobalContext } from '@/context/MainContext'

export const PostFetcher = () => {

    const{posts} = useGlobalContext()

  return (
    <div>
        {posts?.map((item)=>(
            <div>
                <p>{item?.content}</p>
            </div>
        ))}
    </div>
  )
}
