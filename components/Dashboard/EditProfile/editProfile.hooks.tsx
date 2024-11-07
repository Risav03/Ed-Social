'use client'
import { useGlobalContext } from '@/context/MainContext';
import axios from 'axios';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export const useEditProfileHooks = ({user}:{user:UserType | null}) => {

    const{data:session} = useSession();
    const{getUser, setEditProfile} = useGlobalContext()
    const router = useRouter();
   const[username, setUsername] = useState<string>("") 
   const[userhandle, setUserhandle] = useState<string>("")
   const[bio, setBio] = useState<string>("") 
   const[banner, setBanner] = useState<File|null>();
   const[profilePic, setProfilePic] = useState<File|null>();

   async function updateInfo(){
    try{
        const formdata = new FormData();
        formdata.append('username', username);
        formdata.append('userhandle', userhandle);
        formdata.append('bio', bio);

        if(profilePic){
            formdata.append('profilePic', profilePic as File);
        }
        if(banner){
            formdata.append('banner', banner as File);
        }

        const res = await axios.patch("/api/user/email/"+session?.user?.email, formdata);

        console.log(res);

        if(res){
            getUser();
            setEditProfile(false);

            if(userhandle != user?.userhandle){
                router.push("/")
            }
        }
    }
    catch(err){
        console.log(err);
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
    username, setUsername, userhandle, setUserhandle, bio, setBio, updateInfo, banner, setBanner, profilePic, setProfilePic
  }
}
