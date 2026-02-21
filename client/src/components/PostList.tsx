import { Stack } from '@mui/material';

import { type Post } from '../types/Post';
import PostPreview from './PostPreview';
import PostModal from './PostModal';
import { useState } from 'react';

interface PostListProps {
  posts: Post[];
  isOwner?: boolean;
}

const PostList = ({ posts }: PostListProps) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  return (
    <>
      <Stack direction="row" flexWrap="wrap" justifyContent={'center'} gap={2}>
        {posts?.map((post) => (
          <PostPreview
            key={post._id ?? post.id}
            post={post}
            onClick={() => setSelectedPost(post)}
          />
        ))}
      </Stack>
      {selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </>
  );
};

export default PostList;
