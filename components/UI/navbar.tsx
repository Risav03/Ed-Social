"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import {useSession} from "next-auth/react"
import { AccountDisplay } from './accountDisplay'
import Image from 'next/image'
import logo from "@/assets/logos/logo.svg"
import { CgHomeAlt } from "react-icons/cg";
import { CgProfile } from "react-icons/cg";
import { ConnectModal } from '../Connect/connectModal'

export const Navbar = () => {

    const {data: session} = useSession();
    
    const[loginModal, setLoginModal] = useState<boolean>(false);

    return (
    <div className='flex flex-col border-r-[1px] border-slate-400/20 relative min-h-[50vh] md:w-60 pr-2'>
        <div className='flex w-full justify-center items-start'>
            <Image src={logo} alt='logo' className='w-5 translate-y-[2px]' />
            <h1 className='text-xl font-bold'>d-Soc</h1>
        </div>
        <div className='mt-10'>
            <ol className='flex flex-col gap-2'>
                <li><Link href="/"><div className='hover:bg-slate-400/10 text-slate-400 hover:text-white pl-4 gap-2 text-lg font-semibold hover:font-extrabold pr-10 rounded-full w-fit flex items-center text-left duration-200 h-10'><CgHomeAlt/>Home</div></Link></li>
                <li><Link href={`/profile/${session?.user?.name}`}><div className='hover:bg-slate-400/10 text-slate-400 hover:text-white pl-4 gap-2 text-lg font-semibold hover:font-extrabold pr-10 rounded-full w-fit flex items-center text-left duration-200 h-10'><CgProfile/>Profile</div></Link></li>
                {/* <li><Link href="/settings"><button className='hover:bg-white/10 duration-200 w-full h-10'>Settings</button></Link></li> */}
            </ol>
        </div>
        <div className='absolute bottom-0 right-2'>
            <AccountDisplay setLoginModal={setLoginModal} image={session?.user?.image as string} username={session?.user?.name as string} name={session?.user?.name as string} />
        </div>

        {loginModal && <>
            <ConnectModal setLoginModal={setLoginModal}/>
        </>}
    </div>
  )
}
