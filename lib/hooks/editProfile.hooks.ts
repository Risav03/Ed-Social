'use client'
import { useGlobalContext } from '@/context/MainContext';
import { UserType } from '@/types/types';
import axios from 'axios';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export const useEditProfileHooks = ({user}:{user:UserType | null}) => {

    const{data:session} = useSession();
    const{getUser, setEditProfile} = useGlobalContext()
    const router = useRouter();
   const[username, setUsername] = useState<string>("") 
   const[userhandle, setUserhandle] = useState<string>("")
   const[bio, setBio] = useState<string>("") 
   const[banner, setBanner] = useState<File|null>();
   const[profilePic, setProfilePic] = useState<File|null>();
   const[loading, setLoading] = useState<boolean>(false);

   async function updateInfo(){
    try{
        setLoading(true);
        const formdata = new FormData();
        formdata.append('username', username);
        formdata.append('userhandle', userhandle.toLowerCase());
        formdata.append('bio', bio);

        if(bio.length > 200){
            toast.error("Bio cannot exceed 200 characters.")
        }

        if(profilePic){
            formdata.append('profilePic', profilePic as File);
        }
        if(banner){
            formdata.append('banner', banner as File);
        }

        const res = await axios.patch("/api/user/email/"+session?.user?.email, formdata);


        if(res){
            setEditProfile(false);
            
            if(userhandle != user?.userhandle){
                router.push("/profile")
            }
        }
    }
    catch(err){
        console.error(err);
    }
    finally{
        getUser();
        setLoading(false);
    }
   }

   useEffect(()=>{
    if(user){
        setUserhandle(user.userhandle);
        setUsername(user.username);
        setBio(user.bio);
    }
   },[user])


  return {
    username, setUsername, userhandle, setUserhandle, bio, setBio, updateInfo, banner, setBanner, profilePic, setProfilePic, loading
  }
}
