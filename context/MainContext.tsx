"use client";

import { PostType, UserType } from "@/types/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { createContext, useContext, Dispatch, SetStateAction, useState, ReactNode, useEffect } from "react";

type GlobalContextType = {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  activeUser: UserType | null;
  setActiveUser: Dispatch<SetStateAction<UserType | null>>;
  getUser: () => void;
  pageIndex: number;
  setPageIndex: Dispatch<SetStateAction<number>>;
  editProfile: boolean;
  setEditProfile: Dispatch<SetStateAction<boolean>>;
  fetch: boolean;
  setFetch: Dispatch<SetStateAction<boolean>>

}

const GlobalContext = createContext<GlobalContextType>({
  user: null,
  setUser: () => { },
  activeUser: null,
  setActiveUser: () => { },
  getUser: () => { },
  pageIndex: 1,
  setPageIndex:()=>{},
  fetch: false,
  setFetch: () => { },
  editProfile: false,
  setEditProfile: () => { },

});

export const GlobalContextProvider = ({ children } : { children: ReactNode}) => {

  const [user, setUser] = useState<UserType | null>(null);
  const [activeUser, setActiveUser] = useState<UserType | null>(null);

  const {data: session} = useSession();

  const[fetch, setFetch] = useState<boolean>(false)

  const[pageIndex, setPageIndex] = useState<number>(0);

  const[editProfile, setEditProfile] = useState<boolean>(false);

  const pathname = usePathname()

  async function getUser(){

    try{
      // @ts-ignore
      if(pathname.split("/")[2] !== session?.user?.userhandle && pathname !== "/"){
        const res = await axios.get("/api/user/"+pathname.split("/")[2]);
        setUser(res.data.user);

      }
      // @ts-ignore
      else if(pathname == "/" || pathname.split("/")[2] === session?.user?.userhandle){
        // @ts-ignore
        const res = await axios.get(`/api/user/${session?.user.userhandle}`);
        setUser(res.data.user);
        setActiveUser(res.data.user)
      }
    }
    catch(err){
      console.error(err);
    }
  }

  useEffect(()=>{
    if(pathname)
      getUser();
  },[session, pathname])

  return (
    <GlobalContext.Provider value={{
      user, setUser, getUser, pageIndex, setPageIndex, fetch, setFetch, activeUser, setActiveUser,
      editProfile, setEditProfile,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
