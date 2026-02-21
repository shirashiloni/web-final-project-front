import { Box, Typography, Stack } from '@mui/material';
import CommentItem from './CommentItem';
import { useComment } from '../hooks/useComment';
import { useState } from 'react';

interface CommentsSectionProps {
  postId: string;
  userId?: string;
}

const CommentsSection = ({ userId, postId }: CommentsSectionProps) => {
  const { comments, createCommentMutation, deleteCommentMutation } = useComment(postId);
  const [commentInput, setCommentInput] = useState('');

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1">Comments</Typography>
      <Stack gap={1} sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
        {comments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No comments yet.</Typography>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              userId={userId}
              onDelete={id => deleteCommentMutation.mutateAsync(id)}
            />
          ))
        )}
      </Stack>
      {userId && (
        <Stack direction="row" gap={1}>
          <input
            type="text"
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            onClick={async () => {
              if (!commentInput.trim()) return;
              await createCommentMutation.mutateAsync({ content: commentInput });
              setCommentInput('');
            }}
            disabled={createCommentMutation.isPending || !commentInput.trim()}
            style={{ padding: '8px 16px', borderRadius: '4px', background: '#1976d2', color: '#fff', border: 'none' }}
          >
            {createCommentMutation.isPending ? 'Adding...' : 'Comment'}
          </button>
        </Stack>
      )}
    </Box>
  );
};

export default CommentsSection;
