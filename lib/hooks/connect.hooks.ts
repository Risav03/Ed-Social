import React, { Dispatch, SetStateAction, useState } from 'react'
import axios from "axios"
import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from 'react-toastify';
import { usernameLimit } from '../constants';

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

        if(username.length > usernameLimit){
            toast.error("Username cannot exceed " + usernameLimit + " characters.");
            return;
        }

        if(!repwd){
            toast.error("Re-enter password to continue");
            return;
        }
        try {
            await axios.post("/api/user/register", { email: email, username: username, pwd: pwd });
            toast.success("Successfully registered! Redirecting...");

            await login()
        }
        catch (err:any) {
            console.error(err);
            toast.error(err?.response?.data?.message);
        }
    }

    async function login() {
        try {
            const res = await signIn("credentials", {
                email: email,
                password: pwd,
                redirect: false,
            });

            // @ts-ignore
            if (res?.error) {
                toast.error(res.error);
            } else {
                setLoginModal(false);
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    return {
        email, setEmail, username, setUsername, pwd, setPwd, type, setType, login, register, repwd, setRepwd
    }
}
