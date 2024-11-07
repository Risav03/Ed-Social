"use client"
import { Card } from '@/components/UI/card'
import { TextInput } from '@/components/UI/textInput'
import { useGlobalContext } from '@/context/MainContext'
import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { useEditProfileHooks } from './editProfile.hooks'
import { AreaInput } from '@/components/UI/areaInput'
import { ActionButton } from '@/components/UI/actionButton'
import Image from 'next/image'

export const EditProfile = () => {

    const { editProfile, setEditProfile, user } = useGlobalContext()
    const { username, setUsername, userhandle, setUserhandle, bio, setBio, updateInfo, banner, setBanner, profilePic, setProfilePic } = useEditProfileHooks({ user })

    return (
        <div className='w-screen h-screen bg-white/5 backdrop-blur-lg fixed top-0 left-0 z-[50] flex items-center justify-center'>
            <Card className='md:w-[25rem] w-80' >
                <div className='flex gap-2 items-center text-slate-400'>
                    <h2 className='text-2xl w-1/2 font-bold'>Edit Profile</h2>
                    <div className='w-1/2 flex justify-end'>
                        <button onClick={() => { setEditProfile(false) }} className='hover:text-red-500 duration-200'><RxCross2 /></button>
                    </div>
                </div>

                <div className='max-h-80 overflow-y-scroll mb-4 '>
                    <TextInput content={username} heading='New username' placeholder={user?.username as string} setContent={setUsername} required={false} />
                    <TextInput content={userhandle} heading='New userhandle' placeholder={user?.userhandle as string} setContent={setUserhandle} required={false} />
                    <AreaInput content={bio} heading='Edit bio' placeholder={user?.bio as string} setContent={setBio} required={false} />

                    <label htmlFor="dropzone-file" className="flex mt-4 flex-col aspect-square items-center justify-center w-40 border-2 border-web-textBoxShine border-dashed rounded-lg cursor-pointer p-2">
                        <div className="flex flex-col items-center aspect-square overflow-hidden justify-center rounded-lg w-full h-full hover:bg-web-textBoxShine">
                            {!profilePic ? (
                                <svg className="w-8 h-8 text-web-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                            ) : (
                                <Image 
                                    alt='Webbie Social User Profile Image' 
                                    className='w-full h-full object-cover hover:scale-110 hover:opacity-30 duration-300' 
                                    width={1000} 
                                    height={1000} 
                                    src={String(profilePic instanceof File ? URL.createObjectURL(profilePic) : profilePic)} 
                                />
                            )}
                        </div>
                        <input id="dropzone-file" type="file" accept='image/*' onChange={(e)=>{if (e.target.files && e.target.files[0]) {
                                setProfilePic(e.target.files[0]);
                            }}} className="hidden" />
                    </label>


                    <label htmlFor="dropzone-file2" className="flex my-4 flex-col items-center justify-center w-full h-fit border-2 border-web-textBoxShine border-dashed rounded-lg cursor-pointer p-2">
                        <div className="flex flex-col items-center overflow-hidden justify-center rounded-lg w-96 max-md:w-full h-fit aspect-[3/1] hover:bg-web-textBoxShine">
                            {!banner ? (
                                <svg className="w-8 h-8 text-web-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                            ) : (
                                <Image
                                    alt='Ed Social Banner'
                                    className=' w-full h-full object-cover hover:scale-110 hover:opacity-30 duration-300'
                                    width={1000}
                                    height={1000}
                                    src={String(banner instanceof File ? URL.createObjectURL(banner) : banner)}
                                />
                            )}
                        </div>
                        <input id="dropzone-file2" type="file" accept='image/*' onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setBanner(e.target.files[0]);
                            }
                        }} className="hidden" />
                    </label>

                </div>

                <ActionButton action="Update" onClick={updateInfo} />

            </Card>
        </div>
    )
}
