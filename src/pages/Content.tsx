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
  Grid,
  Paper,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Publish,
  Schedule,
  PushPin,
  Notifications,
  NotificationsOff,
  Image,
  Article,
  Help,
  Translate,
  Close,
  Save,
  Cancel,
  Refresh,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import adminService from '../services/admin';
import { useConfirm } from '../contexts/ConfirmContext';
import { uploadFile } from '../services/uploads';
import Loading from '../components/Loading';
import ErrorBoundary from '../components/ErrorBoundary';
import ImageUploader from '../components/ImageUploader';

type ContentItem = {
  id: string;
  type: string;
  title: string;
  body?: string;
  language?: string;
  meta?: any;
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
  startAt?: string | null;
  endAt?: string | null;
  imageUrl?: string | null;
  caption?: string | null;
  pinned?: boolean;
  reminderSent?: boolean;
};

export default function Content(){
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getContent();
      setItems(res);
    } catch (e: any) {
      console.error(e);
      setError('Failed to load content');
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const confirm = useConfirm();
  const save = async (item: Partial<ContentItem>) => {
    try {
      if (item.id) {
        await adminService.updateContent(item.id, item);
        setSnackbar({ open: true, message: 'Content updated successfully', severity: 'success' });
      } else {
        await adminService.createContent(item);
        setSnackbar({ open: true, message: 'Content created successfully', severity: 'success' });
      }
      setEditing(null);
      setCreating(false);
      await load();
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Save failed', severity: 'error' });
    }
  };

  const remove = async (id: string) => {
    const ok = await confirm({ title: 'Delete content', message: 'Delete this content item?', confirmText: 'Delete', cancelText: 'Cancel', danger: true });
    if (!ok) return;
    try {
      await adminService.deleteContent(id);
      await load();
      setSnackbar({ open: true, message: 'Content deleted successfully', severity: 'success' });
    } catch (e) { 
      console.error(e); 
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  const clearReminder = async (id: string) => {
    try {
      await adminService.updateContent(id, { reminderSent: false });
      await load();
      setSnackbar({ open: true, message: 'Reminder flag cleared', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to clear reminder', severity: 'error' });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Article />;
      case 'help': return <Help />;
      case 'translation': return <Translate />;
      default: return <Article />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return '#3b82f6';
      case 'help': return '#10b981';
      case 'translation': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <ErrorBoundary>
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
                <Article sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Content Management
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Manage announcements, help articles, and translations
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreating(true)}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                color: 'white'
              }}
            >
              Create Content
            </Button>
          </Box>
        </Paper>

        {/* Loading State */}
        {loading && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Loading content...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Content List */}
        {!loading && !error && (
          <Fade in={!loading && !error}>
            <Box>
              {items.length === 0 ? (
                <Card sx={{ textAlign: 'center', p: 6, borderRadius: 3 }}>
                  <Avatar sx={{ 
                    bgcolor: 'grey.200', 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2 
                  }}>
                    <Article sx={{ fontSize: 40, color: 'grey.400' }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                    No content items yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Create your first announcement, help article, or translation
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setCreating(true)}
                  >
                    Create Content
                  </Button>
                </Card>
              ) : (
                <Grid container spacing={3}>
                  {items.map((item) => (
                    <Grid item xs={12} md={6} lg={4} key={item.id}>
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
                        {item.imageUrl && (
                          <CardMedia
                            component="img"
                            height="160"
                            image={item.imageUrl}
                            alt={item.caption || item.title}
                            sx={{ objectFit: 'cover' }}
                          />
                        )}
                        <CardContent sx={{ flex: 1, p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <Avatar sx={{ 
                              bgcolor: getTypeColor(item.type),
                              mr: 2,
                              width: 40,
                              height: 40
                            }}>
                              {getTypeIcon(item.type)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                {item.title}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                {item.type} / {item.language}
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                {item.published ? (
                                  <Chip 
                                    icon={<Visibility />}
                                    label="Published"
                                    color="success"
                                    size="small"
                                  />
                                ) : (
                                  <Chip 
                                    icon={<VisibilityOff />}
                                    label="Draft"
                                    color="default"
                                    size="small"
                                  />
                                )}
                                {item.pinned && (
                                  <Chip 
                                    icon={<PushPin />}
                                    label="Pinned"
                                    color="primary"
                                    size="small"
                                  />
                                )}
                                {item.startAt && new Date(item.startAt) > new Date() && (
                                  <Chip 
                                    icon={<Schedule />}
                                    label="Scheduled"
                                    color="warning"
                                    size="small"
                                  />
                                )}
                                {item.reminderSent && (
                                  <Chip 
                                    icon={<Notifications />}
                                    label="Reminder Sent"
                                    color="error"
                                    size="small"
                                  />
                                )}
                              </Stack>
                            </Box>
                          </Box>
                          
                          {item.body && (
                            <Typography variant="body2" sx={{ 
                              color: 'text.secondary',
                              mb: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {item.body.length > 150 ? item.body.slice(0, 150) + '...' : item.body}
                            </Typography>
                          )}
                          
                          <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
                            Updated: {item.updatedAt || item.createdAt || '—'}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small"
                                onClick={() => setEditing(item)}
                                sx={{ 
                                  bgcolor: 'success.light',
                                  color: 'success.contrastText',
                                  '&:hover': { bgcolor: 'success.main' }
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small"
                                onClick={() => remove(item.id)}
                                sx={{ 
                                  bgcolor: 'error.light',
                                  color: 'error.contrastText',
                                  '&:hover': { bgcolor: 'error.main' }
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {item.reminderSent && (
                              <Tooltip title="Clear Reminder">
                                <IconButton 
                                  size="small"
                                  onClick={() => clearReminder(item.id)}
                                  sx={{ 
                                    bgcolor: 'warning.light',
                                    color: 'warning.contrastText',
                                    '&:hover': { bgcolor: 'warning.main' }
                                  }}
                                >
                                  <NotificationsOff fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
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

        {/* Create/Edit Dialog */}
        <Dialog 
          open={creating || !!editing} 
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
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
                {editing ? 'Edit Content' : 'Create New Content'}
              </Typography>
              <IconButton 
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
                sx={{ color: 'white' }}
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <ContentForm 
              initial={editing || { 
                type: 'announcement', 
                title: '', 
                body: '', 
                language: 'en', 
                published: false, 
                startAt: null, 
                endAt: null, 
                imageUrl: null, 
                caption: null, 
                pinned: false, 
                reminderSent: false 
              }} 
              onCancel={() => {
                setCreating(false);
                setEditing(null);
              }} 
              onSave={save} 
            />
          </DialogContent>
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
    </ErrorBoundary>
  );
}

function ContentForm({ initial, onCancel, onSave }: { initial: any; onCancel: ()=>void; onSave: (item: any)=>void }){
  const [item, setItem] = useState(initial);
  useEffect(()=>{ setItem(initial); }, [initial]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <FormControl fullWidth>
        <InputLabel>Content Type</InputLabel>
        <Select
          value={item.type}
          onChange={(e)=>setItem({...item, type: e.target.value})}
          label="Content Type"
        >
          <MenuItem value="announcement">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Article sx={{ fontSize: 20, color: '#3b82f6' }} />
              Announcement
            </Box>
          </MenuItem>
          <MenuItem value="help">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Help sx={{ fontSize: 20, color: '#10b981' }} />
              Help Article
            </Box>
          </MenuItem>
          <MenuItem value="translation">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Translate sx={{ fontSize: 20, color: '#f59e0b' }} />
              Translation
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Title"
        value={item.title}
        onChange={(e)=>setItem({...item, title: e.target.value})}
        variant="outlined"
      />

      <TextField
        fullWidth
        label="Language"
        value={item.language}
        onChange={(e)=>setItem({...item, language: e.target.value})}
        variant="outlined"
      />

      <TextField
        fullWidth
        label="Content Body"
        value={item.body}
        onChange={(e)=>setItem({...item, body: e.target.value})}
        multiline
        rows={6}
        variant="outlined"
      />

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Image />
          Image (optional)
        </Typography>
        <ImageUploader
          accept="image/*"
          maxWidth={1200}
          initialQuality={0.85}
          uploadLabel="Attach image"
          onUpload={async (f)=>{
            try {
              const res = await uploadFile(f as File);
              setItem({...item, imageUrl: res.url});
            } catch (err) { 
              console.error('upload failed', err);
            }
          }}
        />
        {item.imageUrl && (
          <Box sx={{ mt: 2 }}>
            <img 
              loading="lazy" 
              decoding="async" 
              src={item.imageUrl} 
              alt={item.caption || item.title || 'content preview'} 
              style={{ width: '100%', maxWidth: 300, height: 200, objectFit: 'cover', borderRadius: 8 }}
            />
          </Box>
        )}
      </Box>

      <TextField
        fullWidth
        label="Image Caption (optional)"
        value={item.caption || ''}
        onChange={(e)=>setItem({...item, caption: e.target.value || null})}
        variant="outlined"
      />

      <FormControlLabel
        control={
          <Switch
            checked={!!item.pinned}
            onChange={(e)=>setItem({...item, pinned: e.target.checked})}
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PushPin fontSize="small" />
            Pin to top
          </Box>
        }
      />

      <TextField
        fullWidth
        label="Display Start (optional)"
        type="datetime-local"
        value={item.startAt || ''}
        onChange={(e)=>setItem({...item, startAt: e.target.value || null})}
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        label="Display End (optional)"
        type="datetime-local"
        value={item.endAt || ''}
        onChange={(e)=>setItem({...item, endAt: e.target.value || null})}
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={!!item.published}
            onChange={(e)=>setItem({...item, published: e.target.checked})}
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Publish fontSize="small" />
            Published
          </Box>
        }
      />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Cancel />}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={() => onSave(item)}
          sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
