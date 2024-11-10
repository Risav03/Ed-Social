import React, { Dispatch, SetStateAction, useState } from 'react'
import axios from "axios"
import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from 'react-toastify';

export const useConnectHook = ({ setLoginModal }: { setLoginModal: Dispatch<SetStateAction<boolean>> }) => {

    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [pwd, setPwd] = useState<string>("");
    const [repwd, setRepwd] = useState<string>("");

    const [type, setType] = useState<string>("login")

    async function register() {
        if(email == "" || pwd == "" || username == ""){
            toast.error("Enter valid credentials!");
            return;
        }

        if(!repwd){
            toast.error("Re-enter password to continue");
            return;
        }
        try {
            await axios.post("/api/user/register", { email: email, username: username, pwd: pwd });
            toast.success("Successfully registered! Redirecting...");

            login()
        }
        catch (err) {
            console.log(err);
        }
    }

    async function login() {
        try {
            signIn("credentials", {
                email: email,
                password: pwd,
            });
            setLoginModal(false);
        }
        catch (err) {
            console.log(err);
        }
    }

    return {
        email, setEmail, username, setUsername, pwd, setPwd, type, setType, login, register, repwd, setRepwd
    }
}
