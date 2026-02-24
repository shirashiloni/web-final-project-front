import { useEffect, useState } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useUser } from '../hooks/useUser';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import {
  Typography,
  CardContent,
  CardMedia,
  Card,
  IconButton,
  Stack,
  Box,
} from '@mui/material';

import type { Post } from '../types/Post';
import PostMenu from './PostMenu';
import { normalizeImageUrl } from '../utils/imageUtils';

type PostPreviewProps = {
  post: Post;
  isOwner?: boolean;
  onClick?: () => void;
};

const PostPreview = ({ post, onClick }: PostPreviewProps) => {
  const { caption, imageUrl } = post;
  const postId = post._id ?? String(post.id);
  const commentsCount = post.commentsCount || 0;

  const { user } = useUser();
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const isOwner = user && (post.userId === user._id);
  const [liked, setLiked] = useState(false);

  const { likeMutation, unlikeMutation, checkUserLiked } = usePosts();

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
    <>
      <Card
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid rgba(240, 240, 241, 1)',
          margin: 1,
          position: 'relative',
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}
      >

        {isOwner && (<Box sx={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}>
          <PostMenu post={post} />
        </Box>)
        }
        <CardMedia
          sx={{ width: '100%', aspectRatio: '1' }}
          image={normalizeImageUrl(imageUrl)}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {caption || 'Post Title'}
          </Typography>
        </CardContent>
        <Stack
          direction={'row'}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack direction={'row'} gap={1} alignItems={'center'} margin={1}>
            <IconButton
              color={liked ? 'error' : 'default'}
              onClick={onClickLike}
            >
              <FavoriteIcon />
            </IconButton>
            <Typography variant="body2">{likeCount}</Typography>
          </Stack>

          <Stack direction={'row'} gap={1} alignItems={'center'} margin={1}>
            <IconButton color="primary">
              <CommentIcon />
            </IconButton>
            <Typography variant="body2">{commentsCount}</Typography>

          </Stack>
        </Stack>
      </Card >
    </>
  );
};

export default PostPreview;
