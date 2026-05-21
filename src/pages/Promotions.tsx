import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Fade,
  Paper,
  Tooltip,
  Stack,
  Grid,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Close,
  Save,
  Cancel,
  Refresh,
  Image,
  Campaign,
  Link,
  Info
} from '@mui/icons-material';
import api from '../services/api';
import ImageUploader from '../components/ImageUploader';

const BACKEND_HOST = import.meta.env.VITE_API_BASE || 'https://med-backend-0lw3.onrender.com';

function getPromotionImageUrl(imageUrl: any) {
  if (!imageUrl) return '/assets/images/logo.png';
  if (typeof imageUrl !== 'string') return '/assets/images/logo.png';
  const normalized = imageUrl.trim();
  if (normalized.startsWith('assets/')) {
    return normalized;
  }

  const rewriteDevHost = (urlString: string) => {
    try {
      const parsed = new URL(urlString);
      const path = parsed.pathname.replace(/^\/+/, '');
      if (path.startsWith('uploads/')) {
        return `${BACKEND_HOST}/${path}`;
      }
      return `${BACKEND_HOST}/${path}`;
    } catch {
      return `${BACKEND_HOST}/uploads/${encodeURIComponent(urlString.replace(/^\/+/, ''))}`;
    }
  };

  if (normalized.startsWith('http://localhost') ||
      normalized.startsWith('http://127.0.0.1') ||
      normalized.startsWith('http://10.0.2.2')) {
    return rewriteDevHost(normalized);
  }

  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    try {
      const parsed = new URL(normalized);
      const path = parsed.pathname.replace(/^\/+/, '');
      if (path.startsWith('uploads/')) {
        return `${BACKEND_HOST}/${path}`;
      }
      return normalized;
    } catch {
      return normalized;
    }
  }

  const cleanPath = normalized.replace(/^\/+/, '');
  if (cleanPath.startsWith('uploads/')) {
    return `${BACKEND_HOST}/${cleanPath}`;
  }
  return `${BACKEND_HOST}/uploads/${encodeURIComponent(cleanPath)}`;
}

function getPromotionImageFilename(imageUrl: any) {
  if (!imageUrl || typeof imageUrl !== 'string') return '';
  const normalized = imageUrl.trim();
  if (normalized.startsWith('/uploads/') || normalized.startsWith('uploads/')) {
    return normalized.split('/').pop() || normalized;
  }
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    try {
      const url = new URL(normalized);
      const pathname = url.pathname || '';
      return pathname.split('/').pop() || normalized;
    } catch {
      return normalized;
    }
  }
  return normalized;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/promotions');
      if (res.data && res.data.success) {
        setPromotions(Array.isArray(res.data.promotions) ? res.data.promotions : []);
      }
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Failed to load promotions from SQLite database', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const toggleActive = async (p: any) => {
    try {
      const updatedActive = !p.active;
      const res = await api.put(`/api/promotions/${p.id}`, { active: updatedActive });
      if (res.data && res.data.success) {
        setPromotions(prev => prev.map(x => x.id === p.id ? res.data.promotion : x));
        setSnackbar({ 
          open: true, 
          message: `Promotion ${updatedActive ? 'activated' : 'deactivated'} successfully`, 
          severity: 'success' 
        });
      }
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Failed to update promotion state', severity: 'error' });
    }
  };

  const removePromotion = async (p: any) => {
    if (!window.confirm(`Delete promotion "${p.title}"? This cannot be undone.`)) return;
    try {
      const res = await api.delete(`/api/promotions/${p.id}`);
      if (res.data && res.data.success) {
        setPromotions(prev => prev.filter(x => x.id !== p.id));
        setSnackbar({ open: true, message: 'Promotion deleted successfully from database', severity: 'success' });
      }
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Failed to delete promotion', severity: 'error' });
    }
  };

  const openEditor = (p: any | null) => {
    if (!p) {
      setEditing({
        title: '',
        subtitle: '',
        imageUrl: 'assets/images/logo.png',
        buttonText: 'Learn More',
        linkUrl: '',
        active: true
      });
    } else {
      setEditing({ ...p, active: p.active === 1 || p.active === true });
    }
  };

  const savePromotion = async () => {
    if (!editing || !editing.title) {
      setSnackbar({ open: true, message: 'Title is required', severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      let res;
      if (editing.id) {
        res = await api.put(`/api/promotions/${editing.id}`, editing);
        if (res.data && res.data.success) {
          setPromotions(prev => prev.map(x => x.id === editing.id ? res.data.promotion : x));
          setSnackbar({ open: true, message: 'Promotion updated successfully in SQLite', severity: 'success' });
          setEditing(null);
        }
      } else {
        res = await api.post('/api/promotions', editing);
        if (res.data && res.data.success) {
          setPromotions(prev => [res.data.promotion, ...prev]);
          setSnackbar({ open: true, message: 'Promotion created and published successfully', severity: 'success' });
          setEditing(null);
        }
      }
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Failed to save promotion', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      p: { xs: 1.5, sm: 3 }
    }}>
      {/* Header Banner */}
      <Paper sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
        color: 'white',
        boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)',
        mb: { xs: 2, sm: 4 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: { xs: 'flex-start', md: 'center' }, 
          justifyContent: 'space-between',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)', 
              mr: { xs: 1.5, sm: 2 },
              width: { xs: 44, sm: 56 },
              height: { xs: 44, sm: 56 }
            }}>
              <Campaign sx={{ fontSize: { xs: 24, sm: 32 } }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold', 
                mb: 0.5,
                fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.125rem' }
              }}>
                Promotions Manager
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
                Manage home page sliders and advertisements on the mobile application in real time.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            width: { xs: '100%', md: 'auto' },
            justifyContent: { xs: 'space-between', md: 'flex-end' }
          }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openEditor(null)}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                color: 'white'
              }}
            >
              Add Promotion
            </Button>
            <Tooltip title="Refresh promotions">
              <IconButton 
                onClick={loadPromotions}
                disabled={loading}
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                  color: 'white'
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Loading Progress */}
      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress sx={{ height: 6, borderRadius: 3 }} />
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Synchronizing with SQLite database...
          </Typography>
        </Box>
      )}

      {/* Promotions List Grid */}
      {!loading && (
        <Fade in={!loading}>
          <Box>
            {promotions.length === 0 ? (
              <Card sx={{ textAlign: 'center', p: 6, borderRadius: 3 }}>
                <Avatar sx={{ 
                  bgcolor: 'grey.200', 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 2 
                }}>
                  <Campaign sx={{ fontSize: 40, color: 'grey.400' }} />
                </Avatar>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                  No active promotions found
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  Create a dynamic promotion to display it in real time on the mobile Home page slider!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => openEditor(null)}
                >
                  Create Your First Promotion
                </Button>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {promotions.map((p) => {
                  const displayImage = getPromotionImageUrl(p.imageUrl);

                  return (
                    <Grid item xs={12} md={6} lg={4} key={p.id}>
                      <Card sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                        }
                      }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={displayImage}
                          alt={p.title}
                          sx={{ 
                            objectFit: 'cover',
                            background: 'grey.100'
                          }}
                          onError={(e: any) => {
                            e.target.src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {p.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flexGrow: 1 }}>
                            {p.subtitle || 'No subtitle provided.'}
                          </Typography>

                          <Divider sx={{ my: 2 }} />

                          <Stack spacing={1} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Info fontSize="small" color="action" />
                              <Typography variant="caption" color="textSecondary">
                                Button: <strong>{p.buttonText}</strong>
                              </Typography>
                            </Box>
                            {p.linkUrl && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Link fontSize="small" color="action" />
                                <Typography variant="caption" color="textSecondary" noWrap>
                                  Link: <strong>{p.linkUrl}</strong>
                                </Typography>
                              </Box>
                            )}
                          </Stack>

                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                            <Chip 
                              icon={p.active ? <Visibility /> : <VisibilityOff />}
                              label={p.active ? 'Active' : 'Inactive'}
                              color={p.active ? 'success' : 'default'}
                              size="small"
                            />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small"
                                  onClick={() => openEditor(p)}
                                  color="primary"
                                  sx={{ bgcolor: 'primary.light', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Toggle Active">
                                <IconButton 
                                  size="small"
                                  onClick={() => toggleActive(p)}
                                  color="warning"
                                  sx={{ bgcolor: 'warning.light', color: 'white', '&:hover': { bgcolor: 'warning.main' } }}
                                >
                                  {p.active ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small"
                                  onClick={() => removePromotion(p)}
                                  color="error"
                                  sx={{ bgcolor: 'error.light', color: 'white', '&:hover': { bgcolor: 'error.main' } }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        </Fade>
      )}

      {/* Edit/Create Promotion Dialog */}
      <Dialog 
        open={!!editing} 
        onClose={() => setEditing(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
          color: 'white',
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {editing?.id ? 'Edit Promotion Campaign' : 'Create New Promotion Slide'}
            </Typography>
            <IconButton 
              onClick={() => setEditing(null)}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              fullWidth
              label="Promotion Title"
              placeholder="e.g. Find Best Doctors"
              value={editing?.title || ''}
              onChange={e => setEditing({...editing!, title: e.target.value})}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Subtitle / Description"
              placeholder="e.g. Connect with top medical professionals in your area"
              value={editing?.subtitle || ''}
              onChange={e => setEditing({...editing!, subtitle: e.target.value})}
              variant="outlined"
              multiline
              rows={2}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Button Text"
                  placeholder="e.g. Search Now"
                  value={editing?.buttonText || ''}
                  onChange={e => setEditing({...editing!, buttonText: e.target.value})}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="target-link-label">Target Action Page</InputLabel>
                  <Select
                    labelId="target-link-label"
                    label="Target Action Page"
                    value={editing?.linkUrl || ''}
                    onChange={e => setEditing({...editing!, linkUrl: e.target.value})}
                  >
                    <MenuItem value=""><em>None (No redirection)</em></MenuItem>
                    <MenuItem value="/">Home Page</MenuItem>
                    <MenuItem value="/emergency">Emergency Services</MenuItem>
                    <MenuItem value="/booking">Booking Management</MenuItem>
                    <MenuItem value="/history">History / Activity Logs</MenuItem>
                    <MenuItem value="/favorites">Favorites</MenuItem>
                    <MenuItem value="/profile">User Profile</MenuItem>
                    <MenuItem value="/setting">Settings</MenuItem>
                    <MenuItem value="/agent">Agent Panel</MenuItem>
                    <MenuItem value="/about">About Us</MenuItem>
                    <MenuItem value="/privacy">Privacy Policy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Image />
                Promotion Background Image
              </Typography>
              <ImageUploader
                accept="image/*"
                maxWidth={1200}
                initialQuality={0.85}
                uploadLabel="Upload background cover"
                onUpload={async (f)=>{
                  setLoading(true);
                  try {
                    const res = await (await import('../services/uploads')).uploadFile(f as File);
                    const filename = res.filename || getPromotionImageFilename(res.url);
                    setEditing({...editing!, imageUrl: filename});
                  } catch (e) {
                    console.error('Upload failed:', e);
                    setSnackbar({ open: true, message: 'Failed to upload background image', severity: 'error' });
                  } finally { setLoading(false); }
                }}
              />
              {editing?.imageUrl && (
                <Box sx={{ mt: 2 }}>
                  <img 
                    loading="lazy" 
                    decoding="async" 
                    src={getPromotionImageUrl(editing.imageUrl)} 
                    alt="promo preview" 
                    style={{ width: '100%', maxWidth: 350, height: 180, objectFit: 'cover', borderRadius: 12, border: '1px solid #ddd' }}
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </Box>
              )}
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={!!editing?.active}
                  onChange={e => setEditing({...editing!, active: e.target.checked})}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Visibility fontSize="small" />
                  Publish Promotion (Visible immediately in Mobile App)
                </Box>
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={() => setEditing(null)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={savePromotion}
            disabled={loading}
            sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}
          >
            {editing?.id ? 'Update Promotion' : 'Publish Promotion'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alert */}
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
