import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Box, 
  TextField, 
  Button,
  InputAdornment,
  Grid,
  Stack,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Paper,
  SxProps,
  Theme
} from '@mui/material';
import { ImageDisplaySection } from './FacilityCreation/components/ImageDisplaySection';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  VpnKey as KeyIcon,
  CopyAll as CopyIcon,
  LocalHospital as LocalHospitalIcon,
  LocalPharmacy as PharmacyIcon,
  CheckCircle as CheckCircleIcon,
  MyLocation as MyLocationIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { Facility } from '../utils/facilityUtils';
import { HOSPITAL_SERVICE_MAP, PHARMACY_SERVICE_MAP, HOSPITAL_TYPES, PHARMACY_TYPES } from '../components/FacilityCreation/constants/serviceConstants';

// TypeScript interfaces
interface PasswordBannerSectionProps {
  lastSavedPassword: string | null;
  tempPassword: string | null;
  onCopyToClipboard: (text: string, label?: string) => Promise<void>;
}

interface FacilityHeaderSectionProps {
  facility: Facility;
  getFacilityIcon: (facility: Facility) => React.ReactNode;
  getFacilityColor: (facility: Facility) => string;
}

interface EditFacilityFormProps {
  facility: Facility;
  onUpdate: (facility: Facility) => void;
  onSave: (facility: Facility) => Promise<void> | void;
  onCancel: () => void;
}

// Modern input styles
const inputStyles: SxProps<Theme> = {
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
};

// Button styles
const buttonStyles: SxProps<Theme> = {
  borderRadius: '12px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '14px',
  padding: '12px 24px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
};

// Password Banner Section Component
export const PasswordBannerSection: React.FC<PasswordBannerSectionProps> = ({ 
  lastSavedPassword, 
  tempPassword, 
  onCopyToClipboard 
}) => {
  if (!lastSavedPassword && !tempPassword) return null;

  return (
    <Box sx={{ 
      mx: 4,
      mt: 4,
      p: 4, 
      borderRadius: '16px',
      border: '2px solid #f59e0b', 
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      position: 'relative',
      boxShadow: '0 8px 25px rgba(245, 158, 11, 0.15)'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <KeyIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography 
              variant="h6" 
              fontWeight={600} 
              sx={{ 
                color: '#92400e',
                lineHeight: 1.2
              }}
            >
              Temporary Password Generated
            </Typography>
          </Box>
          <Typography 
            variant="body1" 
            component="div" 
            sx={{ 
              fontFamily: 'ui-monospace, Monaco, "Cascadia Code", "Segoe UI Mono", monospace', 
              fontSize: '1rem',
              fontWeight: 600,
              background: '#ffffff',
              p: 3,
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              wordBreak: 'break-all', 
              color: '#1e293b',
              mb: 2,
              letterSpacing: '0.5px'
            }}
          >
            {lastSavedPassword || tempPassword}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#059669',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            ✓ Password saved successfully
          </Typography>
        </Box>
        <IconButton 
          size="small" 
          onClick={async () => { await onCopyToClipboard(String(lastSavedPassword || tempPassword || ''), 'Temporary password'); }}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.1)',
            color: '#92400e',
            '&:hover': {
              background: 'rgba(245, 158, 11, 0.2)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <CopyIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

// Facility Header Section Component
export const FacilityHeaderSection: React.FC<FacilityHeaderSectionProps> = ({ 
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
                gap: 1
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

// Edit Facility Form Component
export const EditFacilityForm: React.FC<EditFacilityFormProps> = ({ facility, onUpdate, onSave, onCancel }) => {
  const [showErrors, setShowErrors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const validateAndSave = async () => {
    // Required fields: name, email, phone, address, type
    const isValid = facility.name && facility.email && facility.phone && facility.address && facility.type;
    if (!isValid) {
      setShowErrors(true);
      try { 
        window.dispatchEvent(new CustomEvent('admin:toast', { 
          detail: { type: 'error', message: 'Please fill in all required fields' } 
        })); 
      } catch(e){}
      return;
    }
    setShowErrors(false);
    setIsSaving(true);
    try {
      await onSave(facility);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Debug: Log the facility data to ensure it's being passed correctly
  console.log(`✏️ Editing facility: ${facility.name} (${facility.type})`);
  console.log(`🆔 Facility ID: ${facility.id || 'N/A'}`);
  console.log(`🏢 Initial ownership: ${facility.ownership}`);
  console.log(`📋 Full facility object:`, facility);
  
  return (
    <Card sx={{ 
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(0, 0, 0, 0.04)',
      background: '#ffffff',
      p: 0,
      overflow: 'visible'
    }}>
      <Box sx={{ 
        p: 4,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: '16px 16px 0 0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <EditIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={600} sx={{ color: '#1e293b', lineHeight: 1.2 }}>
              Edit Facility
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Update facility information
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 4 }}>
        {/* Facility ID Display */}
        <Box sx={{ 
          mb: 4,
          p: 3,
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '2px solid #3b82f6',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', gap: 4, width: '100%' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontWeight: 500 }}>
                Facility ID
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="h6" 
                  fontWeight={600}
                  sx={{ 
                    color: '#1e40af',
                    fontFamily: 'ui-monospace, Monaco, "Cascadia Code", "Segoe UI Mono", monospace',
                    letterSpacing: '0.5px'
                  }}
                >
                  {facility.id || 'N/A'}
                </Typography>
                {facility.id && (
                  <IconButton 
                    size="small" 
                    onClick={() => navigator.clipboard.writeText(facility.id as string)}
                    sx={{ ml: 1, width: 32, height: 32, color: '#3b82f6', '&:hover': { background: 'rgba(59, 130, 246, 0.1)' } }}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
            
            <Box sx={{ width: '1px', background: 'rgba(59, 130, 246, 0.2)' }} />

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontWeight: 500 }}>
                Agent ID
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="h6" 
                  fontWeight={600}
                  sx={{ 
                    color: '#1e40af',
                    fontFamily: 'ui-monospace, Monaco, "Cascadia Code", "Segoe UI Mono", monospace',
                    letterSpacing: '0.5px'
                  }}
                >
                  {facility.agentId || 'N/A'}
                </Typography>
                {facility.agentId && (
                  <IconButton 
                    size="small" 
                    onClick={() => navigator.clipboard.writeText(facility.agentId as string)}
                    sx={{ ml: 1, width: 32, height: 32, color: '#3b82f6', '&:hover': { background: 'rgba(59, 130, 246, 0.1)' } }}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Image Display Section */}
        <Box sx={{ mb: 4 }}>
          <ImageDisplaySection
            profileImage={facility.profileImage}
            galleryImages={facility.galleryImages || []}
            onProfileImageChange={(image) => onUpdate({ ...facility, profileImage: image })}
            onGalleryImageChange={(images) => onUpdate({ ...facility, galleryImages: images })}
            onProfileImageUpload={async () => {
              // Create file input for profile image upload
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file && facility._id) {
                  try {
                    const formData = new FormData();
                    formData.append('profileImage', file);
                    
                    const response = await fetch(`/api/facilities/${facility._id}/upload-profile`, {
                      method: 'POST',
                      body: formData
                    });
                    
                    if (response.ok) {
                      const result = await response.json();
                      onUpdate({ ...facility, profileImage: result.imageUrl });
                    } else {
                      console.error('Upload failed');
                      // Fallback to base64 for demo
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const result = e.target?.result as string;
                        onUpdate({ ...facility, profileImage: result });
                      };
                      reader.readAsDataURL(file);
                    }
                  } catch (error) {
                    console.error('Upload error:', error);
                    // Fallback to base64 for demo
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const result = e.target?.result as string;
                      onUpdate({ ...facility, profileImage: result });
                    };
                    reader.readAsDataURL(file);
                  }
                }
              };
              input.click();
            }}
            onGalleryImageUpload={async () => {
              // Create file input for gallery images upload
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.multiple = true;
              input.onchange = async (e) => {
                const files = Array.from((e.target as HTMLInputElement).files || []);
                if (files.length > 0 && facility._id) {
                  try {
                    const formData = new FormData();
                    files.forEach(file => formData.append('galleryImages', file));
                    
                    const response = await fetch(`/api/facilities/${facility._id}/upload-gallery`, {
                      method: 'POST',
                      body: formData
                    });
                    
                    if (response.ok) {
                      const result = await response.json();
                      const currentGallery = facility.galleryImages || [];
                      const updatedGallery = [...currentGallery, ...result.imageUrls];
                      onUpdate({ ...facility, galleryImages: updatedGallery });
                    } else {
                      console.error('Gallery upload failed');
                      // Fallback to base64 for demo
                      const readers = files.map(file => {
                        return new Promise<string>((resolve) => {
                          const reader = new FileReader();
                          reader.onload = (e) => resolve(e.target?.result as string);
                          reader.readAsDataURL(file);
                        });
                      });
                      
                      Promise.all(readers).then(newImages => {
                        const currentGallery = facility.galleryImages || [];
                        const updatedGallery = [...currentGallery, ...newImages];
                        onUpdate({ ...facility, galleryImages: updatedGallery });
                      });
                    }
                  } catch (error) {
                    console.error('Gallery upload error:', error);
                    // Fallback to base64 for demo
                    const readers = files.map(file => {
                      return new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target?.result as string);
                        reader.readAsDataURL(file);
                      });
                    });
                    
                    Promise.all(readers).then(newImages => {
                      const currentGallery = facility.galleryImages || [];
                      const updatedGallery = [...currentGallery, ...newImages];
                      onUpdate({ ...facility, galleryImages: updatedGallery });
                    });
                  }
                }
              };
              input.click();
            }}
            disabled={false}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                required
                error={showErrors && !facility.name}
                label="Facility Name"
                value={facility.name || ''}
                onChange={(e) => onUpdate({ ...facility, name: e.target.value })}
                variant="outlined"
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                required
                error={showErrors && !facility.phone}
                label="Phone Number"
                value={facility.phone || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const phoneRegex = /^[97]\d{0,8}$/;
                  if (value === '' || phoneRegex.test(value)) {
                    onUpdate({ ...facility, phone: value });
                  }
                }}
                variant="outlined"
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontSize: '16px' }}>🇪🇹</span>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>+251</Typography>
                    </InputAdornment>
                  ),
                }}
                placeholder="9XXXXXXXX"
                helperText="Enter 9-digit number starting with 9 or 7"
              />

              <TextField
                fullWidth
                required
                error={showErrors && !facility.email}
                label="Email Address"
                type="email"
                value={facility.email || ''}
                onChange={(e) => onUpdate({ ...facility, email: e.target.value })}
                variant="outlined"
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                required
                error={showErrors && !facility.address}
                label="Address"
                value={facility.address || ''}
                onChange={(e) => onUpdate({ ...facility, address: e.target.value })}
                variant="outlined"
                multiline
                rows={2}
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon sx={{ color: '#64748b', mt: 1 }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Opening Hours"
                value={facility.openingHours || ''}
                onChange={(e) => onUpdate({ ...facility, openingHours: e.target.value })}
                variant="outlined"
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimeIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Ownership Dropdown */}
              <FormControl fullWidth sx={inputStyles}>
                <InputLabel>Ownership</InputLabel>
                <Select
                  value={facility.ownership || 'public'}
                  onChange={(e) => {
                    console.log('Ownership changed to:', e.target.value);
                    console.log('Before update - facility.ownership:', facility.ownership);
                    const updatedFacility = { ...facility, ownership: e.target.value };
                    console.log('After update - updatedFacility.ownership:', updatedFacility.ownership);
                    onUpdate(updatedFacility);
                  }}
                  label="Ownership"
                  startAdornment={<InputAdornment position="start"><BusinessIcon sx={{ color: '#64748b' }} /></InputAdornment>}
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Username"
                value={facility.username || ''}
                onChange={(e) => onUpdate({ ...facility, username: e.target.value })}
                variant="outlined"
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="New Password"
                type="text"
                placeholder="Leave blank to keep current password"
                value={facility.password || ''}
                onChange={(e) => onUpdate({ ...facility, password: e.target.value })}
                variant="outlined"
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
                helperText="Entering a new password here will overwrite the existing one."
              />

              
              {/* Location Coordinates with Detect Button */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontWeight: 500 }}>
                  Location Coordinates
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Latitude"
                      value={facility.location && facility.location.coordinates ? facility.location.coordinates[1] : ''}
                      onChange={(e) => {
                        const lat = parseFloat(e.target.value);
                        const lng = facility.location?.coordinates?.[1] || 0;
                        const newLocation = {
                          type: 'Point',
                          coordinates: [lng, lat]
                        };
                        onUpdate({ ...facility, location: newLocation });
                      }}
                      placeholder="e.g., -1.2921"
                      sx={inputStyles}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Longitude"
                      value={facility.location && facility.location.coordinates ? facility.location.coordinates[0] : ''}
                      onChange={(e) => {
                        const lng = parseFloat(e.target.value);
                        const lat = facility.location?.coordinates?.[0] || 0;
                        const newLocation = {
                          type: 'Point',
                          coordinates: [lng, lat]
                        };
                        onUpdate({ ...facility, location: newLocation });
                      }}
                      placeholder="e.g., 36.8219"
                      sx={inputStyles}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        // Geolocation detection logic would go here
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              const newLocation = {
                                type: 'Point',
                                coordinates: [position.coords.longitude, position.coords.latitude]
                              };
                              onUpdate({ ...facility, location: newLocation });
                            },
                            (error) => {
                              console.error('Error getting location:', error);
                            }
                          );
                        }
                      }}
                      sx={{ height: '56px' }}
                      title="Detect current location"
                    >
                      <MyLocationIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Alternative Phone Numbers */}
              <TextField
                fullWidth
                label="Alternative Phone Numbers"
                value={facility.altPhone && Array.isArray(facility.altPhone) ? facility.altPhone.join(', ') : ''}
                onChange={(e) => {
                  const altPhones = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                  onUpdate({ ...facility, altPhone: altPhones });
                }}
                variant="outlined"
                sx={inputStyles}
                placeholder="Enter alternative numbers separated by commas"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
                helperText="Separate multiple numbers with commas"
              />

              {/* Hospital Type Dropdown */}
              {facility.type === 'hospital' && (
                <FormControl fullWidth sx={inputStyles}>
                  <InputLabel>Hospital Type</InputLabel>
                  <Select
                    value={facility.hospitalType || ''}
                    onChange={(e) => onUpdate({ ...facility, hospitalType: e.target.value, services: [] })}
                    label="Hospital Type"
                    startAdornment={<InputAdornment position="start"><LocalHospitalIcon sx={{ color: '#64748b' }} /></InputAdornment>}
                  >
                    {HOSPITAL_TYPES.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Pharmacy Type Dropdown */}
              {facility.type === 'pharmacy' && (
                <FormControl fullWidth sx={inputStyles}>
                  <InputLabel>Pharmacy Type</InputLabel>
                  <Select
                    value={facility.pharmacyType || ''}
                    onChange={(e) => onUpdate({ ...facility, pharmacyType: e.target.value, services: [] })}
                    label="Pharmacy Type"
                    startAdornment={<InputAdornment position="start"><PharmacyIcon sx={{ color: '#64748b' }} /></InputAdornment>}
                  >
                    {PHARMACY_TYPES.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Conditional Services */}
              {((facility.type === 'hospital' && facility.hospitalType) || (facility.type === 'pharmacy' && facility.pharmacyType)) && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontWeight: 500 }}>
                    Available Services for {facility.type === 'hospital' ? facility.hospitalType : facility.pharmacyType}
                  </Typography>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      background: '#f8fafc',
                      maxHeight: 300,
                      overflow: 'auto'
                    }}
                  >
                    <List dense>
                      {(() => {
                        const typeKey = facility.type === 'hospital' ? facility.hospitalType : facility.pharmacyType;
                        const availableServices = facility.type === 'hospital' 
                          ? (HOSPITAL_SERVICE_MAP[typeKey as keyof typeof HOSPITAL_SERVICE_MAP] || [])
                          : (PHARMACY_SERVICE_MAP[typeKey as keyof typeof PHARMACY_SERVICE_MAP] || []);
                        
                        // Parse services from JSON string or array
                        let currentServices: string[] = [];
                        if (facility.services) {
                          if (typeof facility.services === 'string') {
                            try {
                              currentServices = JSON.parse(facility.services);
                            } catch (e) {
                              // If it's not valid JSON, treat as comma-separated
                              currentServices = facility.services.split(',').map(s => s.trim()).filter(s => s);
                            }
                          } else if (Array.isArray(facility.services)) {
                            currentServices = facility.services;
                          }
                        }
                        
                        return availableServices.map((service) => {
                          const isChecked = currentServices.includes(service);
                          return (
                            <ListItem key={service} sx={{ py: 0.5 }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const newServices = isChecked
                                        ? currentServices.filter(s => s !== service)
                                        : [...currentServices, service];
                                      onUpdate({ ...facility, services: newServices });
                                    }}
                                    size="small"
                                    sx={{
                                      color: isChecked ? '#3b82f6' : '#64748b',
                                      '&.Mui-checked': {
                                        color: '#3b82f6'
                                      }
                                    }}
                                  />
                                }
                                label={service}
                                sx={{ 
                                  ml: 0,
                                  '& .MuiFormControlLabel-label': {
                                    fontSize: '0.875rem',
                                    color: isChecked ? '#1e293b' : '#64748b',
                                    fontWeight: isChecked ? 500 : 400
                                  }
                                }}
                              />
                            </ListItem>
                          );
                        });
                      })()}
                    </List>
                  </Paper>
                </Box>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: 'fit-content',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(0, 0, 0, 0.04)',
              p: 0,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
            }}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b', mb: 3 }}>
                  Actions
                </Typography>
                <Stack spacing={3}>
                  <Button 
                    variant="contained" 
                    disabled={isSaving}
                    sx={{
                      ...buttonStyles,
                      background: isSaving
                        ? 'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        transform: isSaving ? 'none' : 'translateY(-2px)',
                        boxShadow: isSaving ? 'none' : '0 8px 25px rgba(16, 185, 129, 0.3)'
                      }
                    }}
                    startIcon={isSaving ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <SaveIcon />}
                    onClick={validateAndSave}
                  >
                    {isSaving ? 'Saving…' : 'Save Changes'}
                  </Button>

                  <Button 
                    variant="outlined"
                    sx={{
                      ...buttonStyles,
                      borderColor: '#d1d5db',
                      color: '#6b7280',
                      background: '#ffffff',
                      '&:hover': {
                        borderColor: '#9ca3af',
                        background: '#f9fafb',
                        transform: 'translateY(-1px)'
                      }
                    }}
                    startIcon={<CancelIcon />}
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};
