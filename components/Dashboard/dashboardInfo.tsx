'use client'
import { useGlobalContext } from '@/context/MainContext';
import Image from 'next/image';
import React from 'react'
import { EditProfile } from './EditProfile/editProfile';
import { RiEdit2Fill } from 'react-icons/ri';
import { useDashboardHook } from './dashboard.hook';

export const DashboardInfo = () => {

    const { user, setEditProfile, editProfile } = useGlobalContext();
    const{profileUser} = useDashboardHook()

    return (
        <div className='relative'>
            <div className='relative'>
                {/* BANNER */}
                <div className='h-52 w-full overflow-hidden'>
                    {profileUser?.banner && profileUser?.banner != "" ? <Image width={1500} height={500} src={profileUser?.banner as string } alt='banner' className='w-full h-full object-cover' /> :
                        <div className='w-full h-full bg-slate-500'></div>}
                </div>

                {/* Image, username, handle */}
                <div className='flex gap-2 ml-8 absolute top-40 '>
                    <div className='overflow-hidden object-cover w-32 h-32'>
                        {profileUser?.profileImage && profileUser.profileImage != "" ? <Image width={1080} height={1080} src={profileUser?.profileImage as string } alt="dp" className='w-full h-full border-4 border-black object-cover rounded-full' /> :
                            <div className='w-32 h-32 border-4 border-black rounded-full bg-slate-500'></div>}
                    </div>
                    <div className='mt-[3.5rem]'>
                        <h3 className='font-bold text-xl max-w-36 leading-snug overflow-hidden'>{profileUser?.username}</h3>
                        <h3 className='leading-tight text-slate-500 text-md max-w-36 overflow-hidden'>@{profileUser?.userhandle}</h3>
                    </div>
                </div>

            </div>

            {user?.userhandle == profileUser?.userhandle && <div className='flex justify-end mt-4 px-4 absolute right-0'>
                <button onClick={()=>{setEditProfile(true)}} className='flex w-32 hover:bg-slate-200/10 duration-200 hover:-translate-y-1 font-bold gap-2 h-8 items-center justify-center text-sm border-2 border-slate-400 rounded-full'><RiEdit2Fill className=''/> Edit Profile</button>
            </div>}

            <div className='mt-28 px-8'>
                {profileUser?.bio}
            </div>

            {user?.userhandle == profileUser?.userhandle && editProfile && <EditProfile/>}

        </div>
    )
}
