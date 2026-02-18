import { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { Typography, CardContent, CardMedia, Card, IconButton, Stack } from '@mui/material';

import type { Post } from '../types/Post';

type PostPreviewProps = {
  post: Post;
};

const PostPreview = ({ post }: PostPreviewProps) => {
  const { caption, imageUrl } = post;
  const [likes] = useState(0);
  const [comments] = useState(0);

  return (
    <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(240, 240, 241, 1)', margin: 1 }}>
      <CardMedia sx={{ width: '100%', aspectRatio: '1' }} image={`/api${imageUrl}`} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {caption}
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
          <IconButton disabled color="primary">
            <FavoriteIcon />
          </IconButton>
          <Typography variant="body2">{likes}</Typography>
        </Stack>

        <Stack direction={'row'} gap={1} alignItems={'center'} margin={1}>
          <IconButton disabled color="primary">
            <CommentIcon />
          </IconButton>
          <Typography variant="body2">{comments}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default PostPreview;
