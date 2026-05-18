import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Fade,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Support as SupportIcon,
  BugReport as BugReportIcon,
  Feedback as FeedbackIcon,
  AccountCircle as AccountCircleIcon,
  CheckCircle as CheckCircleIcon,
  ArrowUpward as ArrowUpwardIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
  };

  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const contactInfo = {
    email: 'support@facilitymanagement.com',
    phone: '+1 (555) 123-4567',
    address: '123 Healthcare Boulevard, Medical District, MD 12345',
    hours: 'Monday-Friday, 9:00 AM - 6:00 PM EST'
  };

  const faqs = [
    {
      question: 'How do I find nearby hospitals and pharmacies?',
      answer: 'Simply enable location services on your device and use our search feature. The system will automatically show you the nearest healthcare facilities based on your current location.'
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your personal information. All data transmission is encrypted using HTTPS, and sensitive data is encrypted at rest.'
    },
    {
      question: 'Can I update my facility information?',
      answer: 'If you are a facility administrator, you can log in to your account and update your facility information through the management dashboard. Contact support if you need assistance.'
    },
    {
      question: 'How do I report incorrect information?',
      answer: 'Use the contact form below or email us directly at support@facilitymanagement.com. Please provide details about the incorrect information and the facility in question.'
    },
    {
      question: 'What should I do in an emergency?',
      answer: 'Always call emergency services (911) first. Our platform provides location information for nearby facilities but should not be used as a substitute for emergency medical care.'
    }
  ];

  const supportCategories = [
    { value: 'general', label: 'General Inquiry', icon: <QuestionAnswerIcon /> },
    { value: 'technical', label: 'Technical Support', icon: <SupportIcon /> },
    { value: 'bug', label: 'Bug Report', icon: <BugReportIcon /> },
    { value: 'feedback', label: 'Feedback', icon: <FeedbackIcon /> },
    { value: 'account', label: 'Account Issues', icon: <AccountCircleIcon /> }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 8,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <EmailIcon sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
              We're here to help you with any questions or support needs
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<SupportIcon />} 
                label="24/7 Support" 
                color="primary" 
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
              <Chip 
                icon={<EmailIcon />} 
                label="Quick Response" 
                color="primary" 
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
              <Chip 
                icon={<PhoneIcon />} 
                label="Multiple Channels" 
                color="primary" 
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Send us a Message
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Category"
                      select
                      value={formData.category}
                      onChange={handleInputChange('category')}
                      variant="outlined"
                      SelectProps={{
                        native: true
                      }}
                    >
                      {supportCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      value={formData.subject}
                      onChange={handleInputChange('subject')}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange('message')}
                      required
                      variant="outlined"
                      placeholder="Please describe your question or issue in detail..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? null : <SendIcon />}
                      sx={{ 
                        bgcolor: '#667eea', 
                        '&:hover': { bgcolor: '#5a67d8' },
                        minWidth: 200
                      }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Quick Contact */}
              <Paper sx={{ p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                  Quick Contact
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EmailIcon color="primary" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Email
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contactInfo.email}
                      </Typography>
                    </Box>
                    <Tooltip title="Copy email">
                      <IconButton size="small" onClick={() => copyToClipboard(contactInfo.email)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PhoneIcon color="primary" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Phone
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contactInfo.phone}
                      </Typography>
                    </Box>
                    <Tooltip title="Copy phone">
                      <IconButton size="small" onClick={() => copyToClipboard(contactInfo.phone)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <LocationIcon color="primary" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Office Location
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contactInfo.address}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ScheduleIcon color="primary" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Support Hours
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contactInfo.hours}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* Support Categories */}
              <Paper sx={{ p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                  Support Categories
                </Typography>
                
                <List dense>
                  {supportCategories.map((category) => (
                    <ListItem key={category.value} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {category.icon}
                      </ListItemIcon>
                      <ListItemText primary={category.label} />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              {/* Emergency Notice */}
              <Paper sx={{ 
                p: 3, 
                bgcolor: '#fee2e2', 
                border: '1px solid #fecaca',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#dc2626', mb: 1 }}>
                  🚨 Emergency Notice
                </Typography>
                <Typography variant="body2" color="#7f1d1d">
                  For medical emergencies, please call 911 or your local emergency services immediately. 
                  This platform is not intended for emergency medical care.
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <Paper sx={{ p: 4, mt: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
            Frequently Asked Questions
          </Typography>
          
          <Box sx={{ '& .MuiAccordion-root': { mb: 2 } }}>
            {faqs.map((faq, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ lineHeight: 1.7 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Paper>

        {/* Additional Resources */}
        <Box sx={{ display: 'flex', gap: 3, mt: 4, flexWrap: 'wrap' }}>
          <Card sx={{ flex: 1, minWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>
                Self-Service Resources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="text" href="/help" sx={{ justifyContent: 'flex-start' }}>
                  Help Center
                </Button>
                <Button variant="text" href="/tutorials" sx={{ justifyContent: 'flex-start' }}>
                  Video Tutorials
                </Button>
                <Button variant="text" href="/documentation" sx={{ justifyContent: 'flex-start' }}>
                  Documentation
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ flex: 1, minWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>
                Community Support
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="text" href="/forum" sx={{ justifyContent: 'flex-start' }}>
                  Community Forum
                </Button>
                <Button variant="text" href="/blog" sx={{ justifyContent: 'flex-start' }}>
                  Blog & Updates
                </Button>
                <Button variant="text" href="/social" sx={{ justifyContent: 'flex-start' }}>
                  Social Media
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Success Message */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          <CheckCircleIcon sx={{ mr: 1 }} />
          Message sent successfully! We'll respond within 24 hours.
        </Alert>
      </Snackbar>

      {/* Scroll to Top Button */}
      <Fade in={showScrollTop}>
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            bgcolor: '#667eea',
            color: 'white',
            '&:hover': {
              bgcolor: '#5a67d8',
            },
            zIndex: 1000,
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </Fade>
    </Box>
  );
}
