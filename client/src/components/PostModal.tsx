import { Dialog, DialogContent, IconButton, Box, Typography, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import type { Post } from '../types/Post';

type PostModalProps = {
  post: Post | null;
  onClose: () => void;
};

const PostModal = ({ post, onClose }: PostModalProps) => {
  if (!post) return null;

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
              <IconButton disabled color="primary" size="small">
                <FavoriteIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2">0</Typography>
            </Stack>
            <Stack direction="row" gap={0.5} alignItems="center">
              <IconButton disabled color="primary" size="small">
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
