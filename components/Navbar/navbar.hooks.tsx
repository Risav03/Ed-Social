"use client"
import React, { useState } from 'react'

export const useNavbarHooks = () => {

    const[loginModal, setLoginModal] = useState<boolean>(false);

    async function post(){
        try{

        }
        catch(err){
            console.log(err);
        }
    }

  return {
    loginModal, setLoginModal, post
  }
}
