'use client'
import { useGlobalContext } from '@/context/MainContext'
import Image from 'next/image';
import React from 'react'

export const Dashboard = () => {

    const { user } = useGlobalContext();

    return (
        <div>
            <div className='relative'>
                {/* BANNER */}
                <div className='h-52 w-full overflow-hidden'>
                    {user?.banner && user?.banner != "" ? <Image src={user?.banner as string} alt='banner' className='w-full h-full object-cover' /> :
                        <div className='w-full h-full bg-slate-500'></div>}
                </div>

                {/* Image, username, handle */}
                <div className='flex gap-2 ml-8 absolute top-40 '>
                    <div>
                        {user?.profileImage && user.profileImage != "" ? <Image src={user?.profileImage as string} alt="dp" className='w-32 h-32 border-4 border-black rounded-full' /> :
                            <div className='w-32 h-32 border-4 border-black rounded-full bg-slate-500'></div>}
                    </div>
                    <div className='mt-[3.5rem]'>
                        <h3 className='font-bold text-lg max-w-36 leading-snug overflow-hidden'>{user?.username}</h3>
                        <h3 className='leading-tight text-slate-500 text-sm max-w-36 overflow-hidden'>@{user?.userhandle}</h3>
                    </div>
                </div>

            </div>

            <div className='mt-28 px-8'>
                {user?.bio}
            </div>
        </div>
    )
}
