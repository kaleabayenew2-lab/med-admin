import React from 'react';
import { 
  Card, 
  Typography, 
  Box, 
  IconButton, 
  Chip, 
  Stack,
  Button,
  SxProps,
  Theme
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CopyAll as CopyIcon,
  Map as MapIcon,
  Business as BusinessIcon,
  LocalHospital as HospitalIcon,
  LocalPharmacy as PharmacyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  PowerSettingsNew as PowerSettingsNew,
  Person as PersonIcon
} from '@mui/icons-material';
import { Facility } from '../utils/facilityUtils';

// TypeScript interfaces
interface ModernStyles {
  card: SxProps<Theme>;
  chip: SxProps<Theme>;
}

interface ImageDisplaySectionProps {
  profileImage?: string;
  galleryImages?: string[];
  onProfileImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onProfileImageUpload?: () => void;
  onGalleryImageUpload?: () => void;
}

interface ContactInfoSectionProps {
  facility: Facility;
  onCopyToClipboard: (text: string, label?: string) => Promise<void>;
  onProfileImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onProfileImageUpload?: () => void;
  onGalleryImageUpload?: () => void;
}

interface LocationServicesSectionProps {
  facility: Facility;
  onCopyToClipboard: (text: string, label?: string) => Promise<void>;
  formatCoordinates: (loc: any) => any;
}

interface AdditionalDetailsSectionProps {
  facility: Facility;
  onCopyToClipboard: (text: string, label?: string) => Promise<void>;
  getMissingKeys?: (facility: Facility) => string[];
}

interface ManagementActionsSectionProps {
  facility: Facility;
  onEdit: (facility: Facility) => void;
  onResetPassword: (facility: Facility) => void;
  onToggleActive: (facility: Facility) => void;
  onClose: () => void;
}

// Image Display Section Component
const ImageDisplaySection: React.FC<ImageDisplaySectionProps> = ({
  profileImage,
  galleryImages,
  onProfileImageChange,
  onGalleryImageChange,
  onProfileImageUpload,
  onGalleryImageUpload
}) => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Profile Image */}
      {profileImage && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontWeight: 500 }}>
            Profile Image
          </Typography>
          <Box sx={{ 
            width: 120, 
            height: 120, 
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid #e2e8f0'
          }}>
            <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        </Box>
      )}
      
      {/* Gallery Images */}
      {galleryImages && galleryImages.length > 0 && (
        <Box>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontWeight: 500 }}>
            Gallery Images ({galleryImages.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {galleryImages.slice(0, 3).map((img, idx) => (
              <Box key={idx} sx={{ width: 80, height: 80, borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <img src={img} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            ))}
            {galleryImages.length > 3 && (
              <Box sx={{ width: 80, height: 80, borderRadius: '8px', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption">+{galleryImages.length - 3}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

// Modern light theme configuration
const createModernStyles = (): ModernStyles => ({
  card: {
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    background: '#ffffff',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  chip: {
    borderRadius: '20px',
    fontWeight: 500,
    fontSize: '12px',
    height: '28px'
  }
});

// Contact Information Section Component
export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ 
  facility, 
  onCopyToClipboard,
  onProfileImageChange,
  onGalleryImageChange,
  onProfileImageUpload,
  onGalleryImageUpload
}) => {
  const styles = createModernStyles();

  // Debug log to check data structure
  console.log(`📞 Contact info for: ${facility.name}`);

  return (
    <>
      <Card sx={{ 
        ...styles.card,
        height: '100%',
        p: 0
      }}>
        <Box sx={{
          p: 1.5,
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          borderRadius: '16px 16px 0 0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 28,
              height: 28,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <PhoneIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b', fontSize: '0.95rem' }}>
              Contact Information
            </Typography>
          </Box>
        </Box>

        {/* Image Display Section */}
        <ImageDisplaySection
          profileImage={facility.profileImage}
          galleryImages={facility.galleryImages}
          onProfileImageChange={onProfileImageChange}
          onGalleryImageChange={onGalleryImageChange}
          onProfileImageUpload={onProfileImageUpload}
          onGalleryImageUpload={onGalleryImageUpload}
        />
      </Card>
      
      <Box sx={{ p: 3 }}>
        {/* Main Phone Number */}
        {facility.phone ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 2,
            p: 2,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '1px solid #3b82f620'
          }}>
            <PhoneIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748b', mb: 0.25, fontSize: '0.7rem' }}>Primary Phone</Typography>
              <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.875rem' }}>
                +251 {facility.phone}
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={() => onCopyToClipboard(String(facility.phone), 'Primary Phone')}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '6px',
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.2)'
                }
              }}
            >
              <CopyIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ 
            p: 3,
            borderRadius: '12px',
            background: '#f8fafc',
            border: '1px dashed #d1d5db',
            mb: 3
          }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Primary phone number not provided
            </Typography>
          </Box>
        )}

        {/* Alternative Phone Numbers */}
        {facility.altPhone && Array.isArray(facility.altPhone) && facility.altPhone.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontWeight: 500 }}>
              Alternative Phone Numbers
            </Typography>
            {facility.altPhone.map((altPhone: string, index: number) => (
              <Box key={index} sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 2,
                p: 2,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '1px solid #10b98120'
              }}>
                <PhoneIcon sx={{ color: '#10b981', fontSize: 16 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 500 }}>
                    +251 {altPhone}
                  </Typography>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={() => onCopyToClipboard(altPhone, `Alternative Phone ${index + 1}`)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    '&:hover': {
                      background: 'rgba(16, 185, 129, 0.2)'
                    }
                  }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* Email Address */}
        {facility.email ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 2,
            p: 2,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: '1px solid #10b98120'
          }}>
            <EmailIcon sx={{ color: '#10b981', fontSize: 18 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748b', mb: 0.25, fontSize: '0.7rem' }}>Email</Typography>
              <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.875rem' }}>
                {facility.email}
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={() => onCopyToClipboard(String(facility.email), 'Email')}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                '&:hover': {
                  background: 'rgba(16, 185, 129, 0.2)'
                }
              }}
            >
              <CopyIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ 
            p: 3,
            borderRadius: '12px',
            background: '#f8fafc',
            border: '1px dashed #d1d5db',
            mb: 3
          }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Email address not provided
            </Typography>
          </Box>
        )}

        {/* Address */}
        {facility.address && (
          <Box sx={{ 
            p: 2,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
            border: '1px solid #f59e0b20',
            mb: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <LocationIcon sx={{ color: '#f59e0b', mt: 0.25, fontSize: 18 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#64748b', mb: 0.25, fontSize: '0.7rem' }}>Address</Typography>
                <Typography variant="body2" sx={{ color: '#1e293b', lineHeight: 1.4, fontSize: '0.875rem' }}>
                  {facility.address}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Username */}
        {facility.username && (
          <Box sx={{ 
            p: 2,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            border: '1px solid #d1d5db'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ color: '#6b7280', fontSize: 18 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#64748b', mb: 0.25, fontSize: '0.7rem' }}>Username</Typography>
                <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontFamily: 'ui-monospace, Monaco, "Cascadia Code", "Segoe UI Mono", monospace', fontSize: '0.875rem' }}>
                  {facility.username}
                </Typography>
              </Box>
              <IconButton 
                size="small" 
                onClick={() => onCopyToClipboard(String(facility.username), 'Username')}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  background: 'rgba(107, 114, 128, 0.1)',
                  color: '#6b7280',
                  '&:hover': {
                    background: 'rgba(107, 114, 128, 0.2)'
                  }
                }}
              >
                <CopyIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

// Location and Services Section Component
export const LocationServicesSection: React.FC<LocationServicesSectionProps> = ({ 
  facility, 
  onCopyToClipboard, 
  formatCoordinates 
}) => {
  const styles = createModernStyles();

  const handleCoordinates = (loc: any) => {
    const c = formatCoordinates(loc);
    if (!c) return null;
    const mapsSearch = `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`;
    return { ...c, mapsSearch };
  };

  // Enhanced debug log to check actual data structure
  console.log(`📍 Location & services for: ${facility.name}`);

  return (
    <Card sx={{ 
      ...styles.card,
      height: '100%',
      p: 0
    }}>
      <Box sx={{
        p: 1.5,
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: '16px 16px 0 0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 28,
            height: 28,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <LocationIcon sx={{ fontSize: 16 }} />
          </Box>
          <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b', fontSize: '0.95rem' }}>
            Location & Services
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>
        {/* Location Display */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: '#64748b', mb: 1.5, fontWeight: 500, fontSize: '0.7rem' }}>
            Location Information
          </Typography>
          
          {(() => {
            const locationData = facility.location;
            
            // Handle case where location might be stored as JSON string
            let parsedLocation = locationData;
            if (typeof locationData === 'string' && locationData) {
              try {
                parsedLocation = JSON.parse(locationData);
              } catch (e) {
                console.log(`🗺️ Location parse error for ${facility.name}:`, e);
                parsedLocation = locationData;
              }
            }
            
            // Try to format coordinates
            const coords = handleCoordinates(parsedLocation);
            
            if (!coords) {
              return (
                <Box sx={{ 
                  p: 3,
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px dashed #d1d5db'
                }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Location data available but coordinates not readable
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.75rem', mt: 1 }}>
                    Raw data: {JSON.stringify(parsedLocation)}
                  </Typography>
                </Box>
              );
            }
            
            return (
              <Box sx={{ 
                p: 2,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '1px solid #10b98120'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon sx={{ color: '#10b981', fontSize: 18 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b', mb: 0.25, fontSize: '0.7rem' }}>Coordinates</Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'ui-monospace, Monaco, "Cascadia Code", "Segoe UI Mono", monospace', 
                          color: '#1e293b',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}
                      >
                        {coords.text}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton 
                      size="small" 
                      onClick={() => onCopyToClipboard(coords.text, 'Coordinates')}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        '&:hover': {
                          background: 'rgba(16, 185, 129, 0.2)'
                        }
                      }}
                    >
                      <CopyIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <IconButton 
                      component="a"
                      href={coords.mapsSearch} 
                      target="_blank" 
                      rel="noreferrer"
                      size="small"
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        '&:hover': {
                          background: 'rgba(16, 185, 129, 0.2)'
                        }
                      }}
                    >
                      <MapIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Stack>
                </Box>
              </Box>
            );
          })()}
        </Box>

        {/* Services Display */}
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', mb: 1.5, fontWeight: 500, fontSize: '0.7rem' }}>
            Services Offered
          </Typography>
          
          {(() => {
            const servicesData = facility.services;
            
            // Handle different services data structures
            let servicesArray: string[] = [];
            
            if (!servicesData) {
              return (
                <Box sx={{ 
                  p: 3,
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px dashed #d1d5db'
                }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                    No services listed
                  </Typography>
                </Box>
              );
            }
            
            // Handle JSON array string: '["Radiology","Laboratory","Rehabilitation"]'
            if (typeof servicesData === 'string') {
              try {
                const parsed = JSON.parse(servicesData);
                if (Array.isArray(parsed)) {
                  servicesArray = parsed;
                } else {
                  // Handle comma-separated string fallback
                  servicesArray = servicesData.split(',').map(s => s.trim()).filter(s => s);
                }
              } catch (e) {
                // If parsing fails, treat as comma-separated string
                servicesArray = servicesData.split(',').map(s => s.trim()).filter(s => s);
              }
            }
            // Handle array of strings: ["Radiology","Laboratory","Rehabilitation"]
            else if (Array.isArray(servicesData)) {
              servicesArray = servicesData.map(service => {
                if (typeof service === 'string') {
                  return service;
                } else if (service && typeof service === 'object') {
                  // Handle service objects with name property or other properties
                  const serviceObj = service as any;
                  return serviceObj.name || serviceObj.service || serviceObj.type || JSON.stringify(service);
                }
                return String(service);
              });
            }
            // Handle object with service properties
            else if (typeof servicesData === 'object') {
              servicesArray = Object.values(servicesData)
                .filter(service => service)
                .map(service => {
                  if (typeof service === 'string') return service;
                  const serviceObj = service as any;
                  return serviceObj.name || serviceObj.service || serviceObj.type || JSON.stringify(service);
                });
            }
            
                        
            if (servicesArray.length === 0) {
              return (
                <Box sx={{ 
                  p: 3,
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px dashed #d1d5db'
                }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                    No services listed
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.75rem', mt: 1 }}>
                    Raw data: {JSON.stringify(servicesData)}
                  </Typography>
                </Box>
              );
            }
            
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {servicesArray.map((serviceName: string, index: number) => (
                  <Chip 
                    key={index}
                    label={serviceName} 
                    variant="filled"
                    size="small"
                    sx={{
                      ...styles.chip,
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      color: 'white',
                      fontSize: '0.7rem',
                      height: '24px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'
                      }
                    }}
                  />
                ))}
              </Box>
            );
          })()}
        </Box>
      </Box>
    </Card>
  );
};

// Additional Details Section Component
export const AdditionalDetailsSection: React.FC<AdditionalDetailsSectionProps> = ({ 
  facility, 
  onCopyToClipboard, 
  getMissingKeys 
}) => {
  const styles = createModernStyles();

  // Debug log to check data structure
  console.log(`📋 Displaying facility: ${facility.name} (${facility.type})`);
  console.log(`🆔 Facility ID: ${facility.id || 'N/A'}`);
  console.log(`🏢 Ownership: ${facility.ownership || 'N/A'}`);

  return (
    <Card sx={{ 
      ...styles.card,
      p: 0
    }}>
      <Box sx={{
        p: 1.5,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: '16px 16px 0 0'
      }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b', fontSize: '0.95rem' }}>
          Additional Details
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {/* Facility Type */}
          <Box sx={{ 
            p: 2,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            border: '1px solid #d1d5db',
            flex: '1 1 180px'
          }}>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, fontWeight: 500, fontSize: '0.7rem' }}>
              Facility Type
            </Typography>
            <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.875rem' }}>
              {facility.type || '(n/a)'}
            </Typography>
          </Box>
          
          {/* Hospital Type */}
          {facility.hospitalType && (
            <Box sx={{ 
              p: 2,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              border: '1px solid #3b82f620',
              flex: '1 1 180px'
            }}>
              <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, fontWeight: 500, fontSize: '0.7rem' }}>
                Hospital Type
              </Typography>
              <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.875rem' }}>
                {facility.hospitalType}
              </Typography>
            </Box>
          )}
          
          {/* Pharmacy Type */}
          {facility.pharmacyType && (
            <Box sx={{ 
              p: 2,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              border: '1px solid #10b98120',
              flex: '1 1 180px'
            }}>
              <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, fontWeight: 500, fontSize: '0.7rem' }}>
                Pharmacy Type
              </Typography>
              <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.875rem' }}>
                {facility.pharmacyType}
              </Typography>
            </Box>
          )}
          
          {/* Ownership */}
          <Box sx={{ 
            p: 2,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            border: '1px solid #d1d5db',
            flex: '1 1 180px'
          }}>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, fontWeight: 500, fontSize: '0.7rem' }}>
              Ownership
            </Typography>
            <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.875rem' }}>
              {facility.ownership || '(n/a)'}
            </Typography>
          </Box>
          
          {/* Opening Hours */}
          <Box sx={{ 
            p: 2,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            border: '1px solid #d1d5db',
            flex: '1 1 180px'
          }}>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, fontWeight: 500, fontSize: '0.7rem' }}>
              Opening Hours
            </Typography>
            <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.875rem' }}>
              {facility.openingHours || '(n/a)'}
            </Typography>
          </Box>
          
          {/* Facility ID */}
          <Box sx={{ 
            p: 2,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '1px solid #3b82f620',
            flex: '1 1 180px'
          }}>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, fontWeight: 500, fontSize: '0.7rem' }}>
              Facility ID
            </Typography>
            <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontFamily: 'ui-monospace, Monaco, "Cascadia Code", "Segoe UI Mono", monospace', fontSize: '0.875rem' }}>
              {facility.id || '(n/a)'}
            </Typography>
            {facility.id && (
              <IconButton 
                size="small" 
                sx={{ mt: 0.5, p: 0.5, width: 24, height: 24 }}
                onClick={() => onCopyToClipboard(String(facility.id), 'Facility ID')}
              >
                <CopyIcon sx={{ fontSize: 14 }} />
              </IconButton>
            )}
          </Box>
          
                    
          {/* Emergency Status */}
          <Box sx={{ 
            p: 2,
            borderRadius: '8px',
            background: (facility.isEmergency || facility.emergency) 
              ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
              : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: (facility.isEmergency || facility.emergency) 
              ? '2px solid #ef4444'
              : '1px solid #10b98120',
            flex: '1 1 180px'
          }}>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, fontWeight: 500, fontSize: '0.7rem' }}>
              Emergency Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {(facility.isEmergency || facility.emergency) ? (
                <>
                  <CancelIcon sx={{ color: '#ef4444', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600, fontSize: '0.875rem' }}>
                    Emergency Facility
                  </Typography>
                </>
              ) : (
                <>
                  <CheckCircleIcon sx={{ color: '#10b981', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.875rem' }}>
                    Regular Facility
                  </Typography>
                </>
              )}
            </Box>
          </Box>
          
          {/* Status */}
          <Box sx={{ 
            p: 2,
            borderRadius: '8px',
            background: facility.isActive 
              ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
              : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            border: facility.isActive 
              ? '1px solid #10b98120'
              : '2px solid #ef4444',
            flex: '1 1 180px'
          }}>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, fontWeight: 500, fontSize: '0.7rem' }}>
              Facility Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {facility.isActive ? (
                <>
                  <CheckCircleIcon sx={{ color: '#10b981', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.875rem' }}>
                    Active
                  </Typography>
                </>
              ) : (
                <>
                  <CancelIcon sx={{ color: '#ef4444', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600, fontSize: '0.875rem' }}>
                    Inactive
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>

        {/* Notes */}
        {facility.notes && (
          <Box sx={{ 
            mt: 2,
            p: 2,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
            border: '1px solid #f59e0b20'
          }}>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, fontWeight: 500, fontSize: '0.7rem' }}>
              Notes
            </Typography>
            <Typography variant="body2" sx={{ color: '#1e293b', lineHeight: 1.4, fontSize: '0.875rem' }}>
              {facility.notes}
            </Typography>
          </Box>
        )}

        {/* Missing Information Alert */}
        {getMissingKeys && getMissingKeys(facility).length > 0 && (
          <Box sx={{ 
            mt: 3,
            p: 3,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            border: '2px solid #ef4444'
          }}>
            <Typography variant="body2" sx={{ color: '#991b1b', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              ⚠️ Missing Information
            </Typography>
            <Typography variant="body2" sx={{ color: '#991b1b' }}>
              {getMissingKeys(facility).join(', ')}
            </Typography>
          </Box>
        )}

        {/* Additional Stats */}
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Views Total */}
          {facility.viewsTotal !== undefined && (
            <Box sx={{ 
              p: 1.5,
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
              border: '1px solid #d1d5db',
              flex: '1 1 120px'
            }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>Total Views</Typography>
              <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1rem' }}>
                {facility.viewsTotal.toLocaleString()}
              </Typography>
            </Box>
          )}
          
          {/* Rating */}
          {facility.averageRating !== undefined && facility.ratingCount > 0 && (
            <Box sx={{ 
              p: 2,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '1px solid #f59e0b20',
              flex: '1 1 150px'
            }}>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem' }}>Rating</Typography>
              <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
                {facility.averageRating.toFixed(1)} ⭐ ({facility.ratingCount})
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
};

// Management Actions Section Component
export const ManagementActionsSection: React.FC<ManagementActionsSectionProps> = ({ 
  facility, 
  onEdit, 
  onResetPassword, 
  onToggleActive, 
  onClose 
}) => {
  const styles = createModernStyles();

  const buttonStyles: SxProps<Theme> = {
    borderRadius: '12px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '14px',
    padding: '12px 24px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  return (
    <Card sx={{ 
      ...styles.card,
      p: 0,
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      <Box sx={{
        p: 1.5,
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: '16px 16px 0 0'
      }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b', fontSize: '0.95rem' }}>
          Management Actions
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Button 
            variant="contained" 
            size="small"
            sx={{
              ...buttonStyles,
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              fontSize: '0.875rem',
              py: 0.75,
              px: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
              }
            }}
            startIcon={<EditIcon sx={{ fontSize: 18 }} />}
            onClick={() => onEdit(facility)}
          >
            Edit Details
          </Button>
          
          <Button 
            variant="contained" 
            size="small"
            sx={{
              ...buttonStyles,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              fontSize: '0.875rem',
              py: 0.75,
              px: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
              }
            }}
            startIcon={<RefreshIcon sx={{ fontSize: 18 }} />}
            onClick={() => onResetPassword(facility)}
          >
            Reset Password
          </Button>
          
          <Button 
            variant="contained" 
            size="small"
            sx={{
              ...buttonStyles,
              background: facility.isActive 
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              fontSize: '0.875rem',
              py: 0.75,
              px: 1.5,
              '&:hover': {
                background: facility.isActive
                  ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                  : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                transform: 'translateY(-1px)',
                boxShadow: facility.isActive
                  ? '0 4px 15px rgba(239, 68, 68, 0.3)'
                  : '0 4px 15px rgba(16, 185, 129, 0.3)'
              }
            }}
            startIcon={<PowerSettingsNew sx={{ fontSize: 18 }} />}
            onClick={() => onToggleActive(facility)}
          >
            {facility.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          
          <Button 
            variant="outlined"
            size="small"
            sx={{
              ...buttonStyles,
              borderColor: '#d1d5db',
              color: '#6b7280',
              background: '#ffffff',
              fontSize: '0.875rem',
              py: 0.75,
              px: 1.5,
              '&:hover': {
                borderColor: '#9ca3af',
                background: '#f9fafb',
                transform: 'translateY(-1px)'
              }
            }}
            onClick={onClose}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Card>
  );
};