import { useEffect, useState } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useUser } from '../hooks/useUser';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Typography,
  CardContent,
  CardMedia,
  Card,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

import type { Post } from '../types/Post';
import PostForm from './PostForm';

type PostPreviewProps = {
  post: Post;
  isOwner?: boolean;
};

const PostPreview = ({ post, isOwner = false }: PostPreviewProps) => {
  const { caption, imageUrl } = post;
  const postId = post._id ?? String(post.id);

  const { user } = useUser();
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [comments] = useState(0);
  const [liked, setLiked] = useState(false);


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // Delete confirm dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Edit mode state
  const [editOpen, setEditOpen] = useState(false);

  const { likeMutation, unlikeMutation, deleteMutation, checkUserLiked } = usePosts();

  useEffect(() => {
    if (user && postId) {
      checkUserLiked(postId, user._id).then(setLiked);
    }
  }, [user, postId, checkUserLiked]);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleEditClick = () => {
    handleMenuClose();
    setEditOpen(true);
  };

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
        }}
      >
        {isOwner && (
          <Box sx={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                backgroundColor: 'rgba(0,0,0,0.35)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleEditClick}>Edit</MenuItem>
              <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                Delete
              </MenuItem>
            </Menu>
          </Box>
        )}

        <CardMedia
          sx={{ width: '100%', aspectRatio: '1' }}
          image={
            imageUrl?.startsWith('blob:') ||
              imageUrl?.startsWith('http') ||
              imageUrl?.startsWith('/api')
              ? imageUrl
              : `/api${imageUrl}`
          }
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
            <IconButton disabled color="primary">
              <CommentIcon />
            </IconButton>
            <Typography variant="body2">{comments}</Typography>
          </Stack>
        </Stack>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              await deleteMutation.mutateAsync(postId);
              setDeleteDialogOpen(false);
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit post dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <PostForm
            existingPost={{ id: postId, caption: caption, imageUrl: imageUrl ?? '' }}
            onSuccess={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostPreview;
