import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Avatar
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  LocalHospital,
  LocalPharmacy,
  Event,
  Person,
  Schedule,
  Download,
  Refresh,
  CheckCircle
} from '@mui/icons-material';
import { api } from '../services/api';

interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  department: string;
  type: 'hospital' | 'pharmacy';
  status: 'scheduled' | 'checked-in' | 'completed' | 'cancelled';
  room?: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  createdDate: string;
  // Live SQLite Db Fields
  patientAge?: number;
  patientPhone?: string;
  userEmail?: string;
  paymentStatus?: string;
  amount?: number;
  paymentMethod?: string | null;
}

export default function HospitalBooking() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'both' | 'hospital' | 'pharmacy'>('both');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    department: '',
    type: 'hospital' as 'hospital' | 'pharmacy',
    room: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '09:00',
    notes: '',
    status: 'scheduled' as 'scheduled' | 'checked-in' | 'completed' | 'cancelled'
  });

  const departments = ['General Medicine', 'Pediatrics', 'Radiology', 'Cardiology', 'Emergency', 'Neurology', 'Surgery', 'Laboratory', 'General Consultation', 'Dental', 'Pharmacy Service'];

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/bookings');
      if (response.data && response.data.success && response.data.bookings) {
        const mapped: Appointment[] = response.data.bookings.map((b: any) => {
          let mappedStatus: Appointment['status'] = 'scheduled';
          if (b.status === 'completed') mappedStatus = 'completed';
          else if (b.status === 'cancelled') mappedStatus = 'cancelled';
          else if (b.status === 'pending') mappedStatus = 'checked-in';
          else if (b.status === 'confirmed') mappedStatus = 'scheduled';

          return {
            id: b.id ? `APT-${String(b.id).padStart(3, '0')}` : `APT-${Date.now()}`,
            patient: b.patientName || 'Unknown Patient',
            doctor: b.facilityName || 'Unknown Facility',
            department: b.purpose || 'General Consultation',
            type: (b.facilityType && b.facilityType.toLowerCase() === 'pharmacy') ? 'pharmacy' : 'hospital',
            status: mappedStatus,
            appointmentDate: b.appointmentDate || '',
            appointmentTime: b.appointmentTime || '',
            notes: b.purpose || '',
            createdDate: b.createdAt 
              ? (typeof b.createdAt === 'string' 
                  ? b.createdAt.split('T')[0] 
                  : new Date(b.createdAt).toISOString().split('T')[0]) 
              : new Date().toISOString().split('T')[0],
            patientAge: b.patientAge,
            patientPhone: b.patientPhone,
            userEmail: b.userEmail,
            paymentStatus: b.paymentStatus,
            amount: b.amount,
            paymentMethod: b.paymentMethod
          };
        });
        setAppointments(mapped);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getFilteredAppointments = () => {
    return appointments.filter(appointment => 
      selectedType === 'both' || appointment.type === selectedType
    );
  };

  const getStats = () => {
    const filtered = getFilteredAppointments();
    return {
      total: filtered.length,
      upcoming: filtered.filter(a => a.status === 'scheduled').length,
      hospitals: filtered.filter(a => a.type === 'hospital').length,
      pharmacies: filtered.filter(a => a.type === 'pharmacy').length,
      checkedIn: filtered.filter(a => a.status === 'checked-in').length,
      completed: filtered.filter(a => a.status === 'completed').length
    };
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesType = selectedType === 'both' || appointment.type === selectedType;
    const matchesSearch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          appointment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (appointment.patientPhone && appointment.patientPhone.includes(searchTerm)) ||
                          (appointment.userEmail && appointment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Flexible matching for department/purpose query
    const matchesDepartment = selectedDepartment === 'all' || 
                              appointment.department.toLowerCase().includes(selectedDepartment.toLowerCase());
    return matchesType && matchesSearch && matchesDepartment;
  });

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setFormData({
      patient: '',
      doctor: '',
      department: 'General Consultation',
      type: 'hospital',
      room: '',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '09:00',
      notes: '',
      status: 'scheduled'
    });
    setOpenDialog(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      patient: appointment.patient,
      doctor: appointment.doctor,
      department: appointment.department,
      type: appointment.type,
      room: appointment.room || '',
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      notes: appointment.notes || '',
      status: appointment.status
    });
    setOpenDialog(true);
  };

  const handleSaveAppointment = async () => {
    try {
      if (editingAppointment) {
        const idMatch = editingAppointment.id.match(/\d+/);
        if (idMatch) {
          const numericId = parseInt(idMatch[0], 10);
          let targetStatus = 'confirmed';
          if (formData.status === 'completed') targetStatus = 'completed';
          else if (formData.status === 'cancelled') targetStatus = 'cancelled';
          else if (formData.status === 'checked-in') targetStatus = 'pending';

          await api.put(`/api/bookings/${numericId}/status`, { status: targetStatus });
        }
      } else {
        // Create new SQLite booking entry
        await api.post('/api/bookings', {
          facilityId: 1,
          facilityName: formData.doctor,
          facilityType: formData.type,
          patientName: formData.patient,
          patientAge: 30,
          patientPhone: '0912345678',
          userEmail: 'admin@findmed.com',
          purpose: formData.department,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          status: 'confirmed',
          paymentStatus: 'unpaid',
          paymentMethod: 'Cash',
          amount: 250.0
        });
      }
      await fetchAppointments();
      setOpenDialog(false);
    } catch (err) {
      console.error('Error saving appointment:', err);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      const idMatch = appointmentId.match(/\d+/);
      if (!idMatch) return;
      const numericId = parseInt(idMatch[0], 10);
      try {
        await api.put(`/api/bookings/${numericId}/status`, { status: 'cancelled' });
        await fetchAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    }
  };

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    const idMatch = appointmentId.match(/\d+/);
    if (!idMatch) return;
    const numericId = parseInt(idMatch[0], 10);
    try {
      await api.put(`/api/bookings/${numericId}/status`, { status });
      await fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'checked-in': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Schedule />;
      case 'checked-in': return <Person />;
      case 'completed': return <CheckCircle />;
      case 'cancelled': return <Delete />;
      default: return <Event />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading live SQLite bookings...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1.5, sm: 3 } }}>
      <Paper sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
        color: 'white',
        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
        mb: { xs: 2, sm: 3 }
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
              <Event sx={{ fontSize: { xs: 24, sm: 32 } }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold', 
                mb: 0.5,
                fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.125rem' }
              }}>
                Hospital & Pharmacy Booking System
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
                Manage hospital and pharmacy patient bookings directly from the SQLite database in real time.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ mb: 3, p: 1 }}>
        <Tabs
          value={selectedType}
          onChange={(_, value) => setSelectedType(value)}
          indicatorColor="primary"
          textColor="primary"
          variant="standard"
        >
          <Tab value="both" label="All Facilities" />
          <Tab value="hospital" label="Hospitals Only" />
          <Tab value="pharmacy" label="Pharmacies Only" />
        </Tabs>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {(() => {
          const stats = getStats();
          return (
            <>
              <Grid item xs={12} sm={6} md={2.4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="subtitle2">
                      Total Bookings
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.total}
                    </Typography>
                    <LocalHospital color="primary" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="subtitle2">
                      Scheduled (Confirmed)
                    </Typography>
                    <Typography variant="h4" color="info.main" fontWeight="bold">
                      {stats.upcoming}
                    </Typography>
                    <Schedule color="info" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="subtitle2">
                      Pending (Checked In)
                    </Typography>
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {stats.checkedIn}
                    </Typography>
                    <Person color="warning" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="subtitle2">
                      Completed
                    </Typography>
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      {stats.completed}
                    </Typography>
                    <CheckCircle color="success" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="subtitle2">
                      Hospitals / Pharmacies
                    </Typography>
                    <Typography variant="h5" color="textPrimary" fontWeight="bold" sx={{ mt: 0.5 }}>
                      {stats.hospitals} H / {stats.pharmacies} P
                    </Typography>
                    <LocalPharmacy color="secondary" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            </>
          );
        })()}
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by patient, phone, email, doctor, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Services & Departments</InputLabel>
              <Select
                value={selectedDepartment}
                label="Services & Departments"
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <MenuItem value="all">All Services</MenuItem>
                {departments.map(dept => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddAppointment}
              sx={{ height: '56px' }}
            >
              Add Booking
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Appointments Table */}
      <Paper>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
          <Typography variant="h6" fontWeight="bold">
            Live SQLite Database Bookings ({filteredAppointments.length})
          </Typography>
          <Box>
            <Button variant="outlined" startIcon={<Download />} sx={{ mr: 1 }}>
              Export CSV
            </Button>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchAppointments}>
              Refresh Data
            </Button>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Patient Profile</TableCell>
                <TableCell>Medical Facility</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Purpose of Visit</TableCell>
                <TableCell>Schedule</TableCell>
                <TableCell>Payment (ETB)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Quick Actions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {appointment.patient}
                      </Typography>
                      {appointment.patientPhone && (
                        <Typography variant="caption" display="block" color="textSecondary">
                          Phone: {appointment.patientPhone}
                        </Typography>
                      )}
                      {appointment.userEmail && (
                        <Typography variant="caption" display="block" color="textSecondary">
                          Email: {appointment.userEmail}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.type}
                      size="small"
                      color={appointment.type === 'hospital' ? 'primary' : 'secondary'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.department}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" display="block">
                      {appointment.appointmentDate}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {appointment.appointmentTime}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {appointment.amount ? `${appointment.amount.toFixed(2)}` : '250.00'} ETB
                    </Typography>
                    <Chip
                      label={appointment.paymentStatus || 'unpaid'}
                      size="small"
                      color={appointment.paymentStatus === 'paid' ? 'success' : 'default'}
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      size="small"
                      color={getStatusColor(appointment.status)}
                      icon={getStatusIcon(appointment.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                          >
                            Complete
                          </Button>
                          {appointment.status === 'checked-in' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="info"
                              onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                            >
                              Approve
                            </Button>
                          )}
                        </>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditAppointment(appointment)}
                        color="primary"
                        title="Edit"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleCancelAppointment(appointment.id)}
                        color="error"
                        title="Cancel"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAppointment ? 'Edit Booking Metadata' : 'Create Live SQLite Booking'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Patient Name"
                  value={formData.patient}
                  onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Facility Name"
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Facility Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Facility Type"
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'hospital' | 'pharmacy' })}
                  >
                    <MenuItem value="hospital">Hospital</MenuItem>
                    <MenuItem value="pharmacy">Pharmacy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Purpose of Visit</InputLabel>
                  <Select
                    value={formData.department}
                    label="Purpose of Visit"
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    {departments.map(dept => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Appointment Date"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Appointment Time"
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {editingAppointment && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <MenuItem value="scheduled">Scheduled (Confirmed)</MenuItem>
                      <MenuItem value="checked-in">Pending Approval</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveAppointment} variant="contained">
            {editingAppointment ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
