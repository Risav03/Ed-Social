"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import {useSession} from "next-auth/react"
import { AccountDisplay } from '../UI/accountDisplay'
import Image from 'next/image'
import logo from "@/assets/logos/logo.svg"
import { CgHomeAlt } from "react-icons/cg";
import { CgProfile } from "react-icons/cg";
import { ConnectModal } from '../Connect/connectModal'
import { useGlobalContext } from '@/context/MainContext'
import { ActionButton } from '../UI/actionButton'
import { useNavbarHooks } from '../../lib/hooks/navbar.hooks'
import { PostModal } from './postModal'
import { Loader } from '../UI/loader'
import { PlatformLogo } from '../UI/platformLogo'
import { NavButtons } from '../UI/navButtons'
import { IoMdAdd } from 'react-icons/io'
import { FaSearch } from 'react-icons/fa'
import { SearchBar } from '../Search/searchBar'

export const Navbar = () => {

    const{user} = useGlobalContext()
    
    const{loginModal, setLoginModal, post, postContent, setPostContent, postModal, setPostModal, postMedia, setPostMedia, loading, searchModal, setSearchModal} = useNavbarHooks()
    return (
    <div className='flex md:flex-col max-md:gap-4 max-md:bg-slate-900 items-center max-md:justify-center max-md:border-t-[2px] md:border-r-[2px] border-slate-400/20 relative md:min-h-[50vh] md:w-60 pr-2 max-md:py-4 py-2 max-md:w-screen md:h-screen'>
        {loading && <Loader/>}
        <div className='max-md:hidden'><PlatformLogo/></div>

        <div className='md:mt-10'>
            <ol className='max-md:flex items-center justify-center md:w-full gap-2'>
                <li><NavButtons href='/' icon={<CgHomeAlt/>} name='Home' /></li>
                {user && <> <li><NavButtons href={`/profile/${user.userhandle}`} icon={<CgProfile/>} name='Profile' /></li>
                <button onClick={()=>{setSearchModal(true)}} className='md:hidden'><li className='hover:bg-slate-400/10 text-slate-400 hover:text-white md:pl-4 gap-2 text-lg font-semibold hover:font-extrabold md:pr-10 px-3 rounded-full w-fit flex items-center text-left duration-200 h-10' ><FaSearch/></li></button>
                <><li className='max-md:hidden'><ActionButton action='Post' onClick={()=>{setPostModal(true)}} /></li>
                <li className='md:hidden w-12'><ActionButton action={<IoMdAdd/>} onClick={()=>{setPostModal(true)}} /></li>
                </></>}
            </ol>
        </div>

        {searchModal && <SearchBar setSearchbar={setSearchModal} />}

        <div className='h-full  flex items-end'>
            <AccountDisplay setLoginModal={setLoginModal} image={user?.profileImage as string} username={user?.userhandle as string} name={user?.username as string} />
        </div>

        {loginModal && <>
            <ConnectModal setLoginModal={setLoginModal}/>
        </>}

        {postModal && <>
            <PostModal post={post} postMedia={postMedia} setPostMedia={setPostMedia} postContent = {postContent} setPostContent={setPostContent} setPostModal={setPostModal} />
        </>}
    </div>
  )
}
