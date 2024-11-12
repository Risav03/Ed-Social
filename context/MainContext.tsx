"use client";

import { PostType, UserType } from "@/types/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { createContext, useContext, Dispatch, SetStateAction, useState, ReactNode, useEffect } from "react";

type GlobalContextType = {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  getUser: () => void;
  showSearch: boolean;
  setShowSearch: Dispatch<SetStateAction<boolean>>;
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
  getUser: () => { },
  pageIndex: 1,
  setPageIndex:()=>{},
  showSearch: false,
  setShowSearch: () => { },
  fetch: false,
  setFetch: () => { },
  editProfile: false,
  setEditProfile: () => { },

});

export const GlobalContextProvider = ({ children } : { children: ReactNode}) => {

  const [user, setUser] = useState<UserType | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const {data: session} = useSession();

  const[fetch, setFetch] = useState<boolean>(false)

  const[pageIndex, setPageIndex] = useState<number>(0);

  const[editProfile, setEditProfile] = useState<boolean>(false);

  async function getUser(){
    try{
      // @ts-ignore
      const res = await axios.get(`/api/user/email/${session?.user.email}`);
      setUser(res.data.user);
    }
    catch(err){
      console.error(err);
    }
  }

  useEffect(()=>{
    if(session){
      getUser();
    }
  },[session])

  useEffect(()=>{
    if(showSearch){
        setShowSidebar(false);
    }
  }, [showSearch])

  return (
    <GlobalContext.Provider value={{
      user, setUser, getUser, pageIndex, setPageIndex, fetch, setFetch,
      showSearch, setShowSearch,
      editProfile, setEditProfile,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
