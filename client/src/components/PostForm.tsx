import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import PostPreview from './PostPreview';
import { createPost } from '../api/posts';
import { uploadImage } from '../hooks/useFiles';

interface PostFormProps {
  existingPost?: {
    title: string;
    content: string;
    imageUrl: string;
    id: string;
  };
}

const PostForm: React.FC<PostFormProps> = ({ existingPost }) => {
  const navigate = useNavigate();
  const defaultValues = existingPost
    ? { title: existingPost.title, content: existingPost.content, img: undefined }
    : { title: undefined, content: undefined, img: undefined };

  undefined;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues,
  });

  const watchedTitle = watch('title');
  const watchedContent = watch('content');
  const [error, setError] = useState('');
  const [isPending, setPending] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(existingPost?.imageUrl);
  const [useAISuggestion, setUseAISuggestion] = useState(false);

  const previewPost = useMemo(() => {
    return {
      title: watchedTitle || 'Post Title',
      content: watchedContent || 'Your post content will be previewed here.',
    };
  }, [watchedTitle, watchedContent]);

  const onSubmit = async (data: { title?: string; img?: File; content?: string }) => {
    setError('');
    try {
      if (existingPost) {
        // await updatePost({ postId: existingPost.id, post: { content: data.content, title: data.title }, img: data.img });
      } else {
        setPending(true);
        const uploadImageData = await uploadImage(data.img!);

        await createPost({
          title: data.title,
          content: data.content,
          imageUrl: uploadImageData.url,
        });
      }
      setPending(false);
      reset();
      navigate('/explore');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      setError('Failed to upload post');
    }
  };

  return (
    <>
      <Stack direction="row" spacing={4} sx={{ p: 4 }}>
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
              <div>
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  style={{ display: 'none' }}
                  id="image-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <label htmlFor="image-upload">
                  <IconButton component="span" sx={{ marginBottom: '10px' }}>
                    <AddPhotoAlternateIcon />
                  </IconButton>
                </label>
              </div>
            )}
          />
          {!existingPost && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={useAISuggestion}
                  onChange={(e) => setUseAISuggestion(e.target.checked)}
                />
              }
              label="Use AI Suggestions"
            />
          )}
          {!useAISuggestion && (
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  variant="outlined"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title ? errors.title.message : ' '}
                />
              )}
            />
          )}
          {!useAISuggestion && (
            <Controller
              name="content"
              control={control}
              rules={{ required: 'Content is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Content"
                  variant="outlined"
                  fullWidth
                  rows={4}
                  error={!!errors.content}
                  helperText={errors.content ? errors.content.message : ' '}
                />
              )}
            />
          )}
          {isPending ? (
            <Typography>Uploading...</Typography>
          ) : (
            <Button type="submit" variant="contained">
              Upload Post
            </Button>
          )}
        </Box>
        <Box sx={{ flex: 1, maxWidth: 400 }}>
          <Typography variant="h5" gutterBottom>
            Post Preview
          </Typography>
          <PostPreview
            post={{
              ...previewPost,
              imageUrl: preview || '',
              id: 0,
            }}
          />
        </Box>
      </Stack>
    </>
  );
};

export default PostForm;
