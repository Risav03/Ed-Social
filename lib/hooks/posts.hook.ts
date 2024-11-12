'use client'
import { useGlobalContext } from '@/context/MainContext';
import { PostType } from '@/types/types';
import axios from 'axios';
import { useEffect, useCallback, useRef, useState } from 'react';
import { useNavbarHooks } from './navbar.hooks';

const axiosInstance = axios.create({
    timeout: 10000,
    headers: {
        'Cache-Control': 'no-cache',
    }
});

export const usePostsHook = ({ pathname }: { pathname: string }) => {

    const { setPageIndex, pageIndex, user } = useGlobalContext();

    const loadingRef = useRef(false);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [lastPage, setLastPage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { post } = useNavbarHooks()

    const getPosts = useCallback(async () => {

        if (loadingRef.current) return;
        loadingRef.current = true;
        setPostsLoading(true);
        setError(null);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const baseUrl = '/api/post';
            const params = new URLSearchParams({
                pageIndex: pageIndex.toString(),
                pageSize: '10'
            });

            const url = pathname === '/'
                ? `${baseUrl}?${params}`
                : pathname.includes('profile')
                    ? `${baseUrl}/${pathname.split('/')[2]}?${params}`
                    : null;

            if (!url) throw new Error('Invalid pathname');

            const res = await axiosInstance.get(url, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            setPosts(prevPosts => {
                const newPosts = res.data.posts.filter(
                    (newPost: PostType) => !prevPosts.some(
                        existing => existing._id === newPost._id
                    )
                );
                return [...prevPosts, ...newPosts];
            });

            setLastPage(res.data.isLastPage);
        } catch (err) {
            if (axios.isCancel(err)) {
                setError('Request timed out');
            } else {
                setError('Failed to fetch posts');
                console.error('Error fetching posts:', err);
            }
        } finally {
            setPostsLoading(false);
            loadingRef.current = false;
        }
    }, [pageIndex, pathname]);


    useEffect(() => {
        setPageIndex(0);
        setLastPage(false);
        setPosts([]);
        setError(null);
    }, [pathname, setPageIndex]);

    useEffect(() => {
            setPosts([]);
            getPosts()
        
    }, [])


    useEffect(() => {
        getPosts();
    }, [getPosts, user]);

    return {
        posts,
        postsLoading,
        lastPage,
        error,
        getPosts,
        setPosts,
        setPageIndex,
        user
    };
};