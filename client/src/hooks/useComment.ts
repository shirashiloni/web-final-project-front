import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment, deleteComment, getComments } from '../api/comment';
import { useUser } from './useUser';

export function useComment(postId: string) {
    const queryClient = useQueryClient();

    const {
        data: commentsData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['comments', postId],
        queryFn: () => getComments(postId),
    });

    const { user } = useUser();

    const createCommentMutation = useMutation({
        mutationFn: ({ content }: { content: string }) => createComment(postId, content, user!._id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', postId] }),
    });

    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: string) => deleteComment(commentId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', postId] }),
    });

    return {
        comments: commentsData?.data || [],
        isLoading,
        isError,
        createCommentMutation,
        deleteCommentMutation,
    };
}
