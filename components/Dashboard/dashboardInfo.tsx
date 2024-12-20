'use client'
import { useGlobalContext } from '@/context/MainContext';
import Image from 'next/image';
import React from 'react'
import { EditProfile } from './EditProfile/editProfile';
import { RiEdit2Fill } from 'react-icons/ri';
import { useDashboardHook } from '../../lib/hooks/dashboard.hooks';
import { useSession } from 'next-auth/react';

export const DashboardInfo = () => {

    const { user, setEditProfile, editProfile } = useGlobalContext();
    const {data:session} = useSession()

    return (
        <div className='relative'>
            <div className='relative'>
                {/* BANNER */}
                <div className='md:h-52 h-32 w-full overflow-hidden'>
                    {user?.banner && user?.banner != "" ? <Image width={1500} height={500} src={user?.banner as string + "?v=" + Date.now() } alt='banner' className='w-full h-full object-cover' /> :
                        <div className='w-full max-md:w-screen h-full bg-slate-500'></div>}
                </div>

                {/* Image, username, handle */}
                <div className='flex max-md:flex-col gap-2 md:ml-8 ml-2 absolute max-md:top-24 top-40 '>
                    <div className='overflow-hidden object-cover md:w-32 md:h-32 w-20 h-20'>
                        {user?.profileImage && user.profileImage != "" ? <Image width={1080} height={1080} src={user?.profileImage as string + "?v=" + Date.now() } alt="dp" className='w-full h-full border-4 border-black object-cover rounded-full' /> :
                            <div className='md:w-32 md:h-32 w-20 h-20 border-4 border-black rounded-full bg-slate-500'></div>}
                    </div>
                    <div className='md:mt-[3.5rem]'>
                        <h3 className='font-bold text-xl max-w-36 leading-snug overflow-hidden'>{user?.username}</h3>
                        <h3 className='leading-tight text-slate-500 text-md max-w-36 overflow-hidden'>@{user?.userhandle}</h3>
                    </div>
                </div>

            </div>

            {/* @ts-ignore */}
            {session?.user?.userhandle == user?.userhandle && <div className='flex justify-end mt-4 px-4 absolute right-0'>
                <button onClick={()=>{setEditProfile(true)}} className='flex w-32 hover:bg-slate-200/10 duration-200 hover:-translate-y-1 font-bold gap-2 h-8 items-center justify-center text-sm border-2 border-slate-400 rounded-full'><RiEdit2Fill className=''/> Edit Profile</button>
            </div>}

            <div className='mt-28 px-2 md:px-8'>
                {user?.bio}
            </div>

            {user?.userhandle == user?.userhandle && editProfile && <EditProfile/>}

        </div>
    )
}
