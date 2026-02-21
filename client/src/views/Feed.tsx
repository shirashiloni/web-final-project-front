import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import PostModal from '../components/PostModal';
import type { Post } from '../types/Post';
import { usePosts } from '../hooks/usePosts';
import PostList from '../components/PostList';

const FeedView = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 1000);
    return () => clearTimeout(handler);
  }, [search]);

  const postsQuery = useMemo(() => ({ smartSearch: debouncedSearch }), [debouncedSearch]);
  const { posts, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(postsQuery);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight > clientHeight && scrollHeight - scrollTop <= clientHeight + 100) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, pt: 3 }}>
      <Typography variant="h5" color="info" fontWeight={600} sx={{ mb: 2 }}>
        Explore
      </Typography>
      <Box sx={{ mb: 2 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts by content..."
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography color="error">Failed to load posts.</Typography>
        </Box>
      ) : (
        <>
          <PostList posts={posts} />
          {isFetchingNextPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
              <CircularProgress size={30} />
            </Box>
          )}
        </>
      )}

      {selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </Box>
  );
};

export default FeedView;
