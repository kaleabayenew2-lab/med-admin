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
  LocalHospital,
  Campaign,
  PriorityHigh,
  Business
} from '@mui/icons-material';
import { listAds, updateAd, createAd, deleteAd } from '../services/ads';
import api from '../services/api';
import { useConfirm } from '../contexts/ConfirmContext';
import ImageUploader from '../components/ImageUploader';

export default function AdsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  async function load() {
    setLoading(true);
    try {
      const data = await listAds();
      setAds(Array.isArray(data) ? data : []);
      // load facilities for picker
      try {
        const fres = await api.get('/api/facilities');
        if (fres && fres.data) setFacilities(Array.isArray(fres.data.facilities) ? fres.data.facilities : []);
      } catch (e) {}
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Failed to load ads', severity: 'error' });
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleActive(a: any) {
    try {
      const updated = await updateAd(a._id, { active: !a.active });
      setAds((prev) => prev.map(x => x._id === a._id ? updated : x));
      setSnackbar({ 
        open: true, 
        message: `Ad ${!a.active ? 'activated' : 'deactivated'} successfully`, 
        severity: 'success' 
      });
    } catch (e) { 
      console.error(e);
      setSnackbar({ open: true, message: 'Failed to update ad status', severity: 'error' });
    }
  }

  const confirm = useConfirm();
  async function remove(a: any) {
    const ok = await confirm({ 
      title: 'Delete ad', 
      message: `Delete ad "${a.title}"? This cannot be undone.`, 
      confirmText: 'Delete', 
      cancelText: 'Cancel', 
      danger: true 
    });
    if (!ok) return;
    try {
      await deleteAd(a._id);
      setAds((prev) => prev.filter(x => x._id !== a._id));
      setSnackbar({ open: true, message: 'Ad deleted successfully', severity: 'success' });
    } catch (e) { 
      console.error(e);
      setSnackbar({ open: true, message: 'Failed to delete ad', severity: 'error' });
    }
  }

  function openEditor(a: any | null) {
    if (!a) {
      setEditing({ title: '', subtitle: '', kind: 'custom', facility: null, image: '', priority: 0, active: true });
    } else {
      setEditing({ ...a });
    }
  }

  async function saveAd() {
    if (!editing) return;
    try {
      setLoading(true);
      let saved;
      if (editing._id) {
        saved = await updateAd(editing._id, editing);
        setAds((prev) => prev.map(x => x._id === saved._id ? saved : x));
        setSnackbar({ open: true, message: 'Ad updated successfully', severity: 'success' });
      } else {
        saved = await createAd(editing);
        setAds((prev) => [saved, ...prev]);
        setSnackbar({ open: true, message: 'Ad created successfully', severity: 'success' });
      }
      setEditing(null);
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Failed to save ad', severity: 'error' });
    }
    setLoading(false);
  }

  const getAdIcon = (kind: string) => {
    switch (kind) {
      case 'facility': return <LocalHospital />;
      case 'campaign': return <Campaign />;
      case 'priority': return <PriorityHigh />;
      default: return <Business />;
    }
  };

  const getAdColor = (kind: string) => {
    switch (kind) {
      case 'facility': return '#ef4444';
      case 'campaign': return '#10b981';
      case 'priority': return '#f59e0b';
      default: return '#3b82f6';
    }
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
              <Campaign sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Advertisement Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Create and manage promotional advertisements
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
              Create Ad
            </Button>
            <Tooltip title="Refresh ads">
              <IconButton 
                onClick={load}
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

      {/* Loading State */}
      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Loading advertisements...
          </Typography>
        </Box>
      )}

      {/* Ads Grid */}
      {!loading && (
        <Fade in={!loading}>
          <Box>
            {ads.length === 0 ? (
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
                  No advertisements yet
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  Create your first advertisement to promote facilities and services
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => openEditor(null)}
                >
                  Create Advertisement
                </Button>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {ads.map((ad) => (
                  <Grid item xs={12} md={6} lg={4} key={ad._id}>
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
                      {ad.image && (
                        <CardMedia
                          component="img"
                          height="160"
                          image={ad.image}
                          alt={ad.title}
                          sx={{ objectFit: 'cover' }}
                        />
                      )}
                      <CardContent sx={{ flex: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: getAdColor(ad.kind),
                            mr: 2,
                            width: 40,
                            height: 40
                          }}>
                            {getAdIcon(ad.kind)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                              {ad.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                              {ad.subtitle}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                              <Chip 
                                label={ad.kind}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip 
                                icon={<PriorityHigh />}
                                label={`Priority: ${ad.priority || 0}`}
                                size="small"
                                color="warning"
                                variant="outlined"
                              />
                              <Chip 
                                icon={ad.active ? <Visibility /> : <VisibilityOff />}
                                label={ad.active ? 'Active' : 'Inactive'}
                                color={ad.active ? 'success' : 'default'}
                                size="small"
                              />
                            </Stack>
                            {ad.facility && (
                              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                                Facility: {facilities.find(f => f._id === ad.facility)?.name || ad.facility}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small"
                              onClick={() => openEditor(ad)}
                              sx={{ 
                                bgcolor: 'success.light',
                                color: 'success.contrastText',
                                '&:hover': { bgcolor: 'success.main' }
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Toggle Active">
                            <IconButton 
                              size="small"
                              onClick={() => toggleActive(ad)}
                              sx={{ 
                                bgcolor: ad.active ? 'warning.light' : 'success.light',
                                color: ad.active ? 'warning.contrastText' : 'success.contrastText',
                                '&:hover': { bgcolor: ad.active ? 'warning.main' : 'success.main' }
                              }}
                            >
                              {ad.active ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small"
                              onClick={() => remove(ad)}
                              sx={{ 
                                bgcolor: 'error.light',
                                color: 'error.contrastText',
                                '&:hover': { bgcolor: 'error.main' }
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>
      )}

      {/* Edit Ad Dialog */}
      <Dialog 
        open={!!editing} 
        onClose={() => setEditing(null)}
        maxWidth="md"
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
              {editing?._id ? 'Edit Advertisement' : 'Create New Advertisement'}
            </Typography>
            <IconButton 
              onClick={() => setEditing(null)}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Title"
              value={editing?.title || ''}
              onChange={e => setEditing({...editing!, title: e.target.value})}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Subtitle"
              value={editing?.subtitle || ''}
              onChange={e => setEditing({...editing!, subtitle: e.target.value})}
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Ad Type</InputLabel>
              <Select
                value={editing?.kind || 'custom'}
                onChange={e => setEditing({...editing!, kind: e.target.value})}
                label="Ad Type"
              >
                <MenuItem value="custom">Custom</MenuItem>
                <MenuItem value="facility">Facility</MenuItem>
                <MenuItem value="campaign">Campaign</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Facility (optional)</InputLabel>
              <Select
                value={editing?.facility || ''}
                onChange={e => setEditing({...editing!, facility: e.target.value || null})}
                label="Facility (optional)"
              >
                <MenuItem value="">-- none --</MenuItem>
                {facilities.map(f => (
                  <MenuItem key={f._id} value={f._id}>
                    {f.name || f._id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Image />
                Advertisement Image
              </Typography>
              <ImageUploader
                accept="image/*"
                maxWidth={1200}
                initialQuality={0.85}
                uploadLabel="Attach image"
                onUpload={async (f)=>{
                  setLoading(true);
                  try {
                    const res = await (await import('../services/uploads')).uploadFile(f as File);
                    setEditing({...editing!, image: res.url || ''});
                  } finally { setLoading(false); }
                }}
              />
              {editing?.image && (
                <Box sx={{ mt: 2 }}>
                  <img 
                    loading="lazy" 
                    decoding="async" 
                    src={editing.image} 
                    alt={editing.title || 'ad preview'} 
                    style={{ width: '100%', maxWidth: 300, height: 200, objectFit: 'cover', borderRadius: 8 }}
                  />
                </Box>
              )}
            </Box>

            <TextField
              fullWidth
              label="Priority"
              type="number"
              value={editing?.priority || 0}
              onChange={e => setEditing({...editing!, priority: parseInt(e.target.value||'0',10)})}
              variant="outlined"
              helperText="Higher numbers show first"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={!!editing?.active}
                  onChange={e=>setEditing({...editing!, active: e.target.checked})}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Visibility fontSize="small" />
                  Active Advertisement
                </Box>
              }
            />

            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Advertisement Preview
              </Typography>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                {editing?.image ? (
                  <img 
                    loading="lazy" 
                    decoding="async" 
                    src={editing.image} 
                    alt={editing.title || 'ad preview small'} 
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                  />
                ) : (
                  <Box sx={{ width: 80, height: 80, bgcolor: 'grey.200', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image sx={{ color: 'grey.400' }} />
                  </Box>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {editing?.title || 'Ad Title'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {editing?.subtitle || 'Ad subtitle'}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip 
                      label={editing?.kind || 'custom'}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip 
                      icon={<PriorityHigh />}
                      label={`Priority: ${editing?.priority || 0}`}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              </Card>
            </Box>
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
            onClick={saveAd}
            disabled={loading}
            sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
          >
            {editing?._id ? 'Update Ad' : 'Create Ad'}
          </Button>
        </DialogActions>
      </Dialog>

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
