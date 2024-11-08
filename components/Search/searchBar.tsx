import React from 'react'
import { useSearchHooks } from './search.hooks'

export const SearchBar = () => {

    const{searchValue, setSearchValue} = useSearchHooks()

  return (
    <div className='w-full pl-2 py-4'>
        <input value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}} className='bg-slate-900 rounded-full p-2 w-full' ></input>
    </div>
  )
}
