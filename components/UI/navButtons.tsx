import Link from 'next/link'
import React, { ReactNode } from 'react'
import { IconType } from 'react-icons'

export const NavButtons = ({href, icon, name}:{href:string, icon:ReactNode, name:string}) => {
  return (
    <>
        <Link href={href}><div className='hover:bg-slate-400/10 text-slate-400 hover:text-white md:pl-4 gap-2 text-lg font-semibold md:w-48 hover:font-extrabold md:pr-10 px-3 rounded-full w-fit flex items-center text-left duration-200 h-10'>{icon}<span className='max-md:hidden'>{name}</span></div></Link>
    </>
  )
}
