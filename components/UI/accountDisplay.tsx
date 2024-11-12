import Image from 'next/image'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosLogOut } from "react-icons/io";
import { ImEnter } from "react-icons/im";
import { signOut } from 'next-auth/react'


type PropTypes = {
    image:string;
    username:string;
    name:string;
    setLoginModal: Dispatch<SetStateAction<boolean>>
}

export const AccountDisplay = ({image, username, name, setLoginModal}:PropTypes) => {
    if(username)
    return (
        <div className='flex items-center gap-2 w-full max-md:justify-center rounded-full md:h-16 md:w-56 bg-slate-900 md:p-2'>
            <button className='relative flex items-center justify-center' onClick={()=>{signOut({ callbackUrl: '/' })}}>
                <div className='absolute text-xl md:hidden text-white bg-black/40 rounded-full w-full h-full flex items-center justify-center'><IoIosLogOut/></div>
                {image && image !== "" ? <Image width={1080} height={1080} className='rounded-full w-10 h-10 aspect-square ' src={image} alt='image' /> : <div className='h-10 w-10 rounded-full bg-slate-500'></div>}
                </button>
            <div className='w-[60%] flex flex-col max-md:hidden'>
                <h3 className='font-bold text-lg max-w-36 leading-snug overflow-hidden'>{name}</h3>
                <h3 className='leading-tight text-slate-500 text-sm max-w-36 overflow-hidden'>@{username}</h3>
            </div>
            <button onClick={()=>{signOut({ callbackUrl: '/' })}} className='w-[15%] max-md:hidden hover:text-red-500 flex justify-center text-xl duration-200 hover:scale-110 items-center'>
                <IoIosLogOut />
            </button>
        </div>
    )

    if(!username)
        return(
            <button onClick={()=>{setLoginModal(true)}} className='md:w-52 max-md:aspect-square md:h-16 h-10 bg-slate-900 rounded-full hover:brightness-110 duration-200 font-bold text-xl flex gap-2 items-center justify-center '><span className='max-md:hidden'>Login</span><ImEnter className='text-xl text-slate-400'/></button>
        )
}
