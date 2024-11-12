"use client"
import { useGlobalContext } from '@/context/MainContext';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import {toast} from "react-toastify"
import { usePostsHook } from './posts.hook';
import { usePathname } from 'next/navigation';

export const useNavbarHooks = () => {

    const pathname = usePathname()

    const[loginModal, setLoginModal] = useState<boolean>(false);
    const[postModal, setPostModal] = useState<boolean>(false);
    const[postContent, setPostContent] = useState<string>("");
    const[postMedia, setPostMedia] = useState<File|null>();
    const{user, setFetch} = useGlobalContext()
    const{data:session} = useSession()
    const[loading, setLoading] = useState<boolean>(false);
    const[searchModal, setSearchModal] = useState<boolean>(false);

    async function post(){
        if(postContent == "" && !postMedia){
            toast.error("Either enter content or add media!")
        }
        if(postContent.length > 200){
            toast.error("Content length cannot exceed 200 characters.");
        }
        try{
            setLoading(true);
            const formdata = new FormData();
            formdata.append('content', postContent);

            if(postMedia){
                formdata.append('media', postMedia as File);
            }
            
            formdata.append('id', user?._id as string)

            const res = await axios.post("/api/post/email/"+session?.user?.email, formdata);

            if(res){
                toast.success("Post created!");
                setFetch((prev)=>!prev)
                setPostModal(false);
                setPostContent("");
                setPostMedia(null)
            }

        }
        catch(err){
            console.error(err);
        }
        finally{
            setLoading(false);
        }
    }

  return {
    loginModal, setLoginModal, post, postModal, setPostModal, postContent, setPostContent, postMedia, setPostMedia, loading, searchModal, setSearchModal
  }
}
