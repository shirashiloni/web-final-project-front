import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Comment } from '../types/Comment';
import { useEffect, useState } from 'react';
import { getUserById } from '../api/users';
import { useUser } from '../hooks/useUser';

interface CommentItemProps {
    comment: Comment;
    userId?: string;
    onDelete?: (commentId: string) => void;
}

const CommentItem = ({ comment, onDelete }: CommentItemProps) => {
    const { user } = useUser();
    const userId = user?._id;
    const [commentUserName, setCommentUserName] = useState<string>('');

    useEffect(() => {
        let mounted = true;
        getUserById(comment.userId)
            .then(u => { if (mounted) setCommentUserName(u.name); })
            .catch(() => { if (mounted) setCommentUserName('Unknown User'); });
        return () => { mounted = false; };
    }, [comment.userId]);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="subtitle2" color="text.secondary">
                    {commentUserName || 'Unknown User'}
                </Typography>
                <Typography variant="body2">{comment.content}</Typography>
            </Box>
            {userId && comment.userId === userId && onDelete && (
                <IconButton size="small" color="error" onClick={() => onDelete(comment._id)}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            )}
        </Box>
    );
};

export default CommentItem;
