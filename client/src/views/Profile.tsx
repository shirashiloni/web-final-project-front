import React from 'react';
import PostList from '../components/PostList';
import { Box, Button, Typography, Avatar } from '@mui/material';

const ProfileView: React.FC = () => {
  const posts = [
    { id: 1, title: 'Post 1', content: 'This is the content of post 1.',  },
    { id: 2, title: 'Post 2', content: 'This is the content of post 2.' },
    { id: 3, title: 'Post 3', content: 'This is the content of post 3.' },
    { id: 4, title: 'Post 4', content: 'This is the content of post 4.' },
    { id: 5, title: 'Post 5', content: 'This is the content of post 5.' },
    { id: 6, title: 'Post 6', content: 'This is the content of post 6.' },
    { id: 7, title: 'Post 7', content: 'This is the content of post 1.' },
    { id: 8, title: 'Post 8', content: 'This is the content of post 2.' },
    { id: 9, title: 'Post 9', content: 'This is the content of post 3.' },
    { id: 10, title: 'Post 10', content: 'This is the content of post 4.' },
  ];

  const handleLogout = () => {
    alert('Logged out!');
  };

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
          Username
        </Typography>
      </Box>

      <PostList posts={posts} />

      <Button
        variant="contained"
        color="error"
        sx={{ marginTop: '20px' }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
};

export default ProfileView;