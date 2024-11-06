import Image from 'next/image'
import React, { Dispatch, SetStateAction } from 'react'
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
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
        <div className='flex items-center gap-2 rounded-full h-16 w-60 bg-slate-900 p-2'>
            {image && image !== "" ? <Image width={1080} height={1080} className='rounded-full w-10 h-10 aspect-square' src={image} alt='image' /> : <div className='h-10 w-10 rounded-full bg-slate-500'></div>}
            <div className='w-[60%] flex flex-col'>
                <h3 className='font-bold text-lg max-w-36 leading-snug overflow-hidden'>{name}</h3>
                <h3 className='leading-tight text-slate-500 text-sm max-w-36 overflow-hidden'>@{username}</h3>
            </div>
            <button onClick={()=>{signOut({ callbackUrl: '/' })}} className='w-[15%] hover:text-red-500 flex justify-center text-xl duration-200 hover:scale-110 items-center'>
                <IoIosLogOut />
            </button>
        </div>
    )

    if(!username)
        return(
            <button onClick={()=>{setLoginModal(true)}} className='w-60 h-16 bg-slate-900 rounded-full hover:brightness-110 duration-200 font-bold text-xl flex gap-2 items-center justify-center'>Login<IoIosLogIn/></button>
        )
}
