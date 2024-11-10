import React, { Dispatch, SetStateAction } from 'react'
import { Card } from '../UI/card'
import { TextInput } from '../UI/textInput'
import { useConnectHook } from '@/hooks/connect.hooks'
import { RxCross2 } from "react-icons/rx";
import { ActionButton } from '../UI/actionButton';

export const ConnectModal = ({ setLoginModal }: { setLoginModal: Dispatch<SetStateAction<boolean>> }) => {

    const { email, setEmail, username, setUsername, pwd, setPwd, type, setType, register, login, repwd, setRepwd } = useConnectHook({setLoginModal})

    return (
        <div className='w-screen h-screen bg-white/5 backdrop-blur-lg fixed top-0 left-0 z-[50] flex items-center justify-center'>
            <Card className='w-80' >
                {type == "login" ? <>
                    <div className='flex gap-2 items-center text-slate-400'>
                        <h2 className='text-2xl w-1/2 font-bold'>Login</h2>
                        <div className='w-1/2 flex justify-end'>
                            <button onClick={() => { setLoginModal(false) }} className='hover:text-red-500 duration-200'><RxCross2 /></button>
                        </div>
                    </div>

                    <TextInput  required={true} content={email} heading='Email' placeholder='Enter an email' setContent={setEmail} />
                    <TextInput required={true} content={pwd} heading='Password' placeholder='Enter a password' setContent={setPwd} type='password' />

                    <h3 className='text-sm my-4'>Don't have an account? <span onClick={() => { setType("register") }} className='font-semibold text-slate-400'>Make one!</span></h3>

                    <ActionButton onClick={login} action='Login' />
                    </> :
                    <>
                        <div className='flex gap-2 items-center text-slate-400'>
                            <h2 className='text-2xl w-1/2 font-bold'>Register</h2>
                            <div className='w-1/2 flex justify-end'>
                                <button onClick={() => { setLoginModal(false) }} className='hover:text-red-500 duration-200'><RxCross2 /></button>
                            </div>
                        </div>

                        <TextInput required={true} content={username} heading='Username' placeholder='Set a username' setContent={setUsername} />
                        <TextInput required={true} content={email} heading='Email' placeholder='Enter an email' setContent={setEmail} />
                        <TextInput required={true} content={pwd} heading='Password' placeholder='Enter a password' setContent={setPwd} type='password' />
                        <TextInput required={true} content={repwd} heading='Re-enter Password' placeholder='Re-enter password' setContent={setRepwd} type='password' />

                        { pwd && pwd !== repwd && <h2 className='text-red-500 text-sm'>Passwords do not match</h2>}

                        <h3 className='text-sm my-4'>Already have an account? <span onClick={() => { setType("login") }} className='font-semibold text-slate-400'>Login here!</span></h3>

                        <ActionButton onClick={register} action='Register' />
                    </>}
            </Card>
        </div>
    )
}
