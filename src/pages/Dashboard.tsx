import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Chip,
  LinearProgress,
  Snackbar,
  Alert,
  Fade,
  Tooltip,
  Stack,
  Grid,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Refresh,
  LocalHospital,
  MedicalServices,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Key,
  Send,
  Close,
  CheckCircle,
  Error,
  Warning,
  Settings,
  TrendingUp,
  Assessment,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useConfirm } from '../contexts/ConfirmContext';
import CreateFacilityPopup from '../components/CreateFacilityPopup';
import DashboardStats from '../components/DashboardStats';
import DashboardFilters from '../components/DashboardFilters';
import FacilityTable from '../components/FacilityTable';
import FacilityDetailsDialog from '../components/FacilityDetailsDialog';
import { useFacilities } from '../hooks/useFacilities';
import { Facility, isComplete, copyToClipboard, getMissingKeys, generateTempPassword, HOSPITAL_SERVICE_MAP, PHARMACY_SERVICE_MAP, ALL_SERVICE_OPTIONS } from '../utils/facilityUtils';

export default function Dashboard() {
  const {
    facilities,
    filteredFacilities,
    loading,
    error,
    searchQuery,
    filter,
    completenessFilter,
    loadFacilities,
    createFacility,
    updateFacility,
    deleteFacility,
    resetFacilityPassword,
    toggleFacilityActive,
    setSearchQuery,
    setFilter,
    setCompletenessFilter,
  } = useFacilities();

  const [selected, setSelected] = useState<Facility | null>(null);
  const [showCreatePopup, setShowCreatePopup] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [lastSavedPassword, setLastSavedPassword] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [showTempModal, setShowTempModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showManualResetModal, setShowManualResetModal] = useState<boolean>(false);
  const [validationMissing, setValidationMissing] = useState<string[]>([]);
  const [servicesDone, setServicesDone] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [showResetControls, setShowResetControls] = useState<boolean>(false);
  const [showManualReset, setShowManualReset] = useState<boolean>(false);
  const [manualPwd, setManualPwd] = useState<string>('');
  
  // Password reset form states
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; message: string; color: string }>({ score: 0, message: '', color: '' });
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState<boolean | null>(null);
  
  // Email reset attempt tracking
  const [emailResetAttempts, setEmailResetAttempts] = useState<number>(0);
  const [lastEmailResetAttempt, setLastEmailResetAttempt] = useState<number>(0);
  const [emailResetLocked, setEmailResetLocked] = useState<boolean>(false);
  const [emailResetCooldown, setEmailResetCooldown] = useState<number>(0);
  
  const confirm = useConfirm();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  const handleCreateFacility = async (facility: any) => {
    const result = await createFacility(facility);
    if (result.success) {
      setShowCreatePopup(false);
      // Select the newly created facility to verify it has an ID
      if (result.facility && result.facility._id) {
        setSelected(result.facility);
      }
      
      // Show success indicator in the center of the page
      try {
        window.dispatchEvent(new CustomEvent('admin:toast', { 
          detail: { 
            type: 'success', 
            message: '✅ Facility created successfully!',
            duration: 3000
          } 
        }));
      } catch(e){}
    }
  };

  const handleUpdateFacility = async (facility: Facility) => {
    // For inline editing, just update the selected state
    // The actual API call will happen when user clicks "Save"
    setSelected(facility as any);
  };

  const handleSaveFacility = async (facility: Facility): Promise<void> => {
    // Use id or _id field from Facility type
    const facilityId = facility.id || facility._id;
    if (!facilityId) {
      console.error('Facility ID is missing:', facility);
      setSnackbar({ open: true, message: 'Facility ID is missing', severity: 'error' });
      return;
    }
    
    // Format phone number before saving (add +251 prefix if not present)
    let formattedPhone = facility.phone || '';
    if (formattedPhone && !formattedPhone.startsWith('+251')) {
      formattedPhone = `+251${formattedPhone}`;
    }
    
    const facilityToUpdate = { ...facility, phone: formattedPhone };
    
    console.log('Saving facility ID:', facilityId);
    try {
      const result = await updateFacility(facilityId as string, facilityToUpdate);
      if (result.success) {
        // Exit edit mode and show success toast
        setSelected({ ...facilityToUpdate, _editing: false } as any);
        setSnackbar({ open: true, message: '✅ Facility updated successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to update facility', severity: 'error' });
      }
    } catch (error: any) {
      console.error('Error saving facility:', error);
      const msg = error?.response?.data?.error || 'An error occurred while saving';
      setSnackbar({ open: true, message: msg, severity: 'error' });
      throw error; // re-throw so the button's isSaving resets
    }
  };


  const handleResetPassword = async (facility: Facility) => {
    // Show the reset options modal instead of directly resetting
    setSelected(facility);
    setShowResetModal(true);
  };

  const checkEmailResetAttempts = (): { allowed: boolean; message: string; remainingAttempts?: number; cooldownTime?: number } => {
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
    
    // Check if currently in cooldown
    if (emailResetLocked && now - lastEmailResetAttempt < fifteenMinutes) {
      const remainingCooldown = Math.ceil((fifteenMinutes - (now - lastEmailResetAttempt)) / 60000);
      return {
        allowed: false,
        message: `Email reset is locked. Please wait ${remainingCooldown} minutes.`,
        cooldownTime: remainingCooldown
      };
    }
    
    // Reset cooldown if 15 minutes have passed
    if (emailResetLocked && now - lastEmailResetAttempt >= fifteenMinutes) {
      setEmailResetLocked(false);
      setEmailResetAttempts(0);
      setEmailResetCooldown(0);
    }
    
    // Check if attempts exceeded
    if (emailResetAttempts >= 3) {
      setEmailResetLocked(true);
      setLastEmailResetAttempt(now);
      setEmailResetCooldown(15);
      return {
        allowed: false,
        message: 'Maximum attempts reached. Please wait 15 minutes before trying again.',
        cooldownTime: 15
      };
    }
    
    return {
      allowed: true,
      message: '',
      remainingAttempts: 3 - emailResetAttempts
    };
  };

  const handleResetWithEmail = async (facility: Facility) => {
    if (!facility) {
      try {
        window.dispatchEvent(new CustomEvent('admin:toast', { 
          detail: { type: 'error', message: 'No facility selected' } 
        }));
      } catch(e) {}
      return;
    }

    // Check if facility has email
    if (!facility.email) {
      try {
        window.dispatchEvent(new CustomEvent('admin:toast', { 
          detail: { type: 'error', message: 'Facility email is required for password reset' } 
        }));
      } catch(e) {}
      return;
    }

    // Check attempt limits
    const attemptCheck = checkEmailResetAttempts();
    if (!attemptCheck.allowed) {
      try {
        window.dispatchEvent(new CustomEvent('admin:toast', { 
          detail: { type: 'error', message: attemptCheck.message } 
        }));
      } catch(e) {}
      return;
    }

    try {
      // Increment attempt counter
      const newAttemptCount = emailResetAttempts + 1;
      setEmailResetAttempts(newAttemptCount);
      setLastEmailResetAttempt(Date.now());
      
      console.log(`Email reset attempt ${newAttemptCount}/3 for facility ${facility.name}`);
      
      // Show loading state
      try {
        window.dispatchEvent(new CustomEvent('admin:toast', { 
          detail: { type: 'info', message: `Attempt ${newAttemptCount}/3: Generating secure password...` } 
        }));
      } catch(e) {}

      // Generate strong password using user info
      const strongPassword = generateStrongPassword(facility);
      console.log('Generated strong password:', strongPassword);
      
      // Reset password with generated password
      const facilityId = (facility as any).id || facility._id;
      if (!facilityId) {
        console.error('Facility ID is missing:', facility);
        try {
          window.dispatchEvent(new CustomEvent('admin:toast', { 
            detail: { type: 'error', message: 'Facility ID is missing' } 
          }));
        } catch(e) {}
        return;
      }
      
      console.log('Using facility ID for email reset:', facilityId);
      
      // Show updating password state
      try {
        window.dispatchEvent(new CustomEvent('admin:toast', { 
          detail: { type: 'info', message: 'Updating facility password...' } 
        }));
      } catch(e) {}
      
      const result = await resetFacilityPassword(facilityId, strongPassword);
      if (result.success) {
        console.log('Password reset successful, sending email...');
        
        // Show sending email state
        try {
          window.dispatchEvent(new CustomEvent('admin:toast', { 
            detail: { type: 'info', message: 'Sending password via email...' } 
          }));
        } catch(e) {}

        // Send email with new password
        const emailResult = await sendPasswordEmail(facility, strongPassword);
        
        if (emailResult) {
          // Reset attempts on successful email reset
          setEmailResetAttempts(0);
          setEmailResetLocked(false);
          setLastEmailResetAttempt(0);
          setEmailResetCooldown(0);
          
          // Show success message (without displaying password)
          try {
            window.dispatchEvent(new CustomEvent('admin:toast', { 
              detail: { 
                type: 'success', 
                message: `✅ Password reset and sent to ${facility.email}` 
              } 
            }));
          } catch(e) {}
        } else {
          // Password was reset but email failed - don't reset attempts
          try {
            window.dispatchEvent(new CustomEvent('admin:toast', { 
              detail: { 
                type: 'warning', 
                message: `Password reset successful but email failed. Please check email configuration. (${3 - newAttemptCount} attempts remaining)` 
              } 
            }));
          } catch(e) {}
        }
      } else {
        // Password reset failed - don't reset attempts
        try {
          window.dispatchEvent(new CustomEvent('admin:toast', { 
            detail: { type: 'error', message: `${result.error || 'Failed to reset password'} (${3 - newAttemptCount} attempts remaining)` } 
          }));
        } catch(e) {}
      }
    } catch (error) {
      console.error('Reset with email error:', error);
      try {
        window.dispatchEvent(new CustomEvent('admin:toast', { 
          detail: { type: 'error', message: `Failed to reset and send password (${3 - emailResetAttempts} attempts remaining)` } 
        }));
      } catch(e) {}
    }
  };

  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      return { score: 0, message: '', color: '' };
    }
    
    let score = 0;
    let message = '';
    let color = '';
    
    // Length check
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    
    // Complexity checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    // Determine strength message and color
    if (score <= 2) {
      message = 'Weak';
      color = 'error';
    } else if (score <= 4) {
      message = 'Medium';
      color = 'warning';
    } else {
      message = 'Strong';
      color = 'success';
    }
    
    return { score, message, color };
  };

  const verifyCurrentPassword = async (password: string) => {
    if (!selected || !password) {
      setIsCurrentPasswordValid(null);
      return;
    }
    
    try {
      const response = await fetch(`/api/facilities/${selected._id}/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const result = await response.json();
      setIsCurrentPasswordValid(result.valid);
    } catch (error) {
      console.error('Error verifying current password:', error);
      setIsCurrentPasswordValid(false);
    }
  };

  const handleManualReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      try {
        window.dispatchEvent(new CustomEvent('admin:toast', { 
          detail: { type: 'error', message: 'New passwords do not match' } 
        }));
      } catch(e) {}
      return;
    }
    
    // Validate password length
    if (newPassword.length < 6 || newPassword.length > 8) {
      try {
        window.dispatchEvent(new CustomEvent('admin:toast', { 
          detail: { type: 'error', message: 'Password must be 6-8 characters long' } 
        }));
      } catch(e) {}
      return;
    }
    
    // Validate password strength
    const strength = calculatePasswordStrength(newPassword);
    if (strength.score < 3) {
      try {
        window.dispatchEvent(new CustomEvent('admin:toast', { 
          detail: { type: 'error', message: 'Password is too weak. Please include uppercase, lowercase, and numbers.' } 
        }));
      } catch(e) {}
      return;
    }
    
    // Verify current password if provided
    if (currentPassword && isCurrentPasswordValid === false) {
      try {
        window.dispatchEvent(new CustomEvent('admin:toast', { 
          detail: { type: 'error', message: 'Current password is incorrect' } 
        }));
      } catch(e) {}
      return;
    }
    
    if (!selected) {
      try {
        window.dispatchEvent(new CustomEvent('admin:toast', { 
          detail: { type: 'error', message: 'No facility selected' } 
        }));
      } catch(e) {}
      return;
    }
    
    try {
      const facilityId = selected._id;
      if (!facilityId) {
        console.error('Facility ID is missing:', selected);
        try {
          window.dispatchEvent(new CustomEvent('admin:toast', { 
            detail: { type: 'error', message: 'Facility ID is missing' } 
          }));
        } catch(e) {}
        return;
      }
      
      const result = await resetFacilityPassword(facilityId, newPassword);
      if (result.success) {
        setShowManualResetModal(false);
        
        // Reset form states
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordStrength({ score: 0, message: '', color: '' });
        setIsCurrentPasswordValid(null);
        setManualPwd('');
        
        try {
          window.dispatchEvent(new CustomEvent('admin:toast', { 
            detail: { type: 'success', message: 'Password reset successfully' } 
          }));
        } catch(e) {}
      } else {
        try {
          window.dispatchEvent(new CustomEvent('admin:toast', { 
            detail: { type: 'error', message: result.error || 'Failed to reset password' } 
          }));
        } catch(e) {}
      }
    } catch (error) {
      console.error('Manual reset error:', error);
      try {
        window.dispatchEvent(new CustomEvent('admin:toast', { 
          detail: { type: 'error', message: 'Failed to reset password' } 
        }));
      } catch(e) {}
    }
  };

  const generateStrongPassword = (facility: Facility): string => {
    console.log('🔐 Generating strong password for facility:', facility.name);
    
    // Extract letters from username
    const username = facility.username || facility.name || '';
    const usernameLetters = username.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
    
    // Extract numbers from phone
    const phone = facility.phone || '';
    const phoneNumbers = phone.replace(/[^0-9]/g, '').slice(-3);
    
    // Generate random characters to fill remaining length
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    
    // Calculate how many random characters we need
    let currentLength = usernameLetters.length + phoneNumbers.length;
    let targetLength = 6; // Minimum 6 characters
    
    // If we have enough from username and phone, aim for 8 characters
    if (currentLength >= 4) {
      targetLength = 8;
    }
    
    const remainingLength = targetLength - currentLength;
    
    for (let i = 0; i < remainingLength; i++) {
      randomPart += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    
    // Combine parts
    let password = usernameLetters + phoneNumbers + randomPart;
    
    // Ensure we have at least 6 characters
    if (password.length < 6) {
      const additionalChars = 6 - password.length;
      for (let i = 0; i < additionalChars; i++) {
        password += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
    }
    
    // Trim to 8 characters if longer
    if (password.length > 8) {
      password = password.slice(0, 8);
    }
    
    // Final fallback - generate completely random if something went wrong
    if (password.length < 6) {
      console.warn('Password generation failed, using fallback');
      password = '';
      for (let i = 0; i < 6; i++) {
        password += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
    }
    
    console.log(`🔐 Generated password: ${password} (from username: "${usernameLetters}", phone: "${phoneNumbers}", random: "${randomPart}")`);
    return password;
  };

  const sendPasswordEmail = async (facility: Facility, password: string): Promise<boolean> => {
    try {
      console.log(`📧 Sending password email to ${facility.email} for facility ${facility.name}`);
      
      const response = await fetch('/api/facilities/send-password-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: facility.email,
          facilityName: facility.name,
          password: password,
        }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log(`✅ Password email sent successfully to ${facility.email}`);
        return true;
      } else {
        console.error('❌ Failed to send password email:', result.error || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending password email:', error);
      return false;
    }
  };

  const handleToggleActive = async (facility: Facility) => {
    const action = facility.isActive ? 'Deactivate' : 'Activate';
    const ok = await confirm({ 
      title: `${action} facility`, 
      message: `${action} this facility? This will ${action.toLowerCase()} the facility and make it ${facility.isActive ? 'inaccessible' : 'accessible'} to users.`, 
      confirmText: action, 
      cancelText: 'Cancel', 
      danger: (action === 'Deactivate') 
    });
    if (ok) {
      try {
        // Use _id field from Facility type
        const facilityId = facility._id;
        if (!facilityId) {
          console.error('Facility ID is missing:', facility);
          try {
            window.dispatchEvent(new CustomEvent('admin:toast', { 
              detail: { type: 'error', message: 'Facility ID is missing' } 
            }));
          } catch(e) {}
          return;
        }
        
        console.log('Toggling active status for facility ID:', facilityId);
        const result = await toggleFacilityActive(facilityId, facility.isActive || false);
        if (result.success) {
          // Show success toast
          try {
            window.dispatchEvent(new CustomEvent('admin:toast', { 
              detail: { type: 'success', message: `Facility ${action}d successfully` } 
            }));
          } catch(e) {}
          // Update the selected facility to reflect the change
          setSelected({ ...facility, isActive: !facility.isActive } as any);
        } else {
          // Show error toast
          try {
            window.dispatchEvent(new CustomEvent('admin:toast', { 
              detail: { type: 'error', message: `Failed to ${action.toLowerCase()} facility` } 
            }));
          } catch(e) {}
        }
      } catch (error) {
        console.error('Toggle active error:', error);
        try {
          window.dispatchEvent(new CustomEvent('admin:toast', { 
            detail: { type: 'error', message: `Failed to ${action.toLowerCase()} facility` } 
          }));
        } catch(e) {}
      }
    }
  };

  const handleEdit = (facility: Facility) => {
    setSelected({ ...facility, _editing: true } as any);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      p: 3
    }}>
      {/* Header */}
      <Paper sx={{ 
        p: 3, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
        color: 'white',
        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
        mb: 4
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)', 
              mr: 2,
              width: 56,
              height: 56
            }}>
              <DashboardIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Facility Management Dashboard
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage healthcare facilities and services
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              icon={<LocalHospital />}
              label={`${facilities.length} facilities`}
              color="default"
              variant="outlined"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                color: 'white',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
            <Tooltip title="Refresh facilities">
              <IconButton 
                onClick={() => loadFacilities()}
                disabled={loading}
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                  color: 'white'
                }}
              >
                {loading ? <Refresh sx={{ animation: 'spin 1s linear infinite' }} /> : <Refresh />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Dashboard Stats */}
      <DashboardStats facilities={facilities} />

      {/* Filters and Actions */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', mb: 4 }}>
        <DashboardFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
          completenessFilter={completenessFilter}
          setCompletenessFilter={setCompletenessFilter}
          loading={loading}
          onReload={loadFacilities}
        />
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Facilities Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => setShowCreatePopup(true)}
            sx={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)' }
            }}
          >
            Create Facility
          </Button>
        </Box>
      </Paper>

      {/* Facilities Table */}
      <FacilityTable
        facilities={filteredFacilities}
        loading={loading}
        error={error}
        onRowClick={setSelected}
        onToggleActive={toggleFacilityActive}
        isComplete={isComplete}
      />

      <FacilityDetailsDialog
        selected={selected}
        onClose={() => setSelected(null)}
        onUpdate={handleUpdateFacility}
        onSave={handleSaveFacility}
        onResetPassword={handleResetPassword}
        onToggleActive={handleToggleActive}
        lastSavedPassword={lastSavedPassword}
        tempPassword={tempPassword}
        onCopyToClipboard={copyToClipboard}
        getMissingKeys={getMissingKeys}
        hospitalMap={HOSPITAL_SERVICE_MAP}
        pharmacyMap={PHARMACY_SERVICE_MAP}
        ALL_SERVICE_OPTIONS={ALL_SERVICE_OPTIONS}
        isEditMode={(selected as any)?._editing || false}
        onEdit={handleEdit}
        onCancelEdit={() => setSelected({ ...selected, _editing: false } as any)}
      />

      {/* Temporary Password Dialog */}
      <Dialog 
        open={showTempModal} 
        onClose={() => setShowTempModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          color: 'white',
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Temporary Password
            </Typography>
            <IconButton 
              onClick={() => { setShowTempModal(false); setTempPassword(null); }}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar sx={{ 
              bgcolor: 'primary.light', 
              width: 64, 
              height: 64, 
              mx: 'auto', 
              mb: 2 
            }}>
              <Key sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Share this password with the facility administrator
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            value={tempPassword || ''}
            variant="outlined"
            InputProps={{
              readOnly: true,
              sx: { 
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                textAlign: 'center',
                bgcolor: 'grey.50'
              }
            }}
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={async () => { 
                await copyToClipboard(String(tempPassword || ''), 'Temporary password'); 
                setSnackbar({ open: true, message: 'Password copied to clipboard!', severity: 'success' });
              }}
            >
              Copy Password
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => { setShowTempModal(false); setTempPassword(null); }}
              sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
            >
              Done
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog 
        open={showResetModal} 
        onClose={() => setShowResetModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Reset Facility Password
            </Typography>
            <IconButton 
              onClick={() => setShowResetModal(false)}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar sx={{ 
              bgcolor: 'warning.light', 
              width: 64, 
              height: 64, 
              mx: 'auto', 
              mb: 2 
            }}>
              <Lock sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Choose how you want to reset the password
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setShowResetModal(false);
                setShowManualResetModal(true);
              }}
              startIcon={<Key />}
              sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
            >
              Reset with New Password
            </Button>

            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                handleResetWithEmail(selected);
                setShowResetModal(false);
              }}
              disabled={emailResetLocked}
              startIcon={<Email />}
              sx={{ 
                bgcolor: emailResetLocked ? 'grey.300' : '#10b981',
                '&:hover': { bgcolor: emailResetLocked ? 'grey.300' : '#059669' },
                color: emailResetLocked ? 'grey.500' : 'white'
              }}
            >
              Reset & Send via Email
              {emailResetAttempts > 0 && !emailResetLocked && (
                <Chip 
                  label={`${3 - emailResetAttempts} left`}
                  size="small"
                  sx={{ ml: 1, bgcolor: 'rgba(255,255,255,0.2)' }}
                />
              )}
            </Button>
          </Box>

          {/* Attempt Status */}
          {(emailResetAttempts > 0 || emailResetLocked) && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {emailResetLocked ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Error sx={{ color: 'error.main', fontSize: 16 }} />
                    <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                      Email reset locked for {emailResetCooldown} minutes
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning sx={{ color: 'warning.main', fontSize: 16 }} />
                    <Typography variant="body2">
                      {emailResetAttempts} of 3 attempts used. {3 - emailResetAttempts} remaining.
                    </Typography>
                  </Box>
                )}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowResetModal(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manual Reset Password Dialog */}
      <Dialog 
        open={showManualResetModal} 
        onClose={() => setShowManualResetModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          color: 'white',
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Set New Password
            </Typography>
            <IconButton 
              onClick={() => setShowManualResetModal(false)}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
            Create a new password for {selected?.name}
          </Typography>

          <Box component="form" onSubmit={handleManualReset} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setIsCurrentPasswordValid(null);
                if (e.target.value) {
                  verifyCurrentPassword(e.target.value);
                }
              }}
              label="Current Password (Optional)"
              placeholder="Enter current password if known"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {isCurrentPasswordValid === false && (
              <Typography variant="caption" color="error">Current password is incorrect</Typography>
            )}
            {isCurrentPasswordValid === true && (
              <Typography variant="caption" color="success">Current password verified</Typography>
            )}

            <TextField
              fullWidth
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordStrength(calculatePasswordStrength(e.target.value));
              }}
              label="New Password"
              placeholder="6-8 characters"
              required
              inputProps={{ minLength: 6, maxLength: 8 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {passwordStrength.message && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">Password Strength:</Typography>
                  <Typography variant="caption" color={passwordStrength.color} fontWeight="bold">
                    {passwordStrength.message}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(passwordStrength.score / 6) * 100} 
                  color={passwordStrength.color as any}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            )}

            <TextField
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              label="Confirm New Password"
              placeholder="Confirm new password"
              required
              inputProps={{ minLength: 6, maxLength: 8 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <Typography variant="caption" color="error">Passwords do not match</Typography>
            )}
            {confirmPassword && newPassword === confirmPassword && (
              <Typography variant="caption" color="success">Passwords match</Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setShowManualResetModal(false);
                  // Reset all states
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordStrength({ score: 0, message: '', color: '' });
                  setIsCurrentPasswordValid(null);
                  setShowCurrentPassword(false);
                  setShowNewPassword(false);
                  setShowConfirmPassword(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
              >
                Reset Password
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      
      <CreateFacilityPopup
        open={showCreatePopup}
        onClose={() => setShowCreatePopup(false)}
        onCreate={handleCreateFacility}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}