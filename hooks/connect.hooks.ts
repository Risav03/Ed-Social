import React, { Dispatch, SetStateAction, useState } from 'react'
import axios from "axios"
import { signIn, signOut, useSession } from "next-auth/react";

export const useConnectHook = ({ setLoginModal }: { setLoginModal: Dispatch<SetStateAction<boolean>> }) => {

    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [pwd, setPwd] = useState<string>("");

    const [type, setType] = useState<string>("login")

    async function register() {
        try {
            const res = await axios.post("/api/user/register", { email: email, username: username, pwd: pwd });
            console.log(res);
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
        email, setEmail, username, setUsername, pwd, setPwd, type, setType, login, register
    }
}
