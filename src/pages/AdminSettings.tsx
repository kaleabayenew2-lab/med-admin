import React, { useEffect, useState } from 'react';
import adminService from '../services/admin';
import Button from '../components/Button';
import ImageUploader from '../components/ImageUploader';
import Toggle from '../components/Toggle';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
  Button as MuiButton,
  CircularProgress,
  alpha
} from '@mui/material';
import {
  Settings,
  DarkMode,
  Language,
  NotificationsActive,
  Telegram,
  Email,
  Map,
  Key,
  Security,
  PersonAdd,
  ViewList,
  Schedule,
  Analytics,
  AdsClick,
  Visibility,
  Pageview,
  TrackChanges,
  Save,
  Refresh,
  CloudUpload
} from '@mui/icons-material';

export default function AdminSettings(){
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const s = await adminService.getSettings();
      setSettings(s);
    } catch (e) { console.error(e); try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'error', message: 'Failed to load settings' } })); } catch(e){} }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await adminService.updateSettings(settings);
      setSettings(updated);
      try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'success', message: 'Saved' } })); } catch(e){}
    } catch (e) { console.error(e); try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'error', message: 'Save failed' } })); } catch(e){} }
    finally { setSaving(false); }
  };

  const testSmtp = async () => {
    try {
      await adminService.testSmtp({ host: settings.smtpHost, port: settings.smtpPort, user: settings.smtpUser, pass: settings.smtpPass });
      try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'success', message: 'SMTP test success' } })); } catch(e){}
    } catch (err) { console.error(err); try { window.dispatchEvent(new CustomEvent('admin:toast', { detail: { type: 'error', message: 'SMTP test failed' } })); } catch(e){} }
  };

  if (loading || !settings) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
      <CircularProgress size={48} sx={{ color: '#3b82f6' }} />
      <Typography sx={{ ml: 2, color: '#64748b' }}>Loading settings...</Typography>
    </Box>
  );

  return (
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
            <Settings sx={{ fontSize: 36, color: 'white' }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              System Settings
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Configure app name/logo, language, map provider, backups, and security
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Features Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            height: 'fit-content'
          }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              p: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Settings sx={{ color: '#1e40af' }} />
                Features
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#374151' }}>Enable Dark Mode</Typography>
                  <Switch
                    checked={!!settings.darkMode}
                    onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#3b82f6'
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: '#e2e8f0'
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#3b82f6'
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#374151' }}>Multi-language Support</Typography>
                  <Switch
                    checked={!!settings.multiLanguage}
                    onChange={(e) => setSettings({ ...settings, multiLanguage: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#3b82f6'
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: '#e2e8f0'
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#3b82f6'
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotificationsActive sx={{ color: '#3b82f6', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#374151' }}>Real-time Updates</Typography>
                  </Box>
                  <Switch
                    checked={!!settings.realtimeUpdates}
                    onChange={(e) => setSettings({ ...settings, realtimeUpdates: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#3b82f6'
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: '#e2e8f0'
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#3b82f6'
                      }
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
        
        {/* General Settings Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            height: 'fit-content'
          }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              p: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#166534', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Settings sx={{ color: '#166534' }} />
                General
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="App Name"
                  value={settings.appName || ''}
                  onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      color: '#374151'
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
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
                
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 600, color: '#374151' }}>Default Language</InputLabel>
                  <Select
                    value={settings.defaultLanguage || 'en'}
                    onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px'
                      }
                    }}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                  </Select>
                </FormControl>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>Logo</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                    <Avatar
                      src={settings.logoUrl || undefined}
                      sx={{
                        width: 80,
                        height: 80,
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px'
                      }}
                    >
                      <CloudUpload sx={{ fontSize: 32, color: '#9ca3af' }} />
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <ImageUploader
                        uploadLabel="Upload Logo"
                        onUpload={async (f: File) => {
                          const url = await adminService.uploadSettingAsset(f);
                          setSettings({ ...settings, logoUrl: url });
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#6b7280', mt: 1 }}>
                        Recommended: PNG or SVG, less than 1 MB
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
        
        {/* Map & Location Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            height: 'fit-content'
          }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              p: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Map sx={{ color: '#1d4ed8' }} />
                Map & Location
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 600, color: '#374151' }}>Map Provider</InputLabel>
                  <Select
                    value={settings.mapProvider || 'google'}
                    onChange={(e) => setSettings({ ...settings, mapProvider: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px'
                      }
                    }}
                  >
                    <MenuItem value="google">Google Maps</MenuItem>
                    <MenuItem value="osm">OpenStreetMap</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Map API Key (Optional)"
                  value={settings.mapApiKey || ''}
                  onChange={(e) => setSettings({ ...settings, mapApiKey: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
                        <Key sx={{ color: '#6b7280', fontSize: 20 }} />
                      </Box>
                    ),
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px'
                      }
                    }
                  }}
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      color: '#374151'
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
              </Box>
            </CardContent>
          </Paper>
        </Grid>
        
        {/* Notifications & Integrations Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            height: 'fit-content'
          }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              p: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#d97706', display: 'flex', alignItems: 'center', gap: 2 }}>
                <NotificationsActive sx={{ color: '#d97706' }} />
                Notifications & Integrations
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email sx={{ color: '#3b82f6', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#374151' }}>Email Notifications</Typography>
                  </Box>
                  <Switch
                    checked={!!settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#3b82f6'
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: '#e2e8f0'
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#3b82f6'
                      }
                    }}
                  />
                </Box>
                
                <TextField
                  fullWidth
                  label="Telegram Bot Username"
                  value={settings.telegramBot || ''}
                  onChange={(e) => setSettings({ ...settings, telegramBot: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
                        <Telegram sx={{ color: '#6b7280', fontSize: 20 }} />
                      </Box>
                    ),
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px'
                      }
                    }
                  }}
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      color: '#374151'
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
              </Box>
            </CardContent>
          </Paper>
        </Grid>
        
        {/* SMTP Configuration Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            height: 'fit-content'
          }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%)',
              p: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4338ca', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Email sx={{ color: '#4338ca' }} />
                SMTP Configuration
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="SMTP Host"
                      value={settings.smtpHost || ''}
                      onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontWeight: 600,
                          color: '#374151'
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
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
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="SMTP Port"
                      value={settings.smtpPort || 587}
                      onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value || '0') })}
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontWeight: 600,
                          color: '#374151'
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
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
                  </Grid>
                </Grid>
                
                <TextField
                  fullWidth
                  label="SMTP Username"
                  value={settings.smtpUser || ''}
                  onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      color: '#374151'
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
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
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      type="password"
                      label="SMTP Password"
                      value={settings.smtpPass || ''}
                      onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontWeight: 600,
                          color: '#374151'
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
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
                  </Box>
                  <MuiButton
                    onClick={testSmtp}
                    startIcon={<Refresh />}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: '12px',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                      }
                    }}
                  >
                    Test SMTP
                  </MuiButton>
                </Box>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
        
        {/* Content & Admin Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            height: 'fit-content'
          }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
              p: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Security sx={{ color: '#7c3aed' }} />
                Content & Admin
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonAdd sx={{ color: '#3b82f6', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#374151' }}>User Registration</Typography>
                  </Box>
                  <Switch
                    checked={!!settings.allowRegistration}
                    onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#3b82f6'
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: '#e2e8f0'
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#3b82f6'
                      }
                    }}
                  />
                </Box>
                
                <TextField
                  fullWidth
                  type="number"
                  label="Default Page Size"
                  value={settings.defaultPageSize || 20}
                  onChange={(e) => setSettings({ ...settings, defaultPageSize: parseInt(e.target.value || '0') })}
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      color: '#374151'
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
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
                  type="number"
                  label="Reminder Offset (Minutes)"
                  value={settings.reminderOffsetMinutes || 30}
                  onChange={(e) => setSettings({ ...settings, reminderOffsetMinutes: parseInt(e.target.value || '0') })}
                  helperText="Minutes before announcement end"
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      color: '#374151'
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
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
              </Box>
            </CardContent>
          </Paper>
        </Grid>
        
        {/* Analytics & Ads Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            height: 'fit-content'
          }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              p: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#d97706', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Analytics sx={{ color: '#d97706' }} />
                Analytics & Ads
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Analytics sx={{ color: '#3b82f6', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#374151' }}>Enable Analytics</Typography>
                  </Box>
                  <Switch
                    checked={!!settings.enableAnalytics}
                    onChange={(e) => setSettings({ ...settings, enableAnalytics: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#3b82f6'
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: '#e2e8f0'
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#3b82f6'
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdsClick sx={{ color: '#3b82f6', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#374151' }}>Enable Advertisements</Typography>
                  </Box>
                  <Switch
                    checked={!!settings.enableAds}
                    onChange={(e) => setSettings({ ...settings, enableAds: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#3b82f6'
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: '#e2e8f0'
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#3b82f6'
                      }
                    }}
                  />
                </Box>
                
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                    Analytics — User tracking · Page views · Behavior tracking
                  </Typography>
                </Divider>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrackChanges sx={{ color: '#3b82f6', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>User Tracking</Typography>
                    </Box>
                    <Switch
                      checked={!!settings.userTracking}
                      onChange={(e) => setSettings({ ...settings, userTracking: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#3b82f6'
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor: '#e2e8f0'
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#3b82f6'
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Pageview sx={{ color: '#3b82f6', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>Page Views</Typography>
                    </Box>
                    <Switch
                      checked={!!settings.pageViews}
                      onChange={(e) => setSettings({ ...settings, pageViews: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#3b82f6'
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor: '#e2e8f0'
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#3b82f6'
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Visibility sx={{ color: '#3b82f6', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>Behavior Tracking</Typography>
                    </Box>
                    <Switch
                      checked={!!settings.behaviorTracking}
                      onChange={(e) => setSettings({ ...settings, behaviorTracking: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#3b82f6'
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor: '#e2e8f0'
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#3b82f6'
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <MuiButton
          onClick={load}
          disabled={saving}
          startIcon={<Refresh />}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            fontWeight: 600,
            background: 'rgba(0, 0, 0, 0.05)',
            color: '#64748b',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.1)'
            },
            '&:disabled': {
              opacity: 0.5
            }
          }}
        >
          Reload
        </MuiButton>
        
        <MuiButton
          onClick={save}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Save />}
          sx={{
            px: 4,
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
          {saving ? 'Saving...' : 'Save Settings'}
        </MuiButton>
      </Box>
    </Box>
  );
}
