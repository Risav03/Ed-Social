import React, { Dispatch } from 'react'

export const TextInput = ({content, setContent, heading, placeholder, type, required}:{type?: string, required:boolean, content:string, setContent:Dispatch<string>, heading:string, placeholder:string}) => {
  return (
    <div className="w-full text-start flex flex-col">
          <input type={type} placeholder={placeholder} onChange={(e) => { setContent(e.target.value) }} value={content} className={`p-2 peer placeholder:text-slate-300/40 bg-slate-500/20 w-full focus:outline-none focus:border-slate-400 focus:border-2 rounded-lg border-[1px] border-slate-500/50 duration-200 `}></input>
          <h2 className={`text-sm text-semibold text-nifty-gray-1 order-first mt-4 peer-focus:font-semibold duration-200 peer-focus:text-slate-400 text-slate-500/80 `}>{heading} {required && <span className="text-red-500 font-semibold ml-1">*</span>}</h2>
      </div>
  )

}
