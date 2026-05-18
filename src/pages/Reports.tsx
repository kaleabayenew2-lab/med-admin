import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
  Fade,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  People,
  PhoneAndroid,
  Person,
  Security,
  Feedback,
  LocalHospital,
  TrendingUp,
  Star,
  Visibility,
  Refresh,
  Download,
  Assessment,
  Analytics,
  Timeline
} from '@mui/icons-material';
import adminService from '../services/admin';
import Loading from '../components/Loading';
import ErrorBoundary from '../components/ErrorBoundary';
import BackendError from '../components/BackendError';
import NoDataFound from '../components/NoDataFound';

type Stats = {
  total_users: number;
  app_users: number;
  profile_creators: number;
  agent_logins: number;
  feedbacks_sent: number;
  total_served: number;
};

export default function Reports() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostViewed, setMostViewed] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await adminService.getStats();
      setStats(s as Stats);
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.error || 'Failed to load reports');
    } finally { 
      setLoading(false); 
    }
  };

  const loadLists = async () => {
    try {
      const mv = await adminService.getMostViewed(20);
      const tr = await adminService.getTopRated(20);
      setMostViewed(mv || []);
      setTopRated(tr || []);
    } catch (e) {
      console.error('Failed to load lists', e);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
      await loadLists();
      setSnackbar({ open: true, message: 'Reports refreshed successfully', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to refresh reports', severity: 'error' });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { loadLists(); }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_users ?? 0,
      icon: People,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      subtitle: 'All registered users'
    },
    {
      title: 'App Users',
      value: stats?.app_users ?? 0,
      icon: PhoneAndroid,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      subtitle: 'Mobile application users'
    },
    {
      title: 'Profile Creators',
      value: stats?.profile_creators ?? 0,
      icon: Person,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      subtitle: 'Users with complete profiles'
    },
    {
      title: 'Agent Logins',
      value: stats?.agent_logins ?? 0,
      icon: Security,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      subtitle: 'Agent authentication events'
    },
    {
      title: 'Feedbacks Sent',
      value: stats?.feedbacks_sent ?? 0,
      icon: Feedback,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      subtitle: 'User feedback submissions'
    },
    {
      title: 'Total Served',
      value: stats?.total_served ?? 0,
      icon: LocalHospital,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      subtitle: 'Patients served'
    }
  ];

  return (
    <ErrorBoundary>
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        p: 3
      }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            color: 'white',
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  mr: 2,
                  width: 56,
                  height: 56
                }}>
                  <Assessment sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    Analytics Dashboard
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Comprehensive system statistics and performance metrics
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Refresh Data">
                  <IconButton 
                    onClick={handleRefresh}
                    disabled={refreshing}
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.2)', 
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                      color: 'white'
                    }}
                  >
                    {refreshing ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export Report">
                  <IconButton 
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.2)', 
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                      color: 'white'
                    }}
                  >
                    <Download />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Loading analytics data...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (() => {
          const isNetworkError = error.includes('Network Error') || error.includes('ERR_NETWORK') || error.includes('timeout');
          if (isNetworkError) {
            return (
              <BackendError 
                onRetry={() => {
                  setLoading(true);
                  setError(null);
                  load();
                }}
                isRetrying={false}
                error={error}
              />
            );
          }
          return (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          );
        })()}

        {/* Stats Cards */}
        {!loading && !error && (
          <Fade in={!loading && !error}>
            <Box>
              <Grid container spacing={3}>
                {statCards.map((card, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ 
                      height: '100%',
                      background: 'white',
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: card.color,
                            mr: 2,
                            width: 48,
                            height: 48
                          }}>
                            <card.icon sx={{ fontSize: 24 }} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                              {card.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {card.subtitle}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="h3" sx={{ 
                          fontWeight: 'bold', 
                          color: card.color,
                          mb: 1
                        }}>
                          {card.value.toLocaleString()}
                        </Typography>
                        <Box sx={{ 
                          height: 4, 
                          bgcolor: 'grey.200', 
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{ 
                            height: '100%', 
                            width: `${Math.min((card.value / (Math.max(...statCards.map(s => s.value)) || 1)) * 100, 100)}%`,
                            background: card.gradient,
                            borderRadius: 2
                          }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}

        {/* Most Viewed Facilities */}
        {!loading && !error && (
          <Fade in={!loading && !error}>
            <Box sx={{ mt: 4 }}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#f59e0b', mr: 2 }}>
                      <Visibility />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Most Viewed Facilities
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Top facilities by user engagement
                      </Typography>
                    </Box>
                    <Chip 
                      icon={<TrendingUp />}
                      label={`${mostViewed.length} facilities`}
                      color="warning"
                      variant="outlined"
                    />
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Facility Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Total Views
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Average Rating
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Performance
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mostViewed.map((facility, index) => (
                          <TableRow key={facility._id || facility.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: '#3b82f6', mr: 2, width: 32, height: 32 }}>
                                  {index + 1}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {facility.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Visibility sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                                <Typography variant="body2">
                                  {facility.viewsTotal ?? 0}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Star sx={{ mr: 1, color: '#f59e0b', fontSize: 16 }} />
                                <Typography variant="body2">
                                  {facility.averageRating?.toFixed(1) || '—'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ 
                                  width: 60, 
                                  height: 6, 
                                  bgcolor: 'grey.200', 
                                  borderRadius: 3,
                                  mr: 1,
                                  overflow: 'hidden'
                                }}>
                                  <Box sx={{ 
                                    height: '100%', 
                                    width: `${((facility.viewsTotal || 0) / (Math.max(...mostViewed.map(f => f.viewsTotal || 0)) || 1)) * 100}%`,
                                    bgcolor: '#f59e0b',
                                    borderRadius: 3
                                  }} />
                                </Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {Math.round(((facility.viewsTotal || 0) / (Math.max(...mostViewed.map(f => f.viewsTotal || 0)) || 1)) * 100)}%
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        )}

        {/* Top Rated Facilities */}
        {!loading && !error && (
          <Fade in={!loading && !error}>
            <Box sx={{ mt: 4 }}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#10b981', mr: 2 }}>
                      <Star />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Top Rated Facilities
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Highest-rated facilities by user feedback
                      </Typography>
                    </Box>
                    <Chip 
                      icon={<Star />}
                      label={`${topRated.length} facilities`}
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Facility Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Average Rating
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Total Ratings
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Rating Distribution
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topRated.map((facility, index) => (
                          <TableRow key={facility._id || facility.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: '#10b981', mr: 2, width: 32, height: 32 }}>
                                  {index + 1}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {facility.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Star sx={{ mr: 1, color: '#f59e0b', fontSize: 16 }} />
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {facility.averageRating?.toFixed(1) || '—'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2">
                                  {facility.ratingCount || 0} reviews
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star}
                                    sx={{ 
                                      fontSize: 16,
                                      color: star <= (facility.averageRating || 0) ? '#f59e0b' : 'grey.300'
                                    }}
                                  />
                                ))}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        )}

        {/* Info Card */}
        {!loading && !error && (
          <Fade in={!loading && !error}>
            <Box sx={{ mt: 4 }}>
              <Card sx={{ borderRadius: 3, bgcolor: 'grey.50' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Analytics sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Data Source Information
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    These analytics are sourced from the backend statistics endpoint. 
                    If any counts appear as zero or missing, ensure the backend service is running 
                    and the <code>/api/admin/stats</code> endpoint is accessible. 
                    Data is updated in real-time and reflects current system activity.
                  </Typography>
                </CardContent>
              </Card>
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
    </ErrorBoundary>
  );
}
