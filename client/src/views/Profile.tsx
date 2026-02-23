import React, { useMemo, useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Avatar,
  CircularProgress,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera,
} from '@mui/icons-material';
import { useLogout } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { usePosts } from '../hooks/usePosts';
import { updateUser } from '../api/users';
import { uploadImage } from '../hooks/useFiles';
import { normalizeImageUrl } from '../utils/imageUtils';
import PostsPreviewGrid from '../components/PostsPreviewGrid';

const ProfileView: React.FC = () => {
  const handleLogout = useLogout();
  const { user, refeach } = useUser();
  const { posts, fetchNextPage, hasNextPage, isFetchingNextPage } = usePosts({ userId: user?._id });
  const [imageUrl, setImageUrl] = useState(user?.profileImage || '/src/assets/avatar.png');
  const [uploading, setUploading] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [savingName, setSavingName] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      await updateUser(user._id, { profileImage: url });
      setImageUrl(url);
      refeach();
    } finally {
      setUploading(false);
    }
  };

  const handleSaveName = async () => {
    if (!user || !newName.trim()) return;
    setSavingName(true);
    try {
      await updateUser(user._id, { name: newName });
      setIsEditingName(false);
      refeach();
    } catch (error) {
      console.error('Failed to update name', error);
    } finally {
      setSavingName(false);
    }
  };

  const normalImageUrl = useMemo(() => {
    return normalizeImageUrl(imageUrl);
  }, [imageUrl]);

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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={normalImageUrl}
            alt="User Avatar"
            sx={{
              width: '200px',
              height: '200px',
              margin: '0 auto',
            }}
          />
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              backgroundColor: 'white',
              boxShadow: 1,
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            {uploading ? <CircularProgress size={24} /> : <PhotoCamera />}
          </IconButton>
        </Box>

        <Box
          sx={{
            mt: 3,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40px',
          }}
        >
          {isEditingName ? (
            <>
              <TextField
                variant="standard"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={savingName}
                autoFocus
                sx={{ input: { fontSize: '1.25rem', textAlign: 'center' } }}
              />
              <IconButton
                onClick={handleSaveName}
                disabled={savingName || !newName.trim()}
                color="success"
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                onClick={() => setIsEditingName(false)}
                disabled={savingName}
                color="error"
              >
                <CancelIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Typography variant="h6">{user!.name}</Typography>
              <IconButton onClick={() => setIsEditingName(true)} size="small" sx={{ ml: 1 }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>

        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleImageChange}
        />
      </Box>

      <PostsPreviewGrid posts={posts ? posts : []} />
      {isFetchingNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
          <CircularProgress size={30} />
        </Box>
      )}

      <Button variant="contained" color="error" sx={{ marginTop: '20px' }} onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default ProfileView;
