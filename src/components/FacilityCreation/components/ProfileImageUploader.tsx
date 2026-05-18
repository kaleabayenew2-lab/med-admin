import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Camera
} from '@mui/icons-material';
import { uploadFile } from '../../../services/uploads';

interface ProfileImageUploaderProps {
  currentImage?: string;
  onImageUpload: (imageUrl: string) => void;
  onImageRemove: () => void;
  disabled?: boolean;
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  currentImage,
  onImageUpload,
  onImageRemove,
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    
    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload image
      const uploadResult = await uploadFile(file);
      
      if (uploadResult && uploadResult.url) {
        onImageUpload(uploadResult.url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      // Reset preview on error
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageRemove();
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        border: '1px dashed',
        borderColor: 'grey.300',
        textAlign: 'center',
        bgcolor: 'grey.50',
        position: 'relative',
        minWidth: 200,
        maxWidth: 220,
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'primary.50'
        }
      }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="profile-image-upload"
        disabled={disabled || uploading}
      />
      
      <label htmlFor="profile-image-upload">
        <Box sx={{ cursor: disabled || uploading ? 'not-allowed' : 'pointer' }}>
          {preview ? (
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={preview}
                sx={{
                  width: 60,
                  height: 60,
                  mx: 'auto',
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'primary.main'
                }}
              />
              {!disabled && !uploading && (
                <IconButton
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove();
                  }}
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    bgcolor: 'error.main',
                    color: 'white',
                    width: 20,
                    height: 20,
                    '&:hover': {
                      bgcolor: 'error.dark'
                    }
                  }}
                  size="small"
                >
                  <Delete sx={{ fontSize: 12 }} />
                </IconButton>
              )}
              {uploading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '50%'
                  }}
                >
                  <CircularProgress size={14} sx={{ color: 'white' }} />
                </Box>
              )}
            </Box>
          ) : (
            <Box>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  mx: 'auto',
                  mb: 1,
                  bgcolor: 'grey.200',
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}
              >
                <Camera sx={{ fontSize: 24, color: 'grey.500' }} />
              </Avatar>
            </Box>
          )}
          
          <Typography variant="h6" gutterBottom sx={{ fontSize: '0.95rem', mb: 0.5, lineHeight: 1.2 }}>
            Profile Image
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem', lineHeight: 1.3 }}>
            {preview ? 'Click to change' : 'Click to upload'}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
            Max: 5MB • JPG, PNG, WebP
          </Typography>
        </Box>
      </label>
    </Paper>
  );
};
