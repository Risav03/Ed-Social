import React from 'react'

export const ActionButton = ({onClick, action}:{action:string, onClick:()=>void }) => {
  return (
    <button onClick={onClick} className='h-12 w-full bg-slate-800 text-xl hover:brightness-110 duration-200 hover:-translate-y-1 font-bold rounded-lg'>{action}</button>
  )
}
