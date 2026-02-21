import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, TextField, Typography, Stack, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';

import { usePosts } from '../hooks/usePosts';
import { uploadImage } from '../hooks/useFiles';
import { useUser } from '../hooks/useUser';
import { normalizeImageUrl } from '../utils/imageUtils';

interface PostFormProps {
  existingPost?: {
    caption: string;
    imageUrl: string;
    id: string;
  };
  onSuccess?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ existingPost, onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const { createMutation, updateMutation } = usePosts();

  const defaultValues = existingPost
    ? { caption: existingPost.caption, img: undefined }
    : { caption: undefined, img: undefined };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    
  } = useForm({
    defaultValues,
  });

  const [error, setError] = useState('');
  const [isPending, setPending] = useState(false);

  const [preview, setPreview] = useState<string | undefined>(
    normalizeImageUrl(existingPost?.imageUrl)
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (file: File, onChange: (value: File) => void) => {
    onChange(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, onChange: (value: File) => void) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      handleImageChange(file, onChange);
    }
  };

  const onSubmit = async (data: { caption?: string; img?: File }) => {
    setError('');
    try {
      setPending(true);

      if (existingPost) {
        let imageUrl = existingPost.imageUrl;
        if (data.img) {
          const uploadImageData = await uploadImage(data.img);
          imageUrl = uploadImageData.url;
        }
        await updateMutation.mutateAsync({ postId: existingPost.id, data: { caption: data.caption, imageUrl } });
        setPending(false);
        reset();
        if (onSuccess) {
          onSuccess();
        }
      } else if (user) {
        const uploadImageData = await uploadImage(data.img!);
        await createMutation.mutateAsync({
          userId: user._id,
          caption: data.caption || '',
          imageUrl: uploadImageData.url,
        });
        setPending(false);
        reset();
        navigate('/explore');
      }
    } catch (err: unknown) {
      setPending(false);
      if (err instanceof Error) setError(err.message);
      else setError('Failed to upload post');
    }
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={4}
        sx={{ p: 4, justifyContent: 'center', alignItems: 'stretch' }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            flex: 1,
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Controller
            name="img"
            control={control}
            rules={{ required: existingPost ? false : 'Image is required' }}
            render={({ field: { onChange } }) => (
              <Box
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, onChange)}
                onClick={() => fileInputRef.current?.click()}
                sx={{ cursor: 'pointer' }}
              >
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  style={{ display: 'none' }}
                  id="image-upload"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageChange(file, onChange);
                    }
                  }}
                />

                {preview ? (
                  <Box sx={{ position: 'relative', display: 'inline-block', marginTop: 5 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreview(undefined);
                        onChange(undefined);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        zIndex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        width: 400,
                        height: 250,
                        objectFit: 'cover',
                        borderRadius: '8px',
                        display: 'block',
                      }}
                    />
                  </Box>
                ) : (
                  <Box marginTop={5} height={250}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <AddPhotoAlternateIcon
                        sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }}
                      />
                      <Typography variant="body1" color="text.primary" fontWeight="medium">
                        Drag & Drop or Click
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      to upload an image
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          />
          <Controller
            name="caption"
            control={control}
            rules={{ required: 'Caption is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Caption"
                variant="outlined"
                fullWidth
                error={!!errors.caption}
                helperText={errors.caption ? errors.caption.message : ' '}
              />
            )}
          />
          {isPending ? (
            <Typography>{existingPost ? 'Saving...' : 'Uploading...'}</Typography>
          ) : (
            <Button type="submit" variant="contained">
              {existingPost ? 'Save Changes' : 'Upload Post'}
            </Button>
          )}
        </Box>
      </Stack>
    </>
  );
};

export default PostForm;
