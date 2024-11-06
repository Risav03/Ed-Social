"use client"
import React, { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { GlobalContextProvider } from '@/context/MainContext'

export const Providers = ({children}:{children:ReactNode}) => {

  return (
    <SessionProvider>
      <GlobalContextProvider>
       {children}
      </GlobalContextProvider>
    </SessionProvider>
  )
}
