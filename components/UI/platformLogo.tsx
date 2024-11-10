import React from 'react'
import Image from 'next/image'
import logo from "@/assets/logos/logo.svg"

export const PlatformLogo = () => {
  return (
    <div className='flex md:w-full justify-center items-start'>
            <Image src={logo} alt='logo' className='w-5 translate-y-[2px]' />
            <h1 className='text-xl font-bold max-md:hidden'>d-Soc</h1>
    </div>
  )
}
