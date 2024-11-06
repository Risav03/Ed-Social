import React from 'react'

export const Card = ({className, children}:{className:string, children: React.ReactNode}) => {
  return (
    <div className={` ${className} p-6 rounded-xl border-t-[1px] border-r-[1px] shadow-xl shadow-black/40 border-slate-500/20 bg-gradient-to-b from-black to-slate-950 `}>
        {children}
    </div>
  )
}
