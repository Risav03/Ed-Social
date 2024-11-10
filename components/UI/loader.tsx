import React from 'react'
import { RiLoader5Fill } from 'react-icons/ri'

export const Loader = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center fixed top-0 left-0 z-[1000] backdrop-blur-xl'>
        <RiLoader5Fill className='text-[3rem] text-white animate-spin' />
    </div>
  )
}
