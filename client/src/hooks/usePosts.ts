import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    getUserLikeStatus,
} from '../api/posts';
import type { IPostCreate, IPostUpdate, PostQuery } from '../types/Post';
import { useMemo } from 'react';

const getPostsByQuery = async (query: PostQuery) => {
    return await getPosts(query);
}

export function usePosts(userId?: string) {
    const queryClient = useQueryClient();

    const postsQuery = { userId: userId ? userId : undefined };

    const { data: results, isLoading, isError } = useQuery({
        queryKey: ['posts'],
        queryFn: () => getPostsByQuery(postsQuery),
    });
    const posts = useMemo(() => results?.data || [], [results]);

    const createMutation = useMutation({
        mutationFn: (data: IPostCreate) => createPost(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ postId, data }: { postId: string; data: IPostUpdate }) => updatePost(postId, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (postId: string) => deletePost(postId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
    });

    const likeMutation = useMutation({
        mutationFn: ({ postId, userId }: { postId: string; userId: string }) => likePost(postId, userId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
    });

    const unlikeMutation = useMutation({
        mutationFn: ({ postId, userId }: { postId: string; userId: string }) => unlikePost(postId, userId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
    });

    const checkUserLiked = async (postId: string, userId: string) => {
        const res = await getUserLikeStatus(postId, userId);
        return res.liked;
    };

    return {
        posts,
        isError,
        isLoading,
        createMutation,
        updateMutation,
        deleteMutation,
        likeMutation,
        unlikeMutation,
        checkUserLiked,
    };
}
