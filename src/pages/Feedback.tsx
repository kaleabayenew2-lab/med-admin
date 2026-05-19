import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Avatar,
  Snackbar,
  Alert,
  Fade,
  Paper,
  Tooltip,
  Stack,
  Grid,
  Divider,
  TextField,
  Fab
} from '@mui/material';
import {
  Feedback as FeedbackIcon,
  Person,
  Email,
  AttachFile,
  Reply,
  Send,
  Refresh,
  CheckCircle,
  Schedule,
  Close,
  Star,
  Message,
  AccessTime
} from '@mui/icons-material';
import api from '../services/api';
import { API_BASE } from '../services/api';

let feedbackSse: EventSource | null = null;

type FeedbackItem = {
  id: string;
  name?: string;
  email?: string;
  message: string;
  createdAt: string;
  sourceIp?: string;
  replied?: boolean;
  reply?: string | null;
  replyMethod?: string | null;
  repliedAt?: string | null;
  attachments?: Array<{ url?: string; filename?: string; type?: string } | string>;
};

export default function Feedback() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [replying, setReplying] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/feedback');
      if (res.data && res.data.feedbacks) setItems(res.data.feedbacks);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load feedback', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    try {
      const esUrl = `${API_BASE.replace(/\/$/, '')}/api/notifications/stream`;
      const es = new EventSource(esUrl);
      es.addEventListener('notification', (ev: any) => {
        try {
          const data = JSON.parse(ev.data);
          // if this is a feedback-originated notification, add to list
          if (data && (data.type === 'feedback' || data.type === 'feedback_submission') && data.feedbackId) {
            const fb: FeedbackItem = {
              id: String(data.feedbackId),
              name: data.fromName || undefined,
              email: undefined,
              message: data.text || data.message || '',
              createdAt: data.createdAt || new Date().toISOString(),
              sourceIp: undefined,
              replied: false,
              reply: null,
              replyMethod: null,
              repliedAt: null,
              attachments: data.attachments || [],
            };
            setItems(prev => [fb, ...prev]);
            setSnackbar({ open: true, message: 'New feedback received', severity: 'info' });
          }
        } catch (e) { /* ignore */ }
      });
      feedbackSse = es;
    } catch (e) { console.warn('Feedback SSE not available', e); }
    return () => { try { if (feedbackSse) feedbackSse.close(); } catch(e){} };
  }, []);

  const sendReply = async (id: string) => {
    const text = (replyText[id] || '').trim();
    if (!text) return;
    setReplying(prev => ({ ...prev, [id]: true }));
    try {
      const res = await api.post(`/api/feedback/${id}/reply`, { reply: text, method: 'admin:ui' });
      if (res.data && res.data.entry) {
        setItems(prev => prev.map(it => (it.id === id ? res.data.entry : it)));
        setReplyText(prev => ({ ...prev, [id]: '' }));
        setSnackbar({ open: true, message: 'Reply sent successfully', severity: 'success' });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to send reply', severity: 'error' });
    } finally {
      setReplying(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      p: { xs: 1.5, sm: 3 }
    }}>
      {/* Header */}
      <Paper sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
        color: 'white',
        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
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
              <FeedbackIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold', 
                mb: 0.5,
                fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.125rem' }
              }}>
                Feedback & Reviews
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
                View and respond to user feedback from the mobile app
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
            <Chip 
              icon={<Message />}
              label={`${items.length} feedback items`}
              color="default"
              variant="outlined"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                color: 'white',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
            <Tooltip title="Refresh feedback">
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
            Loading feedback...
          </Typography>
        </Box>
      )}

      {/* Feedback List */}
      {!loading && (
        <Fade in={!loading}>
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
                  <FeedbackIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                </Avatar>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                  No feedback yet
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  Feedback from users will appear here when they submit it through the mobile app
                </Typography>
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
                      <CardContent sx={{ flex: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: item.replied ? '#10b981' : '#3b82f6',
                            mr: 2,
                            width: 40,
                            height: 40
                          }}>
                            {item.replied ? <CheckCircle /> : <Person />}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                              {item.name || item.email || 'Anonymous'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {new Date(item.createdAt).toLocaleString()}
                              </Typography>
                            </Box>
                            <Stack direction="row" spacing={1}>
                              <Chip 
                                icon={item.replied ? <CheckCircle /> : <Schedule />}
                                label={item.replied ? 'Replied' : 'Pending'}
                                color={item.replied ? 'success' : 'warning'}
                                size="small"
                              />
                              {item.sourceIp && (
                                <Chip 
                                  label={`IP: ${item.sourceIp}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" sx={{ 
                          color: 'text.secondary',
                          mb: 2,
                          whiteSpace: 'pre-wrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {item.message}
                        </Typography>

                        {item.attachments && item.attachments.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                              Attachments:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {item.attachments.map((a: any, i: number) => (
                                <Chip
                                  key={i}
                                  icon={<AttachFile />}
                                  label={a.filename || a.url || 'attachment'}
                                  size="small"
                                  component="a"
                                  href={a.url || a}
                                  target="_blank"
                                  rel="noreferrer"
                                  clickable
                                  sx={{ textDecoration: 'none' }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}

                        {item.replied ? (
                          <Box sx={{ 
                            bgcolor: 'success.light', 
                            p: 2, 
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'success.main'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <CheckCircle sx={{ fontSize: 16, color: 'success.dark' }} />
                              <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                                Replied ({item.replyMethod})
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: 'text.primary', mb: 1 }}>
                              {item.reply}
                            </Typography>
                            {item.repliedAt && (
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {new Date(item.repliedAt).toLocaleString()}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                            <TextField
                              fullWidth
                              multiline
                              maxRows={3}
                              placeholder="Write a reply..."
                              value={replyText[item.id] || ''}
                              onChange={e => setReplyText(prev => ({ ...prev, [item.id]: e.target.value }))}
                              variant="outlined"
                              size="small"
                            />
                            <Fab
                              size="small"
                              color="primary"
                              onClick={() => sendReply(item.id)}
                              disabled={!!replying[item.id]}
                              sx={{ ml: 1 }}
                            >
                              {replying[item.id] ? <Refresh sx={{ animation: 'spin 1s linear infinite' }} /> : <Send />}
                            </Fab>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>
      )}

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
