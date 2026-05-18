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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Fade,
  Paper,
  Tooltip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  People,
  Refresh,
  Edit,
  Delete,
  LockReset,
  Telegram,
  Person,
  Email,
  Phone,
  Security,
  Close,
  Save,
  Cancel,
  Search,
  FilterList,
  Visibility,
  VisibilityOff,
  Add
} from '@mui/icons-material';
import UsersTable from '../components/UsersTable';
import usersService, { AdminUser } from '../services/users';
import { useConfirm } from '../contexts/ConfirmContext';

export default function Users(){
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showOnlyTelegram, setShowOnlyTelegram] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [editingErrors, setEditingErrors] = useState<Record<string,string>>({});
  const [creating, setCreating] = useState<any | null>(null);
  const [createErrors, setCreateErrors] = useState<Record<string,string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const confirm = useConfirm();
  const load = async () => {
    setLoading(true);
    try {
      const list = await usersService.getUsers();
      setUsers(list);
    } catch (e) {
      console.error(e);
      setSnackbar({ open: true, message: 'Failed to load users', severity: 'error' });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (u: AdminUser) => {
    setEditing(u);
    setEditingErrors({});
  };

  const handleSave = async (updated: AdminUser) => {
    // validate
    try {
      const { validateUserInput } = await import('../utils/validators');
      const v = validateUserInput(updated);
      if (Object.keys(v).length > 0) { setEditingErrors(v); return; }
    } catch (e) {}

    try {
      console.log('🔄 Updating user:', updated.email);
      console.log('📋 User object:', updated);
      const userId = updated.id || updated._id; // Use id first, fallback to _id
      console.log('🆔 User ID:', userId);
      
      const updateData = { 
        fullName: updated.fullName, 
        email: updated.email, 
        phone: updated.phone, 
        roles: updated.roles, 
        isActive: updated.isActive 
      };
      console.log('📤 Update data:', updateData);
      
      if (!userId) {
        throw new Error('User ID is missing');
      }
      
      await usersService.updateUser(userId, updateData);
      console.log('✅ User updated successfully');
      
      setEditing(null);
      setEditingErrors({});
      await load();
      setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
    } catch (e: any) {
      console.error('❌ User update failed:', e);
      setSnackbar({ 
        open: true, 
        message: (e && e.response && e.response.data && e.response.data.message) || 'Save failed', 
        severity: 'error' 
      });
    }
  };

  const handleReset = async (u: AdminUser) => {
    const ok = await confirm({ 
      title: 'Reset password', 
      message: `Reset password for ${u.fullName || u.email}? A temporary password will be generated and displayed.`, 
      confirmText: 'Reset', 
      cancelText: 'Cancel', 
      danger: true 
    });
    if (!ok) return;
    try {
      console.log('🔄 Resetting password for user:', u.email);
      const userId = u.id || u._id; // Use id first, fallback to _id
      console.log('🆔 User ID:', userId);
      
      if (!userId) {
        throw new Error('User ID is missing');
      }
      
      const res = await usersService.resetPassword(userId);
      console.log('✅ Password reset response:', res);
      
      if (res && res.password) {
        // Display the user's email and the temporary password
        const message = `Password reset for ${u.email}\n\nTemporary Password: ${res.password}\n\nThis password will expire in 1 minute.`;
        setSnackbar({ 
          open: true, 
          message: message, 
          severity: 'info',
          autoHideDuration: 10000 // Keep open for 10 seconds
        });
      } else {
        setSnackbar({ open: true, message: 'Password reset failed', severity: 'error' });
      }
    } catch (e: any) {
      console.error('❌ Password reset failed:', e);
      setSnackbar({ 
        open: true, 
        message: (e && e.response && e.response.data && e.response.data.message) || 'Reset failed', 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async (u: AdminUser) => {
    const ok2 = await confirm({ 
      title: 'Delete user', 
      message: `Delete user ${u.fullName || u.email}? This cannot be undone.`, 
      confirmText: 'Delete', 
      cancelText: 'Cancel', 
      danger: true 
    });
    if (!ok2) return;
    try {
      console.log('🔄 Deleting user:', u.email);
      const userId = u.id || u._id; // Use id first, fallback to _id
      console.log('🆔 User ID:', userId);
      
      if (!userId) {
        throw new Error('User ID is missing');
      }
      
      await usersService.deleteUser(userId);
      console.log('✅ User deleted successfully');
      await load();
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
    } catch (e: any) {
      console.error('❌ User deletion failed:', e);
      setSnackbar({ 
        open: true, 
        message: (e && e.response && e.response.data && e.response.data.message) || 'Delete failed', 
        severity: 'error' 
      });
    }
  };

  const handleCreate = async (newUser: any) => {
    const errors: Record<string, string> = {};
    
    // Full name validation
    if (!newUser.fullName || newUser.fullName.trim() === '') {
      errors.fullName = 'Full name is required';
    }
    
    // Email validation
    if (!newUser.email || newUser.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = 'Invalid email format';
    }
    
    // Age validation (must be 18 or above and numbers only)
    if (!newUser.age || newUser.age.trim() === '') {
      errors.age = 'Age is required';
    } else if (isNaN(newUser.age) || parseInt(newUser.age) < 18) {
      errors.age = 'Must be 18 years or older';
    } else if (parseInt(newUser.age) > 120) {
      errors.age = 'Please enter a valid age';
    }
    
    // Phone number validation (Ethiopia code +251 and exactly 9 digits)
    if (!newUser.phone || newUser.phone.trim() === '') {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{9}$/.test(newUser.phone)) {
      errors.phone = 'Phone number must be exactly 9 digits after country code';
    } else if (!newUser.phone.startsWith('9')) {
      errors.phone = 'Ethiopian phone numbers start with 9';
    }
    
    // Password validation
    if (!newUser.password || newUser.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Password confirmation validation
    if (!newUser.confirmPassword) {
      errors.confirmPassword = 'Please confirm password';
    } else if (newUser.password !== newUser.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors);
      return;
    }

    // Prepare user data for API
    const userData = {
      fullName: newUser.fullName,
      email: newUser.email,
      phone: `+251${newUser.phone}`, // Add Ethiopia country code
      age: parseInt(newUser.age),
      password: newUser.password
    };

    try {
      console.log('🔄 Creating user with data:', userData);
      const response = await usersService.createUser(userData);
      console.log('✅ User created successfully:', response);
      setCreating(null);
      setCreateErrors({});
      await load();
      setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
    } catch (e: any) {
      console.error('❌ User creation failed:', e);
      console.error('Error details:', {
        message: e.message,
        response: e.response?.data,
        status: e.response?.status
      });
      
      let errorMessage = 'Create failed';
      if (e.response?.data?.message) {
        errorMessage = e.response.data.message;
      } else if (e.message) {
        errorMessage = e.message;
      }
      
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: 'error' 
      });
    }
  };

  const filteredUsers = showOnlyTelegram 
    ? users.filter(u => !!(u.telegramChatId || u.telegramUsername))
    : users;

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      p: 3
    }}>
      {/* Header */}
      <Paper sx={{ 
        p: 2, 
        borderRadius: 2, 
        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
        color: 'white',
        boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)', 
              mr: 1.5,
              width: 40,
              height: 40
            }}>
              <People sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.25, fontSize: '1.5rem' }}>
                User Management
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                Manage system users, roles, and permissions
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreating({})}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '0.875rem',
                py: 0.75,
                px: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              Create User
            </Button>
            <Tooltip title="Refresh users">
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
            Loading users...
          </Typography>
        </Box>
      )}

      {/* Controls */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 3px 15px rgba(0, 0, 0, 0.08)', mb: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showOnlyTelegram}
                    onChange={(e) => setShowOnlyTelegram(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Telegram sx={{ fontSize: 16 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      Show only Telegram-connected
                    </Typography>
                  </Box>
                }
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Chip 
                icon={<People sx={{ fontSize: 14 }} />}
                label={`${filteredUsers.length} users`}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ fontSize: '0.75rem' }}
              />
              {showOnlyTelegram && (
                <Chip 
                  icon={<Telegram sx={{ fontSize: 14 }} />}
                  label={`${filteredUsers.filter(u => !!(u.telegramChatId || u.telegramUsername)).length} Telegram`}
                  color="success"
                  variant="outlined"
                  size="small"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 3px 15px rgba(0, 0, 0, 0.08)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.875rem', py: 1 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.875rem', py: 1 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.875rem', py: 1 }}>Roles</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.875rem', py: 1 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.875rem', py: 1 }}>Telegram</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.875rem', py: 1 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user._id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                    <TableCell sx={{ py: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          bgcolor: user.isActive ? '#3b82f6' : '#9ca3af',
                          mr: 1.5,
                          width: 32,
                          height: 32
                        }}>
                          <Person sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '0.875rem' }}>
                            {user.fullName || '—'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                        {user.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{user.phone}</Typography>
                          </Box>
                        )}
                        {user.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{user.email}</Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {(user.roles || []).map((role, index) => (
                          <Chip
                            key={index}
                            label={role}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: '20px' }}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Chip
                        icon={user.isActive ? <Visibility sx={{ fontSize: 14 }} /> : <VisibilityOff sx={{ fontSize: 14 }} />}
                        label={user.isActive ? 'Active' : 'Inactive'}
                        color={user.isActive ? 'success' : 'default'}
                        size="small"
                        sx={{ fontSize: '0.7rem', height: '20px' }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      {(user.telegramChatId || user.telegramUsername) ? (
                        <Chip
                          icon={<Telegram sx={{ fontSize: 14 }} />}
                          label="Connected"
                          color="success"
                          size="small"
                          sx={{ fontSize: '0.7rem', height: '20px' }}
                        />
                      ) : (
                        <Chip
                          icon={<Telegram sx={{ fontSize: 14 }} />}
                          label="Not connected"
                          color="default"
                          size="small"
                          sx={{ fontSize: '0.7rem', height: '20px' }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small"
                            onClick={() => handleEdit(user)}
                            sx={{ 
                              bgcolor: 'success.light',
                              color: 'success.contrastText',
                              '&:hover': { bgcolor: 'success.main' },
                              width: 28,
                              height: 28
                            }}
                          >
                            <Edit sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reset Password">
                          <IconButton 
                            size="small"
                            onClick={() => handleReset(user)}
                            sx={{ 
                              bgcolor: 'warning.light',
                              color: 'warning.contrastText',
                              '&:hover': { bgcolor: 'warning.main' },
                              width: 28,
                              height: 28
                            }}
                          >
                            <LockReset sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small"
                            onClick={() => handleDelete(user)}
                            sx={{ 
                              bgcolor: 'error.light',
                              color: 'error.contrastText',
                              '&:hover': { bgcolor: 'error.main' },
                              width: 28,
                              height: 28
                            }}
                          >
                            <Delete sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
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
              Edit User
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
              label="Full Name"
              value={editing?.fullName || ''}
              onChange={(e) => setEditing({...editing!, fullName: e.target.value})}
              error={!!editingErrors.fullName}
              helperText={editingErrors.fullName}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email"
              value={editing?.email || ''}
              onChange={(e) => setEditing({...editing!, email: e.target.value})}
              error={!!editingErrors.email}
              helperText={editingErrors.email}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Phone"
              value={editing?.phone || ''}
              onChange={(e) => setEditing({...editing!, phone: e.target.value})}
              error={!!editingErrors.phone}
              helperText={editingErrors.phone}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Roles (comma separated)"
              value={(editing?.roles || []).join(', ')}
              onChange={(e) => setEditing({...editing!, roles: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
              variant="outlined"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={!!editing?.isActive}
                  onChange={(e) => setEditing({...editing!, isActive: e.target.checked})}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security fontSize="small" />
                  Active User
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
            onClick={() => editing && handleSave(editing)}
            sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog 
        open={creating !== null} 
        onClose={() => setCreating(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          color: 'white',
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
              Create New User
            </Typography>
            <IconButton 
              onClick={() => setCreating(null)}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={creating?.fullName || ''}
              onChange={(e) => setCreating({...creating!, fullName: e.target.value})}
              error={!!createErrors.fullName}
              helperText={createErrors.fullName}
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth
              label="Age"
              type="number"
              value={creating?.age || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setCreating({...creating!, age: value});
              }}
              error={!!createErrors.age}
              helperText={createErrors.age || "Must be 18 years or older"}
              variant="outlined"
              size="small"
              inputProps={{ min: 18, max: 120 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={creating?.email || ''}
              onChange={(e) => setCreating({...creating!, email: e.target.value})}
              error={!!createErrors.email}
              helperText={createErrors.email || "Please enter a valid email address"}
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={creating?.phone || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                setCreating({...creating!, phone: value});
              }}
              error={!!createErrors.phone}
              helperText={createErrors.phone || "Format: +251 9XXXXXXXX (9 digits after country code)"}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>+251</Typography>
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={creating?.password || ''}
              onChange={(e) => setCreating({...creating!, password: e.target.value})}
              error={!!createErrors.password}
              helperText={createErrors.password || "Minimum 6 characters required"}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ color: 'text.secondary' }}
                  >
                    {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                  </IconButton>
                )
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={creating?.confirmPassword || ''}
              onChange={(e) => setCreating({...creating!, confirmPassword: e.target.value})}
              error={!!createErrors.confirmPassword}
              helperText={createErrors.confirmPassword || "Must match the password above"}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <IconButton
                    size="small"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    sx={{ color: 'text.secondary' }}
                  >
                    {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                  </IconButton>
                )
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={() => setCreating(null)}
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => creating && handleCreate(creating)}
            sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
            size="small"
          >
            Create User
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
