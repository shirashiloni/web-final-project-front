import { useState } from 'react';
import { Box, CircularProgress, Typography, ImageList, ImageListItem } from '@mui/material';
import PostModal from '../components/PostModal';
import type { Post } from '../types/Post';
import { usePosts } from '../hooks/usePosts';

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
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Explore
      </Typography>

      {posts.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" mt={6}>
          No posts yet.
        </Typography>
      ) : (
        <ImageList cols={3} gap={4}>
          {posts.map((post) => (
            <ImageListItem
              key={post.id}
              onClick={() => setSelectedPost(post)}
              sx={{
                cursor: 'pointer',
                overflow: 'hidden',
                aspectRatio: '1',
                '& img': {
                  transition: 'transform 0.25s ease, opacity 0.25s ease',
                },
                '&:hover img': {
                  transform: 'scale(1.05)',
                  opacity: 0.85,
                },
              }}
            >
              <img
                src={`/api${post.imageUrl}`}
                alt={post.caption}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </Box>
  );
};

export default FeedView;
