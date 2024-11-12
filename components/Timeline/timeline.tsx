'use client'
import { useGlobalContext } from '@/context/MainContext';
import React, { memo } from 'react';
import { PostComponent } from '../Posts/postComponent';
import { UserType } from '@/types/types';
import { RiLoader5Fill } from 'react-icons/ri';
import { usePostsHook } from '@/lib/hooks/posts.hook';

const MemoizedPostComponent = memo(PostComponent);

export const Timeline = () => {
    const {
        getPosts,
        user,
        postsLoading,
        setPageIndex,
        lastPage,
        setPosts,
        posts,
        error
    } = usePostsHook();

    const handleLoadMore = () => {
        setPageIndex(prev => prev + 1);
    };

    if (error) {
        return (
            <div className="w-full h-40 flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="max-md:w-screen">
            <div className="p-4 text-2xl font-bold border-b-[1px] border-slate-400/20">
                Timeline
            </div>
            <div>
                {posts && posts.length > 0 ? (
                    posts.map((item) => (
                        <MemoizedPostComponent
                            key={item._id}
                            setPosts={setPosts}
                            dateData={String(item?.createdAt)}
                            getPosts={getPosts}
                            id={item?._id as string}
                            user={user as UserType}
                            image={item?.media}
                            userhandle={item?.createdBy?.userhandle as string}
                            userimage={item?.createdBy?.profileImage as string}
                            username={item?.createdBy?.username as string}
                            content={item?.content}
                        />
                    ))
                ) : (
                    <h3 className="w-full h-40 flex items-center justify-center border-b-[1px] border-slate-400/20 text-xl font-bold">
                        No posts yet
                    </h3>
                )}
                {!lastPage && (
                    <button
                        onClick={handleLoadMore}
                        disabled={postsLoading}
                        className="h-20 font-bold w-full hover:bg-slate-400/20 duration-200 disabled:opacity-50"
                    >
                        {postsLoading ? (
                            <div className="flex items-center justify-center text-2xl h-20">
                                <RiLoader5Fill className="animate-spin" />
                            </div>
                        ) : (
                            "SHOW MORE"
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};