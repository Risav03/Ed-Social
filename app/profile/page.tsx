'use client'
import { Background } from '@/components/UI/background'
import { useGlobalContext } from '@/context/MainContext'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { RiLoader5Fill } from 'react-icons/ri'


export default function Buffer(){

    const router = useRouter()
    const{user} = useGlobalContext()

    useEffect(()=>{
        if(user){
            router.push("/profile/"+user?.userhandle);
        }
    },[user])


  return (
    <div className='flex items-center justify-center h-screen w-screen'>
        <Background/>
        <div className='flex justify-center items-center'>
            <RiLoader5Fill className='text-[2rem] text-white animate-spin'/>
            <h3 className='text-[3rem] text-slate-500 font-bold'>Redirecting...</h3>

        </div>
    </div>
  )
}
