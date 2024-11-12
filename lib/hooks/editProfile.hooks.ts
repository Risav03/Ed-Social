'use client'
import { useGlobalContext } from '@/context/MainContext';
import { UserType } from '@/types/types';
import axios from 'axios';
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { usePostsHook } from './posts.hook';
import { descriptionLimit, userhandleLimit, usernameLimit } from '../constants';

export const useEditProfileHooks = ({user}:{user:UserType | null}) => {


    const pathname = usePathname()
    const{data:session} = useSession();
    const{getUser, setEditProfile} = useGlobalContext()
    const{getPosts} = usePostsHook({pathname})
    const router = useRouter();
   const[username, setUsername] = useState<string>("") 
   const[userhandle, setUserhandle] = useState<string>("")
   const[bio, setBio] = useState<string>("") 
   const[banner, setBanner] = useState<File|null>();
   const[profilePic, setProfilePic] = useState<File|null>();
   const[loading, setLoading] = useState<boolean>(false);

   async function updateInfo(){

    if(bio.length > descriptionLimit){
        toast.error("Bio cannot exceed " + descriptionLimit + " characters.");
        return;
    }

    if(username.length > usernameLimit){
        toast.error("Username cannot exceed " + usernameLimit + " characters.");
        return;
    }

    if(userhandle.length > userhandleLimit){
        toast.error("Username cannot exceed " + userhandleLimit + " characters.");
        return;
    }

    try{
        setLoading(true);
        const formdata = new FormData();
        formdata.append('username', username);
        formdata.append('userhandle', userhandle.toLowerCase());
        formdata.append('bio', bio);

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
        getPosts();
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
