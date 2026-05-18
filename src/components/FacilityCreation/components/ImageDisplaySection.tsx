import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Avatar, 
  IconButton, 
  Paper, 
  Chip,
  Button,
  Card,
  CardMedia,
  CardActions
} from '@mui/material';
import {
  PhotoLibrary,
  Edit as EditIcon,
  CloudUpload,
  Delete as DeleteIcon,
  ZoomIn as ZoomInIcon
} from '@mui/icons-material';

interface ImageDisplaySectionProps {
  profileImage?: string;
  galleryImages?: string[];
  onProfileImageChange?: (image: string) => void;
  onGalleryImageChange?: (images: string[]) => void;
  onProfileImageUpload?: () => void;
  onGalleryImageUpload?: () => void;
  disabled?: boolean;
}

export const ImageDisplaySection: React.FC<ImageDisplaySectionProps> = ({
  profileImage,
  galleryImages = [],
  onProfileImageChange,
  onGalleryImageChange,
  onProfileImageUpload,
  onGalleryImageUpload,
  disabled = false
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Profile Image - Top Section */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }} />
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white', mb: 2, fontSize: '1rem' }}>
            Facility Profile
          </Typography>
          
          {/* Profile Image - Large Circle at Top */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {profileImage ? (
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={profileImage}
                  sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid',
                    borderColor: 'white',
                    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
                {!disabled && (
                  <>
                    <IconButton
                      onClick={() => onProfileImageChange?.('')}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'error.main',
                        color: 'white',
                        width: 32,
                        height: 32,
                        '&:hover': {
                          bgcolor: 'error.dark'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={onProfileImageUpload}
                      sx={{
                        position: 'absolute',
                        bottom: -8,
                        right: -8,
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: 32,
                        height: 32,
                        '&:hover': {
                          bgcolor: 'primary.dark'
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            ) : (
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ 
                  width: 120, 
                  height: 120, 
                  border: '3px dashed', 
                  borderColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                    transform: 'scale(1.05)'
                  }
                }}
                onClick={onProfileImageUpload}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <CloudUpload sx={{ fontSize: 36, color: 'white', mb: 0.5 }} />
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '0.75rem' }}>
                      Upload Profile
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          
          {!disabled && !profileImage && (
            <Button
              variant="contained"
              size="small"
              startIcon={<CloudUpload />}
              onClick={onProfileImageUpload}
              sx={{ 
                bgcolor: 'white',
                color: 'primary.main',
                fontSize: '0.875rem',
                py: 0.5,
                px: 2,
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Add Profile Image
            </Button>
          )}
        </Box>
      </Paper>

      {/* Gallery Images Section */}
      <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Gallery Images ({galleryImages.length})
          </Typography>
          {!disabled && onGalleryImageUpload && (
            <Button
              variant="contained"
              size="medium"
              startIcon={<CloudUpload />}
              onClick={onGalleryImageUpload}
              sx={{ 
                bgcolor: '#667eea',
                '&:hover': {
                  bgcolor: '#5a67d8'
                }
              }}
            >
              Upload Gallery Images
            </Button>
          )}
        </Box>
        
        {galleryImages.length > 0 ? (
          <Grid container spacing={3}>
            {galleryImages.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ 
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                  }
                }}>
                  <CardMedia
                    component="img"
                    image={image}
                    alt={`Gallery image ${index + 1}`}
                    sx={{
                      height: 200,
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  {!disabled && (
                    <CardActions sx={{ 
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: 1,
                      p: 0.5
                    }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          // Open image in new tab for viewing
                          window.open(image, '_blank');
                        }}
                        sx={{ 
                          color: 'white',
                          mr: 1,
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.2)'
                          }
                        }}
                      >
                        <ZoomInIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newGallery = galleryImages.filter((_, i) => i !== index);
                          onGalleryImageChange?.(newGallery);
                        }}
                        sx={{ 
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(244,67,54,0.8)'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  )}
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    color: 'white',
                    p: 2,
                    pb: 1
                  }}>
                    <Typography variant="caption" sx={{ fontSize: 12 }}>
                      Image {index + 1}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ 
            p: 6, 
            border: '3px dashed', 
            borderColor: '#cbd5e0',
            borderRadius: 3,
            textAlign: 'center',
            bgcolor: 'rgba(255,255,255,0.8)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#667eea',
              bgcolor: 'rgba(102,126,234,0.05)'
            }
          }}>
            <PhotoLibrary sx={{ fontSize: 64, color: '#cbd5e0', mb: 3 }} />
            <Typography variant="h6" sx={{ color: '#4a5568', mb: 2, fontWeight: 600 }}>
              No Gallery Images Yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#718096', mb: 3 }}>
              Upload images to showcase your facility
            </Typography>
            {!disabled && onGalleryImageUpload && (
              <Button
                variant="contained"
                size="large"
                startIcon={<CloudUpload />}
                onClick={onGalleryImageUpload}
                sx={{ 
                  bgcolor: '#667eea',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#5a67d8'
                  }
                }}
              >
                Add Gallery Images
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};