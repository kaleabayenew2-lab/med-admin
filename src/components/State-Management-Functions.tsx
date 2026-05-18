import React from 'react';
import { 
  Card, 
  Typography, 
  Box, 
  Button,
  Chip,
  IconButton,
  SxProps,
  Theme
} from '@mui/material';
import {
  Cancel as InactiveIcon,
  CheckCircle as ActiveIcon,
  Business as BusinessIcon,
  LocalHospital as HospitalIcon,
  LocalPharmacy as PharmacyIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CopyAll as CopyIcon,
  Map as MapIcon
} from '@mui/icons-material';
import { Facility } from '../utils/facilityUtils';

// TypeScript interfaces
interface DeactivatedFacilityViewProps {
  facility: Facility;
  onCopyToClipboard: (text: string, label?: string) => Promise<void>;
  formatCoordinates: (loc: any) => any;
  onActivate: () => void;
}

interface ActiveFacilityViewProps {
  facility: Facility;
  children: React.ReactNode;
}

// Deactivated Facility View Component
export const DeactivatedFacilityView: React.FC<DeactivatedFacilityViewProps> = ({ 
  facility, 
  onCopyToClipboard, 
  formatCoordinates, 
  onActivate 
}) => {
  const handleCoordinates = (loc: any) => {
    const c = formatCoordinates(loc);
    if (!c) return null;
    return c;
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Deactivated Status Banner */}
      <Card sx={{ 
        mb: 4,
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        border: '3px solid #ef4444',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          p: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          borderRadius: '16px 16px 0 0'
        }}>
          <InactiveIcon sx={{ fontSize: 48, color: '#ef4444', mb: 2 }} />
          <Typography variant="h4" color="#ef4444" fontWeight={700} sx={{ mb: 1 }}>
            Facility Deactivated
          </Typography>
          <Typography variant="body1" color="#dc2626" sx={{ fontSize: '1.1rem' }}>
            This facility is currently inactive and not accessible to users.
          </Typography>
        </Box>
      </Card>

      {/* Facility Header */}
      <Card sx={{ 
        mb: 4,
        borderRadius: '16px',
        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        opacity: 0.8
      }}>
        <Box sx={{
          p: 4,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '16px'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <BusinessIcon sx={{ opacity: 0.6, color: 'white' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#6b7280', lineHeight: 1.2, mb: 2 }}>
                {facility.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={facility.type}
                  sx={{
                    borderRadius: '20px',
                    fontWeight: 500,
                    fontSize: '12px',
                    height: '28px',
                    background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                    color: 'white'
                  }}
                />
                <Chip 
                  label="Inactive" 
                  icon={<InactiveIcon />}
                  sx={{
                    borderRadius: '20px',
                    fontWeight: 500,
                    fontSize: '12px',
                    height: '28px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white'
                  }}
                />
                {facility.ownership && (
                  <Typography variant="body2" sx={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon fontSize="small" />
                    {facility.ownership}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Information Grid */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Contact Information */}
        <Card sx={{ 
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          opacity: 0.7
        }}>
          <Box sx={{
            p: 1.5,
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            borderRadius: '16px 16px 0 0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 28,
                height: 28,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <PhoneIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography variant="h6" fontWeight={600} sx={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Contact Information
              </Typography>
            </Box>
          </Box>
          <Box sx={{ p: 3 }}>
            {facility.phone && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 2,
                p: 2,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                <PhoneIcon sx={{ color: '#9ca3af' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>Phone</Typography>
                  <Typography variant="body1" sx={{ color: '#6b7280', fontWeight: 500 }}>
                    +251 {facility.phone}
                  </Typography>
                </Box>
                <Button 
                  size="small" 
                  onClick={() => onCopyToClipboard(String(facility.phone), 'Phone')}
                  sx={{
                    background: 'rgba(156, 163, 175, 0.1)',
                    color: '#6b7280',
                    '&:hover': {
                      background: 'rgba(156, 163, 175, 0.2)'
                    }
                  }}
                >
                  Copy
                </Button>
              </Box>
            )}
          </Box>
        </Card>

        {/* Location Information */}
        <Card sx={{ 
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          opacity: 0.7
        }}>
          <Box sx={{
            p: 3,
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            borderRadius: '16px 16px 0 0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <LocationIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="h6" fontWeight={600} sx={{ color: '#6b7280' }}>
                Location & Agent ID
              </Typography>
            </Box>
          </Box>
          <Box sx={{ p: 3 }}>
            {facility.location ? (() => {
              const coords = handleCoordinates(facility.location);
              if (!coords) return (
                <Box sx={{ 
                  p: 2,
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px dashed #d1d5db'
                }}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Coordinates not available
                  </Typography>
                </Box>
              );
              return (
                <Box sx={{ 
                  p: 2,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LocationIcon sx={{ color: '#9ca3af' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>Coordinates</Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontFamily: 'ui-monospace, Monaco, "Cascadia Code", "Segoe UI Mono", monospace', 
                            color: '#6b7280',
                            fontWeight: 500
                          }}
                        >
                          {coords.text}
                        </Typography>
                      </Box>
                    </Box>
                    <Button 
                      size="small" 
                      onClick={() => onCopyToClipboard(coords.text, 'Coordinates')}
                      sx={{
                        background: 'rgba(156, 163, 175, 0.1)',
                        color: '#6b7280',
                        '&:hover': {
                          background: 'rgba(156, 163, 175, 0.2)'
                        }
                      }}
                    >
                      Copy
                    </Button>
                  </Box>
                </Box>
              );
            })() : (
              <Box sx={{ 
                p: 2,
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px dashed #d1d5db',
                mb: 2
              }}>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  Location not set
                </Typography>
              </Box>
            )}

            {/* Agent ID */}
            <Box sx={{ 
              p: 2,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                Agent ID
              </Typography>
              <Typography variant="body1" sx={{ color: '#6b7280', fontFamily: 'ui-monospace, Monaco, "Cascadia Code", "Segoe UI Mono", monospace', fontWeight: 500 }}>
                {(facility as any).agentId || 'N/A'}
              </Typography>
              {(facility as any).agentId && (
                <Button 
                  size="small" 
                  sx={{ mt: 0.5, p: 0.5 }}
                  onClick={() => onCopyToClipboard((facility as any).agentId, 'Agent ID')}
                >
                  Copy
                </Button>
              )}
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Activate Button Section */}
      <Card sx={{ 
        borderRadius: '16px',
        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.06)',
        border: '2px solid #10b981',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
      }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={600} sx={{ color: '#1e293b', mb: 2 }}>
            Reactivate Facility
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: 600, mx: 'auto' }}>
            Click the button below to reactivate this facility and make it accessible to users again.
            The facility will regain full functionality and appear in search results.
          </Typography>
          <Button 
            variant="contained" 
            color="success"
            size="large"
            startIcon={<ActiveIcon />}
            onClick={onActivate}
            sx={{
              px: 6,
              py: 2,
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 30px rgba(16, 185, 129, 0.4)'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Activate Facility
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

// Active Facility View Component
export const ActiveFacilityView: React.FC<ActiveFacilityViewProps> = ({ facility, children }) => {
  return (
    <Box sx={{ p: 4 }}>
      {/* Header Card */}
      <Card sx={{ 
        mb: 4,
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        background: '#ffffff',
        p: 0,
        overflow: 'hidden'
      }}>
        <Box sx={{
          p: 4,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          borderRadius: '16px 16px 0 0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Box sx={{
                width: 72,
                height: 72,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              }}>
                {facility.type === 'hospital' ? <HospitalIcon sx={{ fontSize: 32 }} /> : 
                 facility.type === 'pharmacy' ? <PharmacyIcon sx={{ fontSize: 32 }} /> : 
                 <BusinessIcon sx={{ fontSize: 32 }} />}
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={600} sx={{ color: '#1e293b', lineHeight: 1.1, mb: 1, fontSize: '1.1rem' }}>
                  {facility.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip 
                    label={facility.type}
                    size="small"
                    sx={{
                      borderRadius: '12px',
                      fontWeight: 500,
                      fontSize: '10px',
                      height: '22px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white'
                    }}
                  />
                  <Chip 
                    label={facility.isActive ? 'Active' : 'Inactive'} 
                    icon={facility.isActive ? <ActiveIcon /> : <InactiveIcon />}
                    size="small"
                    sx={{
                      borderRadius: '12px',
                      fontWeight: 500,
                      fontSize: '10px',
                      height: '22px',
                      background: facility.isActive 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white'
                    }}
                  />
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
      </Card>

      {/* Content Grid */}
      {children}
    </Box>
  );
};
