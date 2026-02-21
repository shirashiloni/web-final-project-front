import { Stack } from '@mui/material';

import { type Post } from '../types/Post';
import PostPreview from './PostPreview';

interface PostListProps {
  posts: Post[];
  isOwner?: boolean;
}

const PostList = ({ posts, isOwner = false }: PostListProps) => {
  return (
    <Stack direction="row" flexWrap="wrap" justifyContent={'center'} gap={2}>
      {posts?.map((post) => (
        <PostPreview key={post._id ?? post.id} post={post} isOwner={isOwner} />
      ))}
    </Stack>
  );
};

export default PostList;
