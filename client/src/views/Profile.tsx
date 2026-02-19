import React, { useState } from 'react';
import PostList from '../components/PostList';
import { Box, Button, Typography, Avatar, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useLogout } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { getUsersPosts } from '../api/posts';
import { useQuery } from '@tanstack/react-query';
import EditProfileDialog from '../components/EditProfileDialog';

const normalizeImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('blob:') || url.startsWith('http') || url.startsWith('/api')) return url;
  return `/api${url}`;
};

const ProfileView: React.FC = () => {
  const handleLogout = useLogout();
  const { user } = useUser();
  const [editOpen, setEditOpen] = useState(false);

  const response = useQuery({
    queryKey: ['user-posts', user?._id],
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
        {/* Avatar with edit button */}
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={normalizeImageUrl(user?.profileImage) ?? '/src/assets/avatar.png'}
            alt="User Avatar"
            sx={{ width: '200px', height: '200px', margin: '0 auto' }}
          />
          <IconButton
            onClick={() => setEditOpen(true)}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': { backgroundColor: 'primary.dark' },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="h6" sx={{ marginBottom: '20px', marginTop: '8px' }}>
          {user!.name}
        </Typography>
      </Box>

      <PostList posts={posts ? posts : []} isOwner={true} />

      <Button variant="contained" color="error" sx={{ marginTop: '20px' }} onClick={handleLogout}>
        Logout
      </Button>

      <EditProfileDialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
        }}
      />
    </Box>
  );
};

export default ProfileView;
