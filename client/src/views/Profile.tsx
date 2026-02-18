import React from 'react';
import PostList from '../components/PostList';
import { Box, Button, Typography, Avatar } from '@mui/material';
import { useLogout } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { getUsersPosts } from '../api/posts';
import { useQuery } from '@tanstack/react-query';

const ProfileView: React.FC = () => {
  const handleLogout = useLogout();
  const { user } = useUser();

  const response = useQuery({
    queryKey: ['posts'],
    queryFn: () => getUsersPosts(user!._id),
    enabled: !!user?._id,
  });

  const posts = response.data;

  return (
    <Box
      sx={{
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Box
        sx={{
          zIndex: 1,
          top: 64,
          backgroundColor: '#f0f0f0',
          paddingBottom: '10px',
        }}
      >
        <Avatar
          src="/src/assets/avatar.png"
          alt="User Avatar"
          sx={{
            width: '200px',
            height: '200px',
            margin: '0 auto',
          }}
        />
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
          {user!.name}
        </Typography>
      </Box>

      <PostList posts={posts ? posts : []} />

      <Button variant="contained" color="error" sx={{ marginTop: '20px' }} onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default ProfileView;
