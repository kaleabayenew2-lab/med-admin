import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  Box, 
  Button,
  Fade,
  useTheme
} from '@mui/material';
import { Facility } from '../utils/facilityUtils';

// Import all extracted functions
import {
  ContactInfoSection,
  LocationServicesSection,
  AdditionalDetailsSection,
  ManagementActionsSection
} from './Core-Display-Functions';
import {
  PasswordBannerSection,
  FacilityHeaderSection,
  EditFacilityForm
} from './Form-Functions';
import {
  DeactivatedFacilityView,
  ActiveFacilityView
} from './State-Management-Functions';
import {
  createModernStyles,
  getFacilityIcon,
  getFacilityColor,
  formatCoordinates,
  copyToClipboardHandler,
  missingDataChecker
} from './Style-Layout-Functions';
import { ImageDisplaySection } from './FacilityCreation/components/ImageDisplaySection';

interface FacilityDetailsDialogProps {
  selected: Facility | null;
  onClose: () => void;
  onUpdate: (facility: Facility) => void;
  onSave: (facility: Facility) => Promise<void> | void;
  onResetPassword: (facility: Facility) => void;
  onToggleActive: (facility: Facility) => void;
  lastSavedPassword: string | null;
  tempPassword: string | null;
  onCopyToClipboard: (text: string, label?: string) => Promise<void>;
  getMissingKeys: (facility: Facility) => string[];
  hospitalMap: Record<string, string[]>;
  pharmacyMap: Record<string, string[]>;
  ALL_SERVICE_OPTIONS: string[];
  onEdit: (facility: Facility) => void;
  isEditMode?: boolean;
  // These props are now properly typed and optional
  onProfileImageChange?: (image: string) => void;
  onGalleryImageChange?: (images: string[]) => void;
  onProfileImageUpload?: () => void;
  onGalleryImageUpload?: () => void;
  onCancelEdit?: () => void;
}

const FacilityDetailsDialog: React.FC<FacilityDetailsDialogProps> = ({
  selected,
  onClose,
  onUpdate,
  onSave,
  onResetPassword,
  onToggleActive,
  lastSavedPassword,
  tempPassword,
  onCopyToClipboard,
  getMissingKeys,
  hospitalMap,
  pharmacyMap,
  ALL_SERVICE_OPTIONS,
  onEdit,
  isEditMode = false,
  onProfileImageChange,
  onGalleryImageChange,
  onProfileImageUpload,
  onGalleryImageUpload,
  onCancelEdit
}) => {
  const theme = useTheme();
  const styles = createModernStyles(theme);

  if (!selected) return null;

  // FIX: Create a wrapper function that matches the expected signature
  const formatCoordinatesWrapper = (loc: any) => {
    return `${loc.lat}, ${loc.lng}`;
  };

  return (
    <Dialog 
      open={!!selected} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={400}
      PaperProps={{ 
        sx: styles.dialog
      }}
    >
      <DialogTitle sx={{ 
        ...styles.header,
        color: '#1e293b',
        fontWeight: 600,
        fontSize: '1.1rem',
        py: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${getFacilityColor(selected)} 0%, ${getFacilityColor(selected)}dd 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}>
          {getFacilityIcon(selected)}
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b', lineHeight: 1.1, fontSize: '1.1rem' }}>
            {selected.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.2, fontSize: '0.8rem' }}>
            {selected.type} • {selected.isActive ? 'Active' : 'Inactive'}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ 
        p: 0,
        maxHeight: '75vh',
        overflow: 'auto',
        ...styles.scrollbar
      }}>
        {/* Password Banner */}
        <PasswordBannerSection 
          lastSavedPassword={lastSavedPassword}
          tempPassword={tempPassword}
          onCopyToClipboard={onCopyToClipboard}
        />

        {isEditMode ? (
          <Fade in={isEditMode} timeout={300}>
            <Box sx={{ p: 4 }}>
              <EditFacilityForm 
                facility={selected}
                onUpdate={onUpdate}
                onSave={onSave}
                onCancel={() => {
                  if (onCancelEdit) {
                    onCancelEdit();
                  } else {
                    onClose();
                  }
                }}
              />
            </Box>
          </Fade>
        ) : (
          /* Read-only view - Modern Card Layout */
          selected.isActive === false ? (
            <DeactivatedFacilityView 
              facility={selected}
              onCopyToClipboard={onCopyToClipboard}
              formatCoordinates={formatCoordinatesWrapper}
              onActivate={() => onToggleActive(selected)}
            />
          ) : (
            <ActiveFacilityView facility={selected}>
              {/* FIXED: Properly separate ContactInfoSection and ImageDisplaySection */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* FIXED: ImageDisplaySection as separate component */}
                <ImageDisplaySection 
                  profileImage={selected.profileImage}
                  galleryImages={selected.galleryImages}
                  onProfileImageChange={onProfileImageChange}
                  onGalleryImageChange={onGalleryImageChange}
                  onProfileImageUpload={onProfileImageUpload}
                  onGalleryImageUpload={onGalleryImageUpload}
                  disabled={false}
                />

                <ContactInfoSection 
                  facility={selected}
                  onCopyToClipboard={onCopyToClipboard}
                />

                <LocationServicesSection 
                  facility={selected}
                  onCopyToClipboard={onCopyToClipboard}
                  formatCoordinates={formatCoordinatesWrapper}
                />

                <AdditionalDetailsSection 
                  facility={selected}
                  onCopyToClipboard={onCopyToClipboard}
                  getMissingKeys={getMissingKeys}
                />

                <ManagementActionsSection 
                  facility={selected}
                  onEdit={onEdit}
                  onResetPassword={onResetPassword}
                  onToggleActive={onToggleActive}
                  onClose={onClose}
                />
              </Box>
            </ActiveFacilityView>
          )
        )}
      </DialogContent>
      <DialogActions sx={{ 
        p: 2,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: '0 0 20px 20px',
        minHeight: 'auto'
      }}>
        <Button 
          onClick={onClose}
          sx={{
            ...styles.button,
            borderColor: '#d1d5db',
            color: '#6b7280',
            background: '#ffffff',
            '&:hover': {
              borderColor: '#9ca3af',
              background: '#f9fafb'
            }
          }}
        >
          Close Dialog
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FacilityDetailsDialog;