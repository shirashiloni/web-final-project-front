import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation } from '@tanstack/react-query';

import { updateUser } from '../api/users';
import { uploadImage } from '../hooks/useFiles';
import { useUser } from '../hooks/useUser';
import type { User } from '../types/User';

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

const normalizeImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('blob:') || url.startsWith('http') || url.startsWith('/api')) return url;
  return `/api${url}`;
};

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ open, onClose }) => {
  const { user, setUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    normalizeImageUrl(user?.profileImage)
  );
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not logged in');
      let profileImage = user.profileImage;

      if (imageFile) {
        const uploaded = await uploadImage(imageFile);
        profileImage = uploaded.url;
      }

      return updateUser(user._id, { name, profileImage });
    },
    onSuccess: (updatedUser: User) => {
      setUser(updatedUser);
      onClose();
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    },
  });

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleClose = () => {
    // Reset state back to current user values on cancel
    setName(user?.name ?? '');
    setImageFile(null);
    setImagePreview(normalizeImageUrl(user?.profileImage));
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, pt: 1 }}>
          {/* Avatar picker */}
          <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={handleImageClick}>
            <Avatar src={imagePreview} sx={{ width: 100, height: 100 }} />
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': { backgroundColor: 'primary.dark' },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            Click avatar to change photo
          </Typography>

          {/* Username field */}
          <TextField
            label="Username"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !name.trim()}
        >
          {mutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;
