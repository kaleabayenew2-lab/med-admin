import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  FormControlLabel,
  Switch,
  CircularProgress,
  Paper,
  Avatar,
  Divider,
  alpha
} from '@mui/material';
import { 
  Person, 
  Visibility, 
  VisibilityOff, 
  Close, 
  SaveAs, 
  LocalHospital,
  LocalPharmacy,
  Business,
  LocationOn,
  Email,
  Phone,
  Schedule
} from '@mui/icons-material';

import { CreateFacilityPopupProps, TabPanelProps } from './types/facilityTypes';
import { useFacilityForm } from './hooks/useFacilityForm';
import { useUniquenessValidation } from './hooks/useUniquenessValidation';
import { useOTPVerification } from './hooks/useOTPVerification';
import { HospitalForm } from './components/HospitalForm';
import { PharmacyForm } from './components/PharmacyForm';
import { OTPDialog } from './components/OTPDialog';
import { ProfileImageUploader } from './components/ProfileImageUploader';
import { GalleryImageUploader } from './components/GalleryImageUploader';

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`facility-tabpanel-${index}`}
      aria-labelledby={`facility-tab-${index}`}
      style={{ height: 'calc(90vh - 200px)', overflow: 'auto' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ 
          p: 0, 
          height: '100%',
          background: '#ffffff'
        }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function CreateFacilityPopup({ open, onClose, onCreate, defaultTab = 'hospital' }: CreateFacilityPopupProps) {
  const initialTab = defaultTab === 'pharmacy' ? 1 : 0;
  const facilityForm = useFacilityForm(initialTab, defaultTab);
  const uniquenessValidation = useUniquenessValidation();
  const otpVerification = useOTPVerification();

  // Reset all states when dialog closes
  const handleClose = () => {
    facilityForm.resetForm();
    uniquenessValidation.resetValidation();
    otpVerification.resetOTP();
    onClose();
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    facilityForm.handleTabChange(newValue);
  };

  // Handle input changes with validation
  const handleInputChange = (field: string) => (event: any) => {
    // Special handling for hospital or pharmacy type - reset services when type changes
    if (field === 'hospitalType' || field === 'pharmacyType') {
      facilityForm.updateFormField('services', []);
    }
    
    // Call the hook's handleInputChange with the event
    const handler = facilityForm.handleInputChange(field);
    handler(event);
    
    // Check name uniqueness when name field changes
    if (field === 'name') {
      console.log('Name changed to:', event.target.value, 'Type:', facilityForm.formData.type);
      uniquenessValidation.checkNameUniqueness(event.target.value, facilityForm.formData.type);
    }
  };

  // Handle email change with validation
  const handleEmailChange = (event: any) => {
    facilityForm.handleEmailChange(event);
    
    // Check email uniqueness in real-time
    if (facilityForm.isValidEmail(event.target.value)) {
      uniquenessValidation.checkEmailUniqueness(event.target.value);
    } else {
      uniquenessValidation.updateValidationState({ emailExists: false });
    }
  };

  // Handle phone change with validation
  const handlePhoneChange = (event: any) => {
    facilityForm.handlePhoneChange(event);
    
    // Check phone uniqueness in real-time when 9 digits are entered
    if (event.target.value.length === 9) {
      uniquenessValidation.checkPhoneUniqueness(event.target.value);
    } else {
      uniquenessValidation.updateValidationState({ phoneExists: false });
    }
  };

  // Handle form submission
  const handleCreate = async () => {
    const errors = facilityForm.validateForm();
    if (errors.length > 0) {
      facilityForm.updateFormUIState({ validationErrors: errors });
      return;
    }
    
    // Start OTP verification process
    const result = await otpVerification.handleSendOTP(
      facilityForm.formData.email, 
      facilityForm.formData.name
    );
    
    if (!result.success) {
      return; // Error already handled in hook
    }
  };

  // Handle OTP verification success
  const handleOTPSuccess = async () => {
    try {
      facilityForm.updateFormUIState({ isSubmitting: true });
      const facilityObject = facilityForm.createFacilityObject();
      await onCreate(facilityObject);
      handleClose();
    } catch (error) {
      console.error('Failed to create facility:', error);
    } finally {
      facilityForm.updateFormUIState({ isSubmitting: false });
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    await otpVerification.handleVerifyOTP(facilityForm.formData.email, handleOTPSuccess);
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    await otpVerification.handleSendOTP(
      facilityForm.formData.email, 
      facilityForm.formData.name
    );
  };

  // Reusable section for password, emergency, and notes
  const renderAdditionalInfo = () => (
    <>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Password (Optional)"
          type={facilityForm.formUIState.showPassword ? 'text' : 'password'}
          value={facilityForm.formData.password}
          onChange={facilityForm.handleInputChange('password')}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Person /></InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  onClick={() => facilityForm.updateFormUIState({ showPassword: !facilityForm.formUIState.showPassword })}
                  sx={{ minWidth: 'auto', p: 0 }}
                >
                  {facilityForm.formUIState.showPassword ? <VisibilityOff /> : <Visibility />}
                </Button>
              </InputAdornment>
            )
          }}
          error={facilityForm.formUIState.validationErrors.includes('password')}
          helperText={
            facilityForm.formUIState.validationErrors.includes('password') 
              ? 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
              : 'Optional: Leave blank for auto-generated password'
          }
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={facilityForm.formData.emergency}
              onChange={(e) => facilityForm.updateFormField('emergency', e.target.checked)}
              color="error"
            />
          }
          label="Emergency Facility"
          sx={{ mt: 1 }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Notes (Optional)"
          value={facilityForm.formData.notes}
          onChange={facilityForm.handleInputChange('notes')}
          multiline
          rows={3}
          placeholder="Any additional information about this facility..."
          helperText="Optional: Add any notes or special instructions"
        />
      </Grid>
    </>
  );

  // Check if form is valid
  const isFormValid = facilityForm.isFormValid() && 
    !uniquenessValidation.validationState.nameExists &&
    !uniquenessValidation.validationState.emailExists &&
    !uniquenessValidation.validationState.phoneExists;

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh',
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        {/* Modern Header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          p: 2,
          borderRadius: '12px 12px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Avatar sx={{ 
            width: 40, 
            height: 40,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <Business sx={{ fontSize: 24, color: 'white' }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              mb: 0.5, 
              fontSize: '1.3rem',
              lineHeight: 1.2,
              color: 'white',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              Create New Facility
            </Typography>
            <Typography variant="body2" sx={{ 
              opacity: 0.95, 
              fontSize: '0.75rem',
              color: 'white',
              lineHeight: 1.3
            }}>
              Add a new healthcare facility to your network
            </Typography>
          </Box>
        </Box>

        <DialogContent sx={{ 
          height: 'calc(90vh - 180px)', 
          overflow: 'hidden',
          p: 0,
          background: '#ffffff'
        }}>
          {/* Modern Tabs */}
          <Box sx={{ 
            background: '#f8fafc',
            borderBottom: 'none',
            px: 3,
            py: 2
          }}>
            <Tabs 
              value={facilityForm.formUIState.tabValue} 
              onChange={handleTabChange} 
              aria-label="Facility type tabs"
              variant="fullWidth"
              sx={{
                '& .MuiTabs-indicator': {
                  display: 'none'
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: '#64748b',
                  borderRadius: '12px',
                  mx: 1,
                  minHeight: '48px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(59, 130, 246, 0.08)'
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }
                }
              }}
            >
              <Tab 
                icon={<LocalHospital sx={{ mr: 1, fontSize: 20 }} />} 
                label="Hospital" 
                iconPosition="start"
              />
              <Tab 
                icon={<LocalPharmacy sx={{ mr: 1, fontSize: 20 }} />} 
                label="Pharmacy" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={facilityForm.formUIState.tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              {/* Image Upload Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Facility Images
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <ProfileImageUploader
                      currentImage={facilityForm.formData.profileImage}
                      onImageUpload={(url) => facilityForm.updateFormField('profileImage', url)}
                      onImageRemove={() => facilityForm.updateFormField('profileImage', '')}
                      disabled={facilityForm.formUIState.isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <GalleryImageUploader
                      currentImages={facilityForm.formData.galleryImages}
                      onImagesUpload={(urls) => facilityForm.updateFormField('galleryImages', urls)}
                      onImageRemove={(index) => {
                        const currentImages = facilityForm.formData.galleryImages || [];
                        const newImages = currentImages.filter((_, i) => i !== index);
                        facilityForm.updateFormField('galleryImages', newImages);
                      }}
                      disabled={facilityForm.formUIState.isSubmitting}
                    />
                  </Grid>
                </Grid>
              </Box>
              
              <HospitalForm
                formData={facilityForm.formData}
                validationErrors={facilityForm.formUIState.validationErrors}
                validationState={uniquenessValidation.validationState}
                onInputChange={handleInputChange}
                onEmailChange={handleEmailChange}
                onPhoneChange={handlePhoneChange}
                onServiceToggle={facilityForm.handleServiceToggle}
                onLocationDetect={facilityForm.handleLocationDetect}
                isDetectingLocation={facilityForm.formUIState.isDetectingLocation}
                showPassword={facilityForm.formUIState.showPassword}
                onPasswordToggle={() => facilityForm.updateFormUIState({ showPassword: !facilityForm.formUIState.showPassword })}
                onEmergencyToggle={(checked) => facilityForm.updateFormField('emergency', checked)}
                renderAdditionalInfo={renderAdditionalInfo}
              />
            </Box>
          </TabPanel>

          <TabPanel value={facilityForm.formUIState.tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              {/* Image Upload Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Facility Images
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <ProfileImageUploader
                      currentImage={facilityForm.formData.profileImage}
                      onImageUpload={(url) => facilityForm.updateFormField('profileImage', url)}
                      onImageRemove={() => facilityForm.updateFormField('profileImage', '')}
                      disabled={facilityForm.formUIState.isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <GalleryImageUploader
                      currentImages={facilityForm.formData.galleryImages}
                      onImagesUpload={(urls) => facilityForm.updateFormField('galleryImages', urls)}
                      onImageRemove={(index) => {
                        const currentImages = facilityForm.formData.galleryImages || [];
                        const newImages = currentImages.filter((_, i) => i !== index);
                        facilityForm.updateFormField('galleryImages', newImages);
                      }}
                      disabled={facilityForm.formUIState.isSubmitting}
                    />
                  </Grid>
                </Grid>
              </Box>
              
              <PharmacyForm
                formData={facilityForm.formData}
                validationErrors={facilityForm.formUIState.validationErrors}
                validationState={uniquenessValidation.validationState}
                onInputChange={handleInputChange}
                onEmailChange={handleEmailChange}
                onPhoneChange={handlePhoneChange}
                onServiceToggle={facilityForm.handleServiceToggle}
                onLocationDetect={facilityForm.handleLocationDetect}
                isDetectingLocation={facilityForm.formUIState.isDetectingLocation}
                showPassword={facilityForm.formUIState.showPassword}
                onPasswordToggle={() => facilityForm.updateFormUIState({ showPassword: !facilityForm.formUIState.showPassword })}
                onEmergencyToggle={(checked) => facilityForm.updateFormField('emergency', checked)}
                renderAdditionalInfo={renderAdditionalInfo}
              />
            </Box>
          </TabPanel>
        </DialogContent>

        {/* Modern Footer */}
        <DialogActions sx={{ 
          p: 2,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          minHeight: 'auto'
        }}>
          <Button 
            onClick={handleClose} 
            startIcon={<Close />}
            disabled={facilityForm.formUIState.isSubmitting || otpVerification.otpState.isVerifyingOTP}
            sx={{
              px: 2.5,
              py: 1,
              borderRadius: '10px',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              minHeight: '36px',
              '&:disabled': {
                opacity: 0.5
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            startIcon={facilityForm.formUIState.isSubmitting || otpVerification.otpState.isSendingOTP ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <SaveAs />}
            disabled={!isFormValid || facilityForm.formUIState.isSubmitting || otpVerification.otpState.isSendingOTP || otpVerification.otpState.isVerifyingOTP}
            sx={{
              px: 3,
              py: 1,
              borderRadius: '10px',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.875rem',
              minHeight: '36px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)'
              },
              '&:disabled': {
                background: '#e2e8f0',
                color: '#94a3b8',
                boxShadow: 'none'
              }
            }}
          >
            {facilityForm.formUIState.isSubmitting || otpVerification.otpState.isSendingOTP ? 'Creating...' : 'Create Facility'}
          </Button>
        </DialogActions>
      </Dialog>

      <OTPDialog
        open={otpVerification.otpState.showOTPDialog}
        email={facilityForm.formData.email}
        otpCode={otpVerification.otpState.otpCode}
        isVerifyingOTP={otpVerification.otpState.isVerifyingOTP}
        resendTimer={otpVerification.otpState.resendTimer}
        canResendOTP={otpVerification.canResendOTP()}
        onOTPChange={otpVerification.handleOTPChange}
        onVerifyOTP={handleVerifyOTP}
        onResendOTP={handleResendOTP}
        onClose={() => otpVerification.updateOTPState({ showOTPDialog: false })}
      />
    </>
  );
}
