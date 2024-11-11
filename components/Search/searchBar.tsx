"use client"
import React, { Dispatch, SetStateAction } from 'react'
import { useSearchHooks } from '../../lib/hooks/search.hooks'
import { SearchResult } from './searchResult'

export const SearchBar = ({setSearchbar}:{ setSearchbar?: Dispatch<SetStateAction<boolean>> }) => {

    const { searchValue, setSearchValue, results, history, setHistoryData, router } = useSearchHooks()

    return (
        <div className='w-full md:pl-2 px-2 py-4 max-md:fixed top-0 left-0 z-50 max-md:backdrop-blur-xl max-md:h-screen'>
            
            <input placeholder='Search User' value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }} className='bg-slate-900 outline-none placeholder:text-slate-300/40 focus:border-2 border-slate-400 duration-200 rounded-full px-3 py-2 w-full' ></input>

            <div onClick={()=>{setSearchbar && setSearchbar(false)}} className='h-[90vh]'>
            {searchValue.length > 0 && <>
                {/* @ts-ignore */}
                {(results || history) && (results?.length > 0 || history?.length > 0) && <div className='mt-2 border-[1px] bg-black p-2 border-slate-400/20 rounded-lg'>
                    <h2 className='font-bold text-sm'>Results</h2>
                    {results?.map((item) => (
                        <SearchResult router={router} userId={item._id} setHistoryData={setHistoryData} image={item.profileImage} userhandle={item.userhandle} username={item.username} />
                    ))}

                    {history && history?.length>0 && <>
                    <h2 className='font-bold text-sm mt-2'>Recent</h2>
                    {history?.map((item) => (
                        <SearchResult router={router} userId={item._id} setHistoryData={setHistoryData} image={item.profileImage} userhandle={item.userhandle} username={item.username} />
                    ))}
                    </>}
                </div>}
            </>}
            </div>

        </div>
    )
}
