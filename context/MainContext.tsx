"use client";

import { EditProfile } from "@/components/Dashboard/EditProfile/editProfile";
import { PostType, UserType } from "@/types/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { createContext, useContext, Dispatch, SetStateAction, useState, ReactNode, useEffect } from "react";

type GlobalContextType = {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  posts: Array<PostType | null> | null;
  setPosts: Dispatch<SetStateAction<Array<PostType>>>;
  getUser: () => void;
  showSearch: boolean;
  setShowSearch: Dispatch<SetStateAction<boolean>>;
  postsLoading: boolean;
  setPostsLoading: Dispatch<SetStateAction<boolean>>;
  lastPage: boolean;
  setLastPage: Dispatch<SetStateAction<boolean>>;
  showSidebar: boolean;
  pageIndex: number;
  setPageIndex: Dispatch<SetStateAction<number>>;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
  getPosts: () => void;
  editProfile: boolean;
  setEditProfile: Dispatch<SetStateAction<boolean>>;

}

const GlobalContext = createContext<GlobalContextType>({
  user: null,
  setUser: () => { },
  getUser: () => { },
  getPosts: () => {},
  posts: null,
  setPosts: ()=>{},
  pageIndex: 1,
  setPageIndex:()=>{},
  showSearch: false,
  setShowSearch: () => { },
  lastPage:false,
  setLastPage:() => {},
  postsLoading: false,
  setPostsLoading: () => { },
  showSidebar: false,
  setShowSidebar: () => { },
  editProfile: false,
  setEditProfile: () => { },

});

export const GlobalContextProvider = ({ children } : { children: ReactNode}) => {

  const [user, setUser] = useState<UserType | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const {data: session} = useSession();

  const[posts, setPosts] = useState<Array<PostType>>([]);
  const[postsLoading, setPostsLoading] = useState<boolean>(false);
  const[lastPage, setLastPage] = useState<boolean>(false);

  const[pageIndex, setPageIndex] = useState<number>(0);


    const pathname = usePathname()

    async function getPosts(){
      setPostsLoading(true);
        try{
          if(pathname == "/"){
            const res = await axios.get("/api/post"+"?pageIndex="+pageIndex+"&pageSize=10");
            console.log(res.data.posts)
            res.data.posts.map((item:PostType)=>{
              setPosts((prev) => [...prev , item])
            })
            setLastPage(res?.data?.isLastPage);
          }
          else if(pathname.includes("profile")){
            const res = await axios.get("/api/post/"+pathname.split("/")[2]);
            setPosts(res.data.posts)
          }
            
        }
        catch(err){
            console.error(err);
        }
        finally{
          setPostsLoading(false)
        }
    }

    useEffect(()=>{
        getPosts()
    },[pageIndex, pathname])

    useEffect(()=>{
      setPageIndex(0);
      setLastPage(false);
      setPosts([]);
    },[pathname])


  const[editProfile, setEditProfile] = useState<boolean>(false);

  async function getUser(){
    try{
      // @ts-ignore
      const res = await axios.get(`/api/user/email/${session?.user.email}`);
      console.log(session?.user);
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
      user, setUser, getUser, postsLoading, setPostsLoading, pageIndex, setPageIndex, lastPage, setLastPage,
      showSearch, setShowSearch,
      showSidebar, setShowSidebar,
      editProfile, setEditProfile, posts, getPosts, setPosts
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
