"use client"
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import {toast} from "react-toastify"

export const useNavbarHooks = () => {

    const[loginModal, setLoginModal] = useState<boolean>(false);
    const[postModal, setPostModal] = useState<boolean>(false);
    const[postContent, setPostContent] = useState<string>("");
    const[postMedia, setPostMedia] = useState<File|null>();

    const{data:session} = useSession()

    async function post(){
        if(postContent == "" && !postMedia){
            toast.error("Either enter content or add media!")
        }
        try{
            const formdata = new FormData();
            formdata.append('content', postContent);
            formdata.append('media', postMedia as File);

            const res = await axios.post("/api/post/email/"+session?.user?.email, formdata);

            if(res){
                toast.success("Post created!")
            }

        }
        catch(err){
            console.log(err);
        }
    }

  return {
    loginModal, setLoginModal, post, postModal, setPostModal, postContent, setPostContent, postMedia, setPostMedia
  }
}
