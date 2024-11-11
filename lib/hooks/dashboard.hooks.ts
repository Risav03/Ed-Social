"use client"
import { UserType } from '@/types/types';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export const useDashboardHook = () => {

    const[profileUser, setProfileUser] = useState<UserType|null>();
    const pathname = usePathname()

    async function getUser(){
        try{
            const res = await axios.get("/api/user/"+pathname.split("/")[2]);
            console.log(res.data.user);
            setProfileUser(res.data.user);
        }
        catch(err){
            console.error(err);
        }
    }

    useEffect(()=>{
        getUser()
    },[])

  return { profileUser}
}
