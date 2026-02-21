import { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import PostModal from '../components/PostModal';
import type { Post } from '../types/Post';
import { usePosts } from '../hooks/usePosts';
import PostList from '../components/PostList';

const FeedView = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const { posts, isLoading, isError } = usePosts();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography color="error">Failed to load posts.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, pt: 3 }}>
      <Typography variant="h5" color="info" fontWeight={600} sx={{ mb: 2 }}>
        Explore
      </Typography>
      <PostList posts={posts} />

      {selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </Box>
  );
}

export default FeedView;
