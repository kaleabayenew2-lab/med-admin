import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Divider,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Fade,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Lock as LockIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  Share as ShareIcon,
  Person as PersonIcon,
  Storage as StorageIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  ArrowUpward as ArrowUpwardIcon,
  ContentCopy as ContentCopyIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Update as UpdateIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

export default function Privacy() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
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

  const lastUpdated = "November 2024";

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
            <LockIcon sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
              Privacy Policy
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
              How we protect and handle your personal information
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<SecurityIcon />} 
                label="Data Protection" 
                color="primary" 
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
              <Chip 
                icon={<LockIcon />} 
                label="Privacy First" 
                color="primary" 
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
              <Chip 
                icon={<PersonIcon />} 
                label="User Rights" 
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
        <Paper sx={{ p: 4, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Privacy Commitment
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Last updated: {lastUpdated}
              </Typography>
              <Tooltip title="Copy privacy policy link">
                <IconButton size="small" onClick={() => copyToClipboard(window.location.href)}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
            At Facility Management System, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, store, and protect your data when you use our healthcare facility management platform.
          </Typography>

          <Divider sx={{ mb: 4 }} />

          {/* Accordion Sections */}
          <Box sx={{ '& .MuiAccordion-root': { mb: 2 } }}>
            {/* 1. Types of Data Collected */}
            <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>1. Types of Data Collected</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  We collect the following types of information to provide you with our healthcare facility management services:
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Location Data (GPS)</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><LocationIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Current location to find nearby hospitals and pharmacies" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LocationIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Location history for improving search accuracy" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LocationIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Geographic preferences for facility recommendations" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Personal Information</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Name and contact information (when creating an account)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Email address for account management and notifications" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Phone number for emergency contact and verification" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Device & Browser Information</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Device type and operating system" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Browser type and version" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="IP address and connection information" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Screen resolution and device capabilities" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            {/* 2. Purpose of Data Collection */}
            <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <InfoIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>2. Purpose of Data Collection</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  We collect and use your data for the following specific purposes:
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>To Show Nearby Hospitals & Pharmacies</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Calculate distance to healthcare facilities" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Provide real-time availability information" />
                  </ListItem>
                    <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Offer personalized facility recommendations" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>To Improve System Performance</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Analyze usage patterns to optimize performance" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Identify and fix technical issues" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Enhance user experience based on feedback" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>To Provide Essential Services</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Manage user accounts and authentication" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Send important notifications and updates" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Provide customer support and assistance" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            {/* 3. Data Protection Methods */}
            <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SecurityIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>3. Data Protection Methods</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  We implement industry-standard security measures to protect your personal information:
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Encryption (HTTPS)</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><LockIcon color="success" /></ListItemIcon>
                    <ListItemText primary="All data transmitted between your device and our servers is encrypted using TLS 1.3" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LockIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Sensitive data is encrypted at rest using AES-256 encryption" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LockIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Secure key management and rotation protocols" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Secure Storage (Database Protection)</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><StorageIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Enterprise-grade database systems with advanced security features" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><StorageIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Regular security audits and vulnerability assessments" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><StorageIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Access controls and authentication for database access" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><StorageIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Automated backups with encryption and secure storage" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Additional Security Measures</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SecurityIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Multi-factor authentication for administrative access" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Intrusion detection and prevention systems" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Regular security training for development team" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            {/* 4. Data Sharing */}
            <Accordion expanded={expanded === 'panel4'} onChange={handleAccordionChange('panel4')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ShareIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>4. Data Sharing</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  We are transparent about how and when your data is shared with third parties:
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Third-Party Services</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><ShareIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Map Services: Location data is shared with mapping providers to display facility locations" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><ShareIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Analytics Services: Anonymized usage data may be shared for analytics" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><ShareIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Cloud Providers: Data is stored on secure cloud infrastructure" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Data Sharing Principles</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="We never sell personal information to third parties" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Data is only shared when necessary for service provision" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Third-party services are carefully vetted for security and privacy" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Data sharing agreements require compliance with privacy standards" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Legal Requirements</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
                    <ListItemText primary="Data may be shared when required by law or legal process" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
                    <ListItemText primary="We will notify users when legally permitted to do so" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            {/* 5. User Rights */}
            <Accordion expanded={expanded === 'panel5'} onChange={handleAccordionChange('panel5')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>5. User Rights</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  You have the following rights regarding your personal information:
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>View Personal Data</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><VisibilityIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Access all personal information we have about you" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><VisibilityIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Download your data in a readable format" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><VisibilityIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="View data processing and sharing history" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Update Personal Data</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><UpdateIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Correct inaccurate or incomplete information" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><UpdateIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Update contact preferences and notification settings" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><UpdateIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Modify account information and preferences" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Delete Personal Data</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
                    <ListItemText primary="Request deletion of your personal information" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
                    <ListItemText primary="Delete your account and associated data" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
                    <ListItemText primary="Opt-out of data collection and processing" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>How to Exercise Your Rights</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SettingsIcon color="info" /></ListItemIcon>
                    <ListItemText primary="Use the privacy settings in your account dashboard" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SettingsIcon color="info" /></ListItemIcon>
                    <ListItemText primary="Contact our privacy team at privacy@facilitymanagement.com" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SettingsIcon color="info" /></ListItemIcon>
                    <ListItemText primary="Submit a formal data subject request" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            {/* 6. Data Retention */}
            <Accordion expanded={expanded === 'panel6'} onChange={handleAccordionChange('panel6')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <StorageIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>6. Data Retention</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  We retain your personal information only as long as necessary for the purposes outlined in this policy:
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Retention Periods</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><StorageIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Account Information: Retained while your account is active" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><StorageIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Location Data: Retained for 30 days to improve service accuracy" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><StorageIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Usage Analytics: Retained for 12 months in anonymized form" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><StorageIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Support Communications: Retained for 2 years for quality assurance" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Data Deletion</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><DeleteIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Automatic deletion after retention periods expire" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><DeleteIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Immediate deletion upon account closure" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><DeleteIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Secure deletion methods to prevent data recovery" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Legal Requirements</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
                    <ListItemText primary="Some data may be retained longer for legal compliance" />
                  </ListItem>
                    <ListItem>
                    <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
                    <ListItemText primary="Audit logs may be retained for security purposes" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            {/* 7. Consent */}
            <Accordion expanded={expanded === 'panel7'} onChange={handleAccordionChange('panel7')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircleIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>7. Consent</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  We obtain your consent before collecting and processing your personal information:
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Consent Mechanisms</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Explicit consent during account registration" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Cookie consent banner for tracking technologies" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Location permission requests for GPS services" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Notification preferences for email and push alerts" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Withdrawing Consent</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><DeleteIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Withdraw consent at any time through account settings" />
                  </ListItem>
                    <ListItem>
                    <ListItemIcon><DeleteIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Disable location services through device settings" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><DeleteIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Opt-out of marketing communications" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Age and Consent</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><PersonIcon color="info" /></ListItemIcon>
                    <ListItemText primary="Users must be at least 16 years old to use our services" />
                  </ListItem>
                    <ListItem>
                    <ListItemIcon><PersonIcon color="info" /></ListItemIcon>
                    <ListItemText primary="Parental consent required for users under 16" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Paper>

        {/* Additional Information Section */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Paper sx={{ flex: 1, minWidth: 300, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>Your Privacy Choices</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="text" href="/account/privacy" sx={{ justifyContent: 'flex-start' }}>
                Privacy Settings
              </Button>
              <Button variant="text" href="/data-download" sx={{ justifyContent: 'flex-start' }}>
                Download Your Data
              </Button>
              <Button variant="text" href="/delete-account" sx={{ justifyContent: 'flex-start' }}>
                Delete Account
              </Button>
            </Box>
          </Paper>
          
          <Paper sx={{ flex: 1, minWidth: 300, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>Legal Resources</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="text" href="/terms" sx={{ justifyContent: 'flex-start' }}>
                Terms & Conditions
              </Button>
              <Button variant="text" href="/cookies" sx={{ justifyContent: 'flex-start' }}>
                Cookie Policy
              </Button>
              <Button variant="text" href="/gdpr" sx={{ justifyContent: 'flex-start' }}>
                GDPR Rights
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Contact Section */}
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f1f5f9' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>Questions About Privacy?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            If you have questions about this Privacy Policy or how we handle your data, please contact our privacy team.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: privacy@facilitymanagement.com | Response within 48 hours
          </Typography>
        </Paper>
      </Container>

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
