'use client'
import { useGlobalContext } from '@/context/MainContext';
import Image from 'next/image';
import React from 'react'
import { EditProfile } from './EditProfile/editProfile';
import { RiEdit2Fill } from 'react-icons/ri';

export const DashboardInfo = () => {
    const { user, setEditProfile, editProfile } = useGlobalContext();

    return (
        <div>
            <div className='relative'>
                {/* BANNER */}
                <div className='h-52 w-full overflow-hidden'>
                    {user?.banner && user?.banner != "" ? <Image width={1500} height={500} src={user?.banner as string  + "?v="+Date.now()} alt='banner' className='w-full h-full object-cover' /> :
                        <div className='w-full h-full bg-slate-500'></div>}
                </div>

                {/* Image, username, handle */}
                <div className='flex gap-2 ml-8 absolute top-40 '>
                    <div className='overflow-hidden object-cover w-32 h-32'>
                        {user?.profileImage && user.profileImage != "" ? <Image width={1080} height={1080} src={user?.profileImage as string + "?v="+Date.now()} alt="dp" className='w-full h-full border-4 border-black object-cover rounded-full' /> :
                            <div className='w-32 h-32 border-4 border-black rounded-full bg-slate-500'></div>}
                    </div>
                    <div className='mt-[3.5rem]'>
                        <h3 className='font-bold text-xl max-w-36 leading-snug overflow-hidden'>{user?.username}</h3>
                        <h3 className='leading-tight text-slate-500 text-md max-w-36 overflow-hidden'>@{user?.userhandle}</h3>
                    </div>
                </div>

            </div>

            <div className='flex justify-end mt-4 px-4'>
                <button onClick={()=>{setEditProfile(true)}} className='flex w-32 font-bold gap-2 h-8 items-center justify-center text-sm border-2 border-slate-400 rounded-full'><RiEdit2Fill className=''/> Edit Profile</button>
            </div>

            <div className='mt-20 px-8'>
                {user?.bio}
            </div>

            {editProfile && <EditProfile/>}

        </div>
    )
}
