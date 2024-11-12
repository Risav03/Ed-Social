import React, { Dispatch, SetStateAction } from 'react'
import { Card } from '../UI/card'
import { RxCross2 } from 'react-icons/rx'
import { AreaInput } from '../UI/areaInput'
import Image from 'next/image'
import { ActionButton } from '../UI/actionButton'
import { descriptionLimit } from '@/lib/constants'

export const PostModal = ({ setPostModal, setPostContent, postContent, postMedia, setPostMedia, post }: { post:()=>void, setPostModal: Dispatch<SetStateAction<boolean>>, setPostContent:Dispatch<SetStateAction<string>>, postContent:string, postMedia:File | null | undefined, setPostMedia:Dispatch<SetStateAction<File|null | undefined>> }) => {
    return (
        <div className='w-screen h-screen bg-white/5 backdrop-blur-lg fixed top-0 left-0 z-[50] flex items-center justify-center'>
            <Card className='md:w-[25rem] w-80'>
                
                <div className='flex gap-2 items-center text-slate-400'>
                    <h2 className='text-2xl w-2/3 font-bold'>Create Post</h2>
                    <div className='w-1/3 flex justify-end'>
                        <button onClick={() => { setPostModal(false) }} className='hover:text-red-500 duration-200'><RxCross2 /></button>
                    </div>
                </div>

                <div>
                    <AreaInput required={false} content={postContent} setContent={setPostContent} heading='Content' limit={descriptionLimit} placeholder='GM Community...'  />
                    <label htmlFor="dropzone-file" className="flex mb-4 mt-4 flex-col aspect-square items-center justify-center w-full border-2 border-web-textBoxShine border-dashed rounded-lg cursor-pointer p-2">
                        <div className="flex flex-col items-center aspect-square overflow-hidden justify-center rounded-lg w-full h-full hover:bg-web-textBoxShine">
                            {!postMedia ? (
                                <svg className="w-8 h-8 text-web-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                            ) : (
                                <Image 
                                    alt='Webbie Social User Profile Image' 
                                    className='w-full h-full object-cover hover:scale-110 hover:opacity-30 duration-300' 
                                    width={1000} 
                                    height={1000} 
                                    src={String(postMedia instanceof File ? URL.createObjectURL(postMedia) : postMedia)} 
                                />
                            )}
                        </div>
                        <input id="dropzone-file" type="file" accept='image/*' onChange={(e)=>{if (e.target.files && e.target.files[0]) {
                                setPostMedia(e.target.files[0]);
                            }}} className="hidden" />
                    </label>
                    <ActionButton action='Post' onClick={post} />
                </div>

            </Card>
        </div>
    )
}
