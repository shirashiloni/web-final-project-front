import { Dialog, DialogContent, IconButton, Box, Typography, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import type { Post } from '../types/Post';
import { useEffect, useState } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useUser } from '../hooks/useUser';

type PostModalProps = {
  post: Post;
  onClose: () => void;
};

const PostModal = ({ post, onClose }: PostModalProps) => {
  const { user } = useUser();
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
  const [liked, setLiked] = useState(false);
  const { likeMutation, unlikeMutation, checkUserLiked } = usePosts();

  const postId = post._id ?? String(post.id);

  useEffect(() => {
    if (user && postId) {
      checkUserLiked(postId, user._id).then(setLiked);
    }
  }, [user, postId, checkUserLiked]);


  const onClickLike = async () => {
    if (!user) return;
    if (liked) {
      const res = await unlikeMutation.mutateAsync({ postId, userId: user._id });
      setLikeCount(res.likeCount);
      setLiked(false);
    } else {
      const res = await likeMutation.mutateAsync({ postId, userId: user._id });
      setLikeCount(res.likeCount);
      setLiked(true);
    }
  };

  return (
    <Dialog open={!!post} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ position: 'relative' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <CloseIcon />
        </IconButton>

        <Box
          component="img"
          src={
            post.imageUrl?.startsWith('blob:') || post.imageUrl?.startsWith('http')
              ? post.imageUrl
              : `/api${post.imageUrl}`
          }
          alt={post.caption}
          sx={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
        />

        <DialogContent>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {post.caption}
          </Typography>

          <Stack direction="row" gap={2} alignItems="center">
            <Stack direction="row" gap={0.5} alignItems="center">
              <IconButton
                color={liked ? "error" : "default"}
                size="small"
                onClick={onClickLike}
              >
                <FavoriteIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2">{likeCount}</Typography>
            </Stack>
            <Stack direction="row" gap={0.5} alignItems="center">
              <IconButton disabled color="default" size="small">
                <CommentIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2">0</Typography>
            </Stack>
          </Stack>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default PostModal;
