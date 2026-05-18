import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import adminService from '../services/admin';
import Button from '../components/Button';
import ImageUploader from '../components/ImageUploader';
import Loading from '../components/Loading';
import { useAuth } from '../contexts/AuthContext';
import { useConfirm } from '../contexts/ConfirmContext';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Avatar,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Key,
  Lock,
  Visibility,
  VisibilityOff,
  Save,
  Logout,
  Refresh,
  CloudUpload,
  Security
} from '@mui/icons-material';

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [profile, setProfile] = useState<any>({ name: '', email: '', phone: '' });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // password change
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // api key
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const p = await adminService.getProfile();
        if (p) {
          setProfile(p);
          setAvatarUrl(p.avatarUrl || localStorage.getItem('profileAvatar'));
        } else {
          // fallback to localStorage
          const a = localStorage.getItem('profileAvatar');
          const e = localStorage.getItem('profileEmail');
          const n = localStorage.getItem('profileName');
          setAvatarUrl(a);
          setProfile({ name: n || '', email: e || '', phone: '' });
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  // Removed unused onFile function

  const saveProfile = async () => {
    // run validators
    try {
      const { validateProfile } = await import('../utils/validators');
      const v = validateProfile(profile);
      if (Object.keys(v).length > 0) {
        setErrors(v);
        return;
      }
    } catch (e) {
      // ignore
    }

    setSaving(true);
    setErrors({});
    try {
      const updated = await adminService.updateProfile(profile);
      setProfile(updated || profile);
      if (updated?.avatarUrl) setAvatarUrl(updated.avatarUrl);
      // persist some values locally for quick loading
      localStorage.setItem('profileEmail', profile.email || '');
      localStorage.setItem('profileName', profile.name || '');
      try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'success', message: 'Profile saved' } })); } catch (e) {}
    } catch (e) {
      console.error('Save failed', e);
      try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'error', message: 'Failed to save profile' } })); } catch (e) {}
    } finally { setSaving(false); }
  };

  const doChangePassword = async () => {
    if (newPassword !== confirmPassword) { try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'warning', message: 'Passwords do not match' } })); } catch (e) {} ; return; }
    try {
      const { validatePassword } = await import('../utils/validators');
      const err = validatePassword(newPassword);
      if (err) { try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'warning', message: err } })); } catch (e) {} ; return; }
    } catch (e) {}

    if (!currentPassword) { try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'warning', message: 'Current password is required' } })); } catch (e) {} ; return; }

    setSaving(true);
    try {
      await adminService.changePassword(currentPassword, newPassword);
      setShowPassword(false);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'success', message: 'Password changed' } })); } catch (e) {}
    } catch (e) {
      console.error('Password change failed', e);
      try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'error', message: 'Failed to change password' } })); } catch (e) {}
    } finally { setSaving(false); }
  };

  const loadApiKey = async () => {
    try {
      const k = await adminService.getApiKey();
      setApiKey(k || null);
    } catch (e) { console.error('Failed to load api key', e); }
  };

  const confirm = useConfirm();
  const auth = useAuth();

  const regenApiKey = async () => {
    const ok = await confirm({ title: 'Regenerate API key', message: 'Regenerate API key? This will invalidate the current key.', confirmText: 'Regenerate', cancelText: 'Cancel', danger: true });
    if (!ok) return;
    try {
      const k = await adminService.regenerateApiKey();
      setApiKey(k || null);
      try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'success', message: 'API key regenerated' } })); } catch (e) {}
    } catch (e) { console.error(e); try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'error', message: 'Failed to regenerate API key' } })); } catch (e) {} }
  };

  const logout = async () => {
    const ok = await confirm({ title: 'Sign out', message: 'Are you sure you want to sign out?', confirmText: 'Sign out', cancelText: 'Cancel', danger: true });
    if (!ok) return;
    try {
      localStorage.removeItem('authToken');
      try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'info', message: 'Signed out' } })); } catch (e) {}
      auth.logout();
    } catch (e) {
      console.error('Logout failed', e);
      try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'error', message: 'Failed to sign out' } })); } catch (e) {}
    }
  };

  return (
    <Layout>
      <Box sx={{ p: 3, minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Modern Header */}
        <Box sx={{
          mb: 4,
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderRadius: '16px',
          p: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
        }}>
          <Box sx={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, background: 'rgba(255, 255, 255, 0.08)', borderRadius: '50%' }} />
          
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)', 
              width: 64, 
              height: 64,
              backdropFilter: 'blur(10px)'
            }}>
              <Person sx={{ fontSize: 36, color: 'white' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                Profile Settings
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Manage your account information and security settings
              </Typography>
            </Box>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <CircularProgress size={48} sx={{ color: '#3b82f6' }} />
            <Typography sx={{ ml: 2, color: '#64748b' }}>Loading profile...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Profile Information Card */}
            <Grid item xs={12} md={8}>
              <Paper sx={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
              }}>
                <Box sx={{
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  p: 3,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Person sx={{ color: '#3b82f6' }} />
                    Personal Information
                  </Typography>
                </Box>
                
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    {/* Avatar Section */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={avatarUrl || undefined}
                          sx={{
                            width: 120,
                            height: 120,
                            border: '4px solid #3b82f6',
                            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)'
                          }}
                        >
                          <Person sx={{ fontSize: 48, color: '#64748b' }} />
                        </Avatar>
                        
                        <ImageUploader
                          accept="image/*"
                          maxWidth={800}
                          initialQuality={0.85}
                          uploadLabel="Upload Avatar"
                          onUpload={async (f) => {
                            setSaving(true);
                            try {
                              const url = await adminService.uploadAvatar(f as File);
                              setAvatarUrl(url);
                              localStorage.setItem('profileAvatar', url);
                            } finally { 
                              setSaving(false); 
                            }
                          }}
                        />
                        {saving && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={16} sx={{ color: '#3b82f6' }} />
                            <Typography variant="body2" sx={{ color: '#64748b' }}>Uploading...</Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    
                    {/* Form Fields */}
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={profile.name || ''}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          error={!!errors.name}
                          helperText={errors.name}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: '#64748b' }} />
                              </InputAdornment>
                            ),
                            sx: {
                              borderRadius: '12px',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px'
                              }
                            }
                          }}
                          sx={{
                            '& .MuiInputLabel-root': {
                              fontWeight: 600,
                              color: '#475569'
                            },
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: '#e2e8f0'
                              },
                              '&:hover fieldset': {
                                borderColor: '#3b82f6'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#3b82f6',
                                borderWidth: 2
                              }
                            }
                          }}
                        />
                        
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={profile.email || ''}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          error={!!errors.email}
                          helperText={errors.email}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{ color: '#64748b' }} />
                              </InputAdornment>
                            ),
                            sx: {
                              borderRadius: '12px',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px'
                              }
                            }
                          }}
                          sx={{
                            '& .MuiInputLabel-root': {
                              fontWeight: 600,
                              color: '#475569'
                            },
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: '#e2e8f0'
                              },
                              '&:hover fieldset': {
                                borderColor: '#3b82f6'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#3b82f6',
                                borderWidth: 2
                              }
                            }
                          }}
                        />
                        
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={profile.phone || ''}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          error={!!errors.phone}
                          helperText={errors.phone}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone sx={{ color: '#64748b' }} />
                              </InputAdornment>
                            ),
                            sx: {
                              borderRadius: '12px',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px'
                              }
                            }
                          }}
                          sx={{
                            '& .MuiInputLabel-root': {
                              fontWeight: 600,
                              color: '#475569'
                            },
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: '#e2e8f0'
                              },
                              '&:hover fieldset': {
                                borderColor: '#3b82f6'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#3b82f6',
                                borderWidth: 2
                              }
                            }
                          }}
                        />
                        
                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          <MuiButton
                            onClick={saveProfile}
                            disabled={saving}
                            startIcon={saving ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Save />}
                            sx={{
                              px: 3,
                              py: 1.5,
                              borderRadius: '12px',
                              fontWeight: 600,
                              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
                              },
                              '&:disabled': {
                                background: '#e2e8f0',
                                color: '#94a3b8',
                                boxShadow: 'none'
                              }
                            }}
                          >
                            {saving ? 'Saving...' : 'Save Profile'}
                          </MuiButton>
                          
                          <MuiButton
                            onClick={() => setShowPassword(true)}
                            startIcon={<Lock />}
                            sx={{
                              px: 3,
                              py: 1.5,
                              borderRadius: '12px',
                              fontWeight: 600,
                              background: 'rgba(0, 0, 0, 0.05)',
                              color: '#64748b',
                              '&:hover': {
                                background: 'rgba(0, 0, 0, 0.1)'
                              }
                            }}
                          >
                            Change Password
                          </MuiButton>
                          
                          <MuiButton
                            onClick={logout}
                            startIcon={<Logout />}
                            sx={{
                              px: 3,
                              py: 1.5,
                              borderRadius: '12px',
                              fontWeight: 600,
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              '&:hover': {
                                background: 'rgba(239, 68, 68, 0.2)'
                              }
                            }}
                          >
                            Logout
                          </MuiButton>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Paper>
            </Grid>
            
            {/* API Key Card */}
            <Grid item xs={12} md={4}>
              <Paper sx={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                height: 'fit-content'
              }}>
                <Box sx={{
                  background: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)',
                  p: 3,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#92400e', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Key sx={{ color: '#92400e' }} />
                    API Key
                  </Typography>
                </Box>
                
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                    Use this API key to access admin endpoints programmatically.
                  </Typography>
                  
                  <TextField
                    fullWidth
                    value={apiKey ?? ''}
                    readOnly
                    placeholder="No API key loaded"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Key sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: '#f8fafc'
                        }
                      }
                    }}
                    sx={{ mb: 2 }}
                  />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <MuiButton
                      onClick={loadApiKey}
                      startIcon={<Refresh />}
                      sx={{
                        py: 1.5,
                        borderRadius: '12px',
                        fontWeight: 600,
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                        '&:hover': {
                          background: 'rgba(59, 130, 246, 0.2)'
                        }
                      }}
                    >
                      Load API Key
                    </MuiButton>
                    
                    <MuiButton
                      onClick={regenApiKey}
                      startIcon={<Refresh />}
                      sx={{
                        py: 1.5,
                        borderRadius: '12px',
                        fontWeight: 600,
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        '&:hover': {
                          background: 'rgba(239, 68, 68, 0.2)'
                        }
                      }}
                    >
                      Regenerate Key
                    </MuiButton>
                  </Box>
                </CardContent>
              </Paper>
            </Grid>
          </Grid>
        )}
        
        {/* Password Change Dialog */}
        <Dialog
          open={showPassword}
          onClose={() => setShowPassword(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Security />
            Change Password
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }
                }}
              />
              
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }
                }}
              />
              
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px'
                    }
                  }
                }}
              />
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, background: '#f8fafc' }}>
            <MuiButton
              onClick={doChangePassword}
              startIcon={<Save />}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
                }
              }}
            >
              Update Password
            </MuiButton>
            
            <MuiButton
              onClick={() => setShowPassword(false)}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 600,
                background: 'rgba(0, 0, 0, 0.05)',
                color: '#64748b',
                '&:hover': {
                  background: 'rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              Cancel
            </MuiButton>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
