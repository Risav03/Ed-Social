'use client'
import React, { memo, useCallback } from 'react'
import { PostComponent } from './postComponent'
import { UserType } from '@/types/types'
import { RiLoader5Fill } from 'react-icons/ri'
import { usePostsHook } from '@/lib/hooks/posts.hook'

const MemoizedPostComponent = memo(PostComponent);

const LoadMoreButton = memo(({ onClick, isLoading }: { 
  onClick: () => void, 
  isLoading: boolean 
}) => (
  <button 
    onClick={onClick}
    disabled={isLoading}
    className="h-20 font-bold w-full hover:bg-slate-400/20 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? (
      <div className="flex items-center justify-center text-2xl h-20">
        <RiLoader5Fill className="animate-spin" />
      </div>
    ) : (
      "SHOW MORE"
    )}
  </button>
));

LoadMoreButton.displayName = 'LoadMoreButton';

const EmptyState = memo(() => (
  <h3 className="w-full h-40 flex items-center justify-center border-b-[1px] border-slate-400/20 text-xl font-bold">
    No Posts yet :(
  </h3>
));

EmptyState.displayName = 'EmptyState';

export const PostFetcher = () => {
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

  const handleLoadMore = useCallback(() => {
    setPageIndex(prev => prev + 1);
  }, [setPageIndex]);

  if (error) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="relative">

      {posts?.length > 0 ? (
        <>
          {posts.map((item) => (
            <MemoizedPostComponent
              key={item._id} // Ensure unique key
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
          ))}

          {!lastPage && (
            <LoadMoreButton 
              onClick={handleLoadMore} 
              isLoading={postsLoading} 
            />
          )}
        </>
      ) : (
        !postsLoading && <EmptyState />
      )}

      {postsLoading && !posts?.length && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50">
          <RiLoader5Fill className="animate-spin text-4xl" />
        </div>
      )}
    </div>
  );
};

export const MemoizedPostFetcher = memo(PostFetcher);