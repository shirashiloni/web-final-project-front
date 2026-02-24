import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const uploadImage = async (img: File) => {
  const formData = new FormData();
  formData.append('file', img);
  const { data } = await axios.post(`/upload`, formData, {
    headers: {
      'Content-Type': 'image/*',
    },
  });

  return data;
};

export const useUploadFile = (img: File) => {
  return useMutation({
    mutationFn: () => uploadImage(img),
  });
};
