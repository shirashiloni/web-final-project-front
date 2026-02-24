import { Stack } from '@mui/material';

import { type Post } from '../types/Post';
import PostPreview from './PostPreview';
import PostModal from './PostModal';
import { useMemo, useState } from 'react';

interface PostListProps {
  posts: Post[];
  isOwner?: boolean;
}

const PostList = ({ posts }: PostListProps) => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const selectedPost = useMemo(() => {
    return posts.find((post) => post._id === selectedPostId) || null;
  }, [selectedPostId, posts]);

  return (
    <>
      <Stack direction="row" flexWrap="wrap" justifyContent={'center'} gap={2}>
        {posts?.map((post) => (
          <PostPreview
            key={post._id ?? post.id}
            post={post}
            onClick={() => setSelectedPostId(post._id!)}
          />
        ))}
      </Stack>
      {selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPostId(null)} />}
    </>
  );
};

export default PostList;
