import React, { useMemo } from 'react';
import PostList from '../components/PostList';
import { Box, Button, Typography, Avatar } from '@mui/material';
import { useLogout } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { usePosts } from '../hooks/usePosts';
import { updateProfileImage } from '../api/users';
import { uploadImage } from '../hooks/useFiles';
import { normalizeImageUrl } from '../utils/imageUtils';

const ProfileView: React.FC = () => {
  const handleLogout = useLogout();
  const { user, refeach } = useUser();
  const { posts } = usePosts(user?._id);
  const [imageUrl, setImageUrl] = React.useState(user?.profileImage || '/src/assets/avatar.png');
  const [uploading, setUploading] = React.useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      await updateProfileImage(user._id, url);
      setImageUrl(url);
      refeach();
    } finally {
      setUploading(false);
    }
  };

  const normalImageUrl = useMemo(() => {
    return normalizeImageUrl(imageUrl);
  }, [imageUrl]);

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
          src={normalImageUrl}
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
        <input
          type="file"
          accept="image/*"
          style={{ display: 'block', margin: '0 auto 10px auto' }}
          onChange={handleImageChange}
          disabled={uploading}
        />
        {uploading && <Typography variant="body2">Uploading...</Typography>}
      </Box>

      <PostList posts={posts ? posts : []} isOwner={true} />

      <Button variant="contained" color="error" sx={{ marginTop: '20px' }} onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default ProfileView;
