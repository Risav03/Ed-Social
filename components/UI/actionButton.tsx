import React, { ReactNode } from 'react'

export const ActionButton = ({onClick, action}:{action:string|ReactNode, onClick:()=>void }) => {
  return (
    <button onClick={onClick} className='h-12 w-full bg-slate-800 text-xl hover:brightness-110 max-md:flex max-md:items-center max-md:justify-center duration-200 hover:-translate-y-1 font-bold rounded-lg'>{action}</button>
  )
}
