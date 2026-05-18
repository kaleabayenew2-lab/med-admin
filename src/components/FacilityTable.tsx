import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip, Button, Box } from '@mui/material';
import { formatCoordinates, type Facility } from '../utils/facilityUtils';
import { Factory as FacilityIcon, LocalHospital, LocalPharmacy } from '@mui/icons-material';

interface FacilityTableProps {
  facilities: Facility[];
  loading: boolean;
  error: string;
  onRowClick: (facility: Facility) => void;
  onToggleActive: (id: string, isActive?: boolean) => void;
  isComplete: (facility: Facility) => boolean;
}

const FacilityTable: React.FC<FacilityTableProps> = ({
  facilities,
  loading,
  error,
  onRowClick,
  onToggleActive,
  isComplete
}) => {
  const getLocationText = (loc: any) => {
    const coords = formatCoordinates(loc);
    return coords ? coords.text : null;
  };

  if (loading) {
    return <Typography>Loading facilities...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error">
        {error}
      </Typography>
    );
  }

  if (facilities.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%', maxWidth: 400 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No facilities found for selected filter.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Type</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Phone</strong></TableCell>
            <TableCell><strong>Location</strong></TableCell>
            <TableCell><strong>Location</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {facilities.map(f => (
            <TableRow 
              key={f._id || f.name || Math.random()} 
              sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }, cursor: 'pointer' }}
              onClick={() => onRowClick(f)}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {f.profileImage ? (
                    <Box sx={{ position: 'relative', width: 40, height: 40, mr: 2 }}>
                      <Box
                        component="img"
                        src={f.profileImage}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '2px solid',
                          borderColor: 'grey.300'
                        }}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          // Create a fallback icon element
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 24px; color: #9ca3af;">🏥</span></div>';
                          }
                        }}
                      />
                    </Box>
                  ) : (
                    f.type === 'hospital' ? (
                      <LocalHospital sx={{ fontSize: 40, color: 'grey.400' }} />
                    ) : f.type === 'pharmacy' ? (
                      <LocalPharmacy sx={{ fontSize: 40, color: 'grey.400' }} />
                    ) : (
                      <FacilityIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                    )
                  )}
                  {isComplete(f) ? <Chip label="✓" color="success" size="small" /> : <Chip label="⚠" color="warning" size="small" />}
                  <Typography variant="body2" fontWeight={f.isActive === false ? 'normal' : 'medium'}>
                    {f.name}
                  </Typography>
                  {f.isActive === false && <Chip label="Inactive" color="error" size="small" />}
                </Box>
              </TableCell>
              <TableCell>
                <Chip 
                  label={f.type} 
                  color={f.type === 'hospital' ? 'primary' : 'secondary'} 
                  size="small" 
                  variant="outlined"
                />
              </TableCell>
              <TableCell>{f.email || '—'}</TableCell>
              <TableCell>{f.phone || '—'}</TableCell>
              <TableCell>{getLocationText(f.location)}</TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={f.isActive === false ? 'normal' : 'medium'}>
                  {f.ownership || 'private'}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={(e) => { e.stopPropagation(); onRowClick(f); }}
                  >
                    Details
                  </Button>
                  <Button 
                    variant={f.isActive ? "outlined" : "contained"} 
                    color={f.isActive ? "error" : "success"}
                    size="small"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      const facilityId = f._id || (f as any).id;
                      if (facilityId) onToggleActive(facilityId, !!f.isActive);
                    }}
                  >
                    {f.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FacilityTable;
