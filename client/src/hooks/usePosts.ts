import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getUserLikeStatus,
  getPostsBySmartSearch,
} from '../api/posts';
import type { IPostCreate, IPostUpdate, PostQuery } from '../types/Post';
import { useMemo } from 'react';

const getPostsByQuery = async (query: PostQuery) => {
  return await getPosts(query);
};

export function usePosts({ userId, smartSearch }: { userId?: string; smartSearch?: string } = {}) {
  const queryClient = useQueryClient();

  const postsQuery = { userId: userId ? userId : undefined };

  const queryKey = useMemo(() => {
    return ['posts', { userId, smartSearch }];
  }, [userId, smartSearch]);

  const {
    data: results,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      smartSearch
        ? getPostsBySmartSearch(smartSearch)
        : getPostsByQuery({ ...postsQuery, batches: 3, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (smartSearch) return undefined;
      if (lastPage.data.length < 3) return undefined;
      return lastPageParam + 3;
    },
  });
  const posts = useMemo(() => results?.pages.flatMap((p) => p.data) || [], [results]);

  const createMutation = useMutation({
    mutationFn: (data: IPostCreate) => createPost(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: IPostUpdate }) =>
      updatePost(postId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  const likeMutation = useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      likePost(postId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  const unlikeMutation = useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      unlikePost(postId, userId),
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    createMutation,
    updateMutation,
    deleteMutation,
    likeMutation,
    unlikeMutation,
    checkUserLiked,
  };
}
