'use client'
import { useGlobalContext } from '@/context/MainContext';
import { PostType } from '@/types/types';
import axios, { AxiosError } from 'axios';
import { useEffect, useCallback, useRef, useState } from 'react';

const axiosInstance = axios.create({
    timeout: 15000,
    headers: {
        'Cache-Control': 'no-cache',
    },
    validateStatus: (status) => {
        return status >= 200 && status < 300 || status === 504;
    }
});

interface RetryConfig {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
}

const retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 5000
};

export const usePostsHook = ({ pathname }: { pathname: string }) => {
    const { setPageIndex, pageIndex, user, fetch } = useGlobalContext();

    const loadingRef = useRef(false);
    const previousFetchRef = useRef(fetch);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [lastPage, setLastPage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isUserReady, setIsUserReady] = useState(false);

    const resetState = useCallback(() => {
        setPageIndex(0);
        setLastPage(false);
        setError(null);
        setPosts([]);
        loadingRef.current = false;
    }, [setPageIndex]);

    const getRetryDelay = (retryCount: number): number => {
        const delay = Math.min(
            retryConfig.baseDelay * Math.pow(2, retryCount),
            retryConfig.maxDelay
        );
        return delay + Math.random() * 1000;
    };

    const getPosts = useCallback(async (retryCount = 0) => {
        if (loadingRef.current || !isUserReady) return;
        loadingRef.current = true;
        setPostsLoading(true);
        setError(null);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);

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
                const axiosError = err as AxiosError;
                
                if (axiosError.response?.status === 504 && retryCount < retryConfig.maxRetries) {
                    const delay = getRetryDelay(retryCount);
                    loadingRef.current = false;
                    setPostsLoading(false);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return getPosts(retryCount + 1);
                }

                setError(retryCount === retryConfig.maxRetries ? 
                    'Service temporarily unavailable. Please try again later.' : 
                    'Failed to fetch posts');
                console.error('Error fetching posts:', err);
            }
        } finally {
            setPostsLoading(false);
            loadingRef.current = false;
        }
    }, [pageIndex, pathname, isUserReady]);

    useEffect(() => {
        resetState();
    }, [pathname, resetState]);

    useEffect(() => {
        if (previousFetchRef.current !== fetch) {
            resetState();
            previousFetchRef.current = fetch;
        }
    }, [fetch, resetState]);

    useEffect(() => {
        if (user !== undefined) {
            setIsUserReady(true);
        }
    }, [user]);

    useEffect(() => {
        if (!isUserReady) return;

        if (pageIndex === 0) {
            getPosts();
            return;
        }

        if (pageIndex > 0 && posts.length > 0) {
            getPosts();
        }
    }, [pageIndex, pathname, isUserReady, getPosts, posts.length]);

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