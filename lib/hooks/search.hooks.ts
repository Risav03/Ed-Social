"use client"
import React, { useEffect, useState } from 'react'
import { useDebouncedValue } from '@mantine/hooks';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { UserType } from '@/types/types';

export const useSearchHooks = () => {

    const[searchValue, setSearchValue] = useState<string>("");
    const [debouncedSearch] = useDebouncedValue(searchValue, 200);

    const[results, setResults] = useState<UserType[]>();
    const[history, setHistory] = useState<UserType[]>();

    const router = useRouter();

    async function search(){
        
        try{
            const res = await axios.get(`/api/search?query=${debouncedSearch}`);

            setResults(res.data.result);
            setHistory(res.data.history);
        }
        catch(err){
            console.error(err);
        }
    }

    async function setHistoryData(userId:string){
        try{
            const res = await axios.post("/api/search/setSearchHistory",{search:userId});
            console.log(res);
        }
        catch(err){
            console.error(err);
        }
    }

    useEffect(()=>{
        if(debouncedSearch == ""){
            setResults([]);
        }
        if(debouncedSearch){
            search();
        }
    },[debouncedSearch])

  return {setSearchValue, searchValue, results, history, setHistoryData, router}
}
