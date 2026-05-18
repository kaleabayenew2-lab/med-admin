import React from 'react';
import { 
  Typography, 
  Box, 
  Chip, 
  Button,
  SxProps,
  Theme,
  Grid,
  Avatar,
  IconButton,
  Paper
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  LocalPharmacy as PharmacyIcon,
  Business as BusinessIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  PhotoLibrary,
  Edit as EditIcon,
  CloudUpload
} from '@mui/icons-material';
import { Facility } from '../utils/facilityUtils';

// TypeScript interfaces
interface ModernStyles {
  dialog: SxProps<Theme>;
  header: SxProps<Theme>;
  card: SxProps<Theme>;
  cardHover: SxProps<Theme>;
  button: SxProps<Theme>;
  input: SxProps<Theme>;
  chip: SxProps<Theme>;
  scrollbar: SxProps<Theme>;
}

interface HeaderCardComponentProps {
  facility: Facility;
  getFacilityIcon: (facility: Facility) => React.ReactNode;
  getFacilityColor: (facility: Facility) => string;
}

interface StatusChipComponentProps {
  label: string;
  isActive: boolean;
  icon: React.ReactNode;
}

interface InfoCardWrapperProps {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
  gradientColors: {
    start: string;
    end: string;
    border: string;
    icon: string;
  };
}

interface ActionButtonGroupProps {
  children: React.ReactNode;
}

interface ImageDisplaySectionProps {
  profileImage?: string;
  galleryImages?: string[];
  onProfileImageChange?: (image: string) => void;
  onGalleryImageChange?: (images: string[]) => void;
  onProfileImageUpload?: () => void;
  onGalleryImageUpload?: () => void;
  disabled?: boolean;
}

// Modern light theme configuration
export const createModernStyles = (theme: Theme): ModernStyles => ({
  dialog: {
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
    background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
    border: '1px solid rgba(0, 0, 0, 0.05)'
  },
  header: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    padding: '24px 32px'
  },
  card: {
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    background: '#ffffff',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
  },
  button: {
    borderRadius: '12px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '14px',
    padding: '12px 24px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  input: {
    borderRadius: '12px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#fafbfc',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      '&:hover': {
        borderColor: '#3b82f6',
        backgroundColor: '#ffffff'
      },
      '&.Mui-focused': {
        borderColor: '#3b82f6',
        backgroundColor: '#ffffff',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
      }
    }
  },
  chip: {
    borderRadius: '20px',
    fontWeight: 500,
    fontSize: '12px',
    height: '28px'
  },
  scrollbar: {
    '&::-webkit-scrollbar': {
      width: '6px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f5f9'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#cbd5e1',
      borderRadius: '3px',
      '&:hover': {
        background: '#94a3b8'
      }
    }
  }
});

// Facility icon utility function
export const getFacilityIcon = (facility: Facility): React.ReactNode => {
  if (facility.type === 'hospital') {
    return <HospitalIcon sx={{ fontSize: 32 }} />;
  }
  if (facility.type === 'pharmacy') {
    return <PharmacyIcon sx={{ fontSize: 32 }} />;
  }
  return <BusinessIcon sx={{ fontSize: 32 }} />;
};

// Facility color utility function
export const getFacilityColor = (facility: Facility): string => {
  if (facility.type === 'hospital') return '#3b82f6';
  if (facility.type === 'pharmacy') return '#10b981';
  return '#6366f1';
};

// Format coordinates for display
export const formatCoordinates = (lat: number, lng: number): string => {
  if (lat === undefined || lng === undefined || lat === null || lng === null) {
    return 'No coordinates available';
  }
  if (isNaN(lat) || isNaN(lng)) {
    return 'Invalid coordinates';
  }
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

// Copy to clipboard handler
export const copyToClipboardHandler = async (
  text: string,
  onCopyToClipboard: (text: string, label?: string) => Promise<void>,
  label?: string
): Promise<void> => {
  try {
    await onCopyToClipboard(text, label || 'Copied to clipboard');
  } catch (error) {
    console.error('Failed to copy:', error);
    // Fallback: use native clipboard API
    try {
      await navigator.clipboard.writeText(text);
      console.log('Copied using fallback method');
    } catch (fallbackError) {
      console.error('Fallback copy also failed:', fallbackError);
    }
  }
};

// Check for missing data in facility
export const missingDataChecker = (facility: Facility, getMissingKeys: (facility: Facility) => string[]) => {
  const missingKeys = getMissingKeys(facility);
  const missingCount = missingKeys.length;
  
  // Create formatted missing fields list
  const missingFields = missingKeys.map(key => {
    // Convert camelCase or snake_case to readable format
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase())
      .trim();
  });

  return {
    missing: missingKeys,
    missingFields,
    missingCount,
    hasMissing: missingCount > 0,
    getMissingMessage: () => {
      if (missingCount === 0) return 'All data is complete';
      if (missingCount === 1) return `Missing: ${missingFields[0]}`;
      return `Missing ${missingCount} fields: ${missingFields.join(', ')}`;
    }
  };
};

// Image Display Section Component
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
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1e293b' }}>
        Facility Images
      </Typography>
      
      {/* Profile Image Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Profile Image
          </Typography>
          {!disabled && onProfileImageUpload && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<CloudUpload />}
              onClick={onProfileImageUpload}
              sx={{ minWidth: 120 }}
            >
              Upload Profile Image
            </Button>
          )}
        </Box>
        
        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {profileImage ? (
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={profileImage}
                sx={{
                  width: 80,
                  height: 80,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)'
                }}
              />
              {!disabled && (
                <IconButton
                  onClick={() => onProfileImageChange?.('')}
                  sx={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    bgcolor: 'error.main',
                    color: 'white',
                    width: 24,
                    height: 24,
                    '&:hover': {
                      bgcolor: 'error.dark'
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ) : (
            <Box sx={{ 
              width: 80, 
              height: 80, 
              border: '2px dashed', 
              borderColor: 'grey.300',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.50',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'grey.100',
                borderColor: 'primary.main'
              }
            }}
            onClick={onProfileImageUpload}
            >
              <Box sx={{ textAlign: 'center' }}>
                <PhotoLibrary sx={{ fontSize: 32, color: 'grey.400' }} />
                <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.7rem', position: 'absolute', bottom: 6 }}>
                  No profile image
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Gallery Images Section */}
      {galleryImages.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Gallery Images ({galleryImages.length})
            </Typography>
            {!disabled && onGalleryImageUpload && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<CloudUpload />}
                onClick={onGalleryImageUpload}
                sx={{ minWidth: 140 }}
              >
                Upload Gallery Images
              </Button>
            )}
          </Box>
          
          <Grid container spacing={2}>
            {galleryImages.map((image, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={image}
                    variant="rounded"
                    sx={{
                      width: '100%',
                      height: 150,
                      border: '2px solid',
                      borderColor: 'grey.300'
                    }}
                  />
                  {!disabled && (
                    <IconButton
                      onClick={() => {
                        const newGallery = galleryImages.filter((_, i) => i !== index);
                        onGalleryImageChange?.(newGallery);
                      }}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'error.dark'
                        }
                      }}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

// Header Card Component
export const HeaderCardComponent: React.FC<HeaderCardComponentProps> = ({ 
  facility, 
  getFacilityIcon, 
  getFacilityColor 
}) => {
  return (
    <Box sx={{
      p: 4,
      background: `linear-gradient(135deg, ${getFacilityColor(facility)}10 0%, ${getFacilityColor(facility)}05 100%)`,
      borderBottom: `1px solid ${getFacilityColor(facility)}20`
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Box sx={{
            width: 72,
            height: 72,
            borderRadius: '20px',
            background: `linear-gradient(135deg, ${getFacilityColor(facility)} 0%, ${getFacilityColor(facility)}dd 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
          }}>
            {getFacilityIcon(facility)}
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={600} sx={{ color: '#1e293b', lineHeight: 1.1, mb: 1, fontSize: '1.1rem' }}>
              {facility.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
              <Box sx={{
                px: 2,
                py: 0.5,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${getFacilityColor(facility)} 0%, ${getFacilityColor(facility)}dd 100%)`,
                color: 'white',
                fontWeight: 500,
                fontSize: '10px'
              }}>
                {facility.type}
              </Box>
              <Box sx={{
                px: 2,
                py: 0.5,
                borderRadius: '12px',
                background: facility.isActive 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                fontWeight: 500,
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                {facility.isActive ? '✓ Active' : '✗ Inactive'}
              </Box>
              {facility.ownership && (
                <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.7rem' }}>
                  <BusinessIcon sx={{ fontSize: 14 }} />
                  {facility.ownership}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, fontWeight: 500, fontSize: '0.7rem' }}>
            Agent ID
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: 'ui-monospace, Monaco, "Cascadia Code", "Segoe UI Mono", monospace', 
              color: '#1e293b',
              fontWeight: 600,
              letterSpacing: '0.3px',
              background: '#f1f5f9',
              px: 1.5,
              py: 0.5,
              borderRadius: '6px',
              fontSize: '0.75rem',
              lineHeight: 1.2
            }}
          >
            {(facility as any).agentId || 'N/A'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Status Chip Component
export const StatusChipComponent: React.FC<StatusChipComponentProps> = ({ 
  label, 
  isActive, 
  icon 
}) => {
  return (
    <Box sx={{
      px: 3,
      py: 1,
      borderRadius: '20px',
      background: isActive 
        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      fontWeight: 500,
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      {icon}
      {label}
    </Box>
  );
};

// Info Card Wrapper Component
export const InfoCardWrapper: React.FC<InfoCardWrapperProps> = ({ 
  children, 
  title, 
  icon, 
  gradientColors 
}) => {
  return (
    <Box sx={{ 
      p: 3,
      borderRadius: '12px',
      background: `linear-gradient(135deg, ${gradientColors.start} 0%, ${gradientColors.end} 100%)`,
      border: `1px solid ${gradientColors.border}`
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          background: gradientColors.icon,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          {icon}
        </Box>
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};

// Action Button Group Component
export const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 3,
      p: 3
    }}>
      {children}
    </Box>
  );
};