import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  CircularProgress,
  Grid,
  Avatar,
  Chip
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  PhotoLibrary,
  Add
} from '@mui/icons-material';
import { uploadFile } from '../../../services/uploads';

interface GalleryImageUploaderProps {
  currentImages?: string[];
  onImagesUpload: (imageUrls: string[]) => void;
  onImageRemove: (index: number) => void;
  disabled?: boolean;
  maxImages?: number;
}

export const GalleryImageUploader: React.FC<GalleryImageUploaderProps> = ({
  currentImages = [],
  onImagesUpload,
  onImageRemove,
  disabled = false,
  maxImages = 10
}) => {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(currentImages);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    // Check if adding these files would exceed the max limit
    if (previews.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images in the gallery`);
      return;
    }

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    setUploading(true);
    
    try {
      const newPreviews = [...previews];
      const newImageUrls: string[] = [];

      // Upload each file
      for (const file of validFiles) {
        try {
          // Create preview
          const previewUrl = URL.createObjectURL(file);
          newPreviews.push(previewUrl);

          // Upload image
          const uploadResult = await uploadFile(file);
          
          if (uploadResult && uploadResult.url) {
            newImageUrls.push(uploadResult.url);
          } else {
            throw new Error(`Failed to upload ${file.name}`);
          }
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          // Remove preview on error
          const previewUrl = URL.createObjectURL(file);
          URL.revokeObjectURL(previewUrl);
          newPreviews.pop();
        }
      }

      // Update state with successful uploads
      setPreviews(newPreviews);
      onImagesUpload([...currentImages, ...newImageUrls]);
      
      if (newImageUrls.length > 0) {
        alert(`Successfully uploaded ${newImageUrls.length} image(s)`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload some images. Please try again.');
      // Reset previews to original state
      setPreviews(currentImages);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onImageRemove(index);
  };

  const canAddMore = previews.length < maxImages && !disabled && !uploading;

  return (
    <Paper sx={{ 
      p: 1.5,
      minWidth: 200,
      maxWidth: 220,
      border: '1px dashed',
      borderColor: 'grey.300',
      bgcolor: 'grey.50',
      '&:hover': {
        borderColor: 'primary.main',
        bgcolor: 'primary.50'
      }
    }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '0.95rem', mb: 0.5, lineHeight: 1.2 }}>
        Gallery Images
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.75rem', lineHeight: 1.3 }}>
        Add up to {maxImages} images
      </Typography>

      {previews.length > 0 && (
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {previews.slice(0, 4).map((preview, index) => (
            <Grid item xs={6} key={index}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={preview}
                  variant="rounded"
                  sx={{
                    width: '100%',
                    height: 60,
                    border: '1px solid',
                    borderColor: 'grey.300'
                  }}
                >
                  <PhotoLibrary sx={{ fontSize: 16 }} />
                </Avatar>
                {!disabled && !uploading && (
                  <IconButton
                    onClick={() => handleRemove(index)}
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
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {canAddMore && (
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          id="gallery-images-upload"
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
        {canAddMore && (
          <label htmlFor="gallery-images-upload">
            <Button
              component="span"
              variant="outlined"
              startIcon={<CloudUpload />}
              disabled={uploading}
              size="small"
              sx={{ fontSize: '0.75rem', py: 0.5, px: 1 }}
            >
              {uploading ? (
                <>
                  <CircularProgress size={12} sx={{ mr: 0.5 }} />
                  Adding...
                </>
              ) : (
                'Add Images'
              )}
            </Button>
          </label>
        )}

        <Chip
          label={`${previews.length}/${maxImages}`}
          color="primary"
          variant="outlined"
          size="small"
          sx={{ fontSize: '0.7rem', height: 24 }}
        />
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
        Max: 5MB • JPG, PNG, WebP • Max {maxImages}
      </Typography>
    </Paper>
  );
};
