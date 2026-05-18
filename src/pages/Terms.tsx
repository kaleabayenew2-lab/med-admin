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
  Fade
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Lock as PrivacyIcon,
  Gavel as GavelIcon,
  Info as InfoIcon,
  ArrowUpward as ArrowUpwardIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';

export default function Terms() {
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
            <GavelIcon sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
              Terms & Conditions
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
              Please read these terms carefully before using our services
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<BusinessIcon />} 
                label="Business Terms" 
                color="primary" 
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
              <Chip 
                icon={<SecurityIcon />} 
                label="Security & Privacy" 
                color="primary" 
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
              <Chip 
                icon={<GavelIcon />} 
                label="Legal Framework" 
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
              Legal Agreement
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Last updated: {lastUpdated}
              </Typography>
              <Tooltip title="Copy terms link">
                <IconButton size="small" onClick={() => copyToClipboard(window.location.href)}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
            Welcome to our Facility Management System. By accessing or using our services, you agree to be bound by these Terms & Conditions. 
            This agreement governs your use of our platform and outlines the rights and responsibilities of both parties.
          </Typography>

          <Divider sx={{ mb: 4 }} />

          {/* Accordion Sections */}
          <Box sx={{ '& .MuiAccordion-root': { mb: 2 } }}>
            {/* 1. Acceptance of Terms */}
            <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <InfoIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>1. Acceptance of Terms</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  By accessing and using this Facility Management System, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms & Conditions. These terms constitute a legally binding agreement 
                  between you and our company. If you do not agree to these terms, you must not use our services.
                </Typography>
                <Typography sx={{ lineHeight: 1.7 }}>
                  Your continued use of the platform following any changes to these terms constitutes acceptance of those changes.
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* 2. Description of Services */}
            <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <BusinessIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>2. Description of Services</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  Our Facility Management System provides comprehensive healthcare facility management services including:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Core Features:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>Hospital and Pharmacy Management</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Patient Record Management</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Appointment Scheduling</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Staff Management</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Inventory and Resource Management</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Analytics and Reporting</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Secure Data Storage</Typography>
                </Box>
                <Typography sx={{ lineHeight: 1.7 }}>
                  We reserve the right to modify, suspend, or discontinue any part of the services at any time without prior notice.
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* 3. User Responsibilities */}
            <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SecurityIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>3. User Responsibilities</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  As a user of our system, you agree to:
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Security Obligations:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>Maintain the confidentiality of your login credentials</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Immediately notify us of any unauthorized access</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Use strong passwords and update them regularly</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Log out after each session</Typography>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Usage Guidelines:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>Use the system only for legitimate healthcare management purposes</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Comply with all applicable laws and regulations</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Not attempt to compromise system security</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Not share your account with unauthorized individuals</Typography>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Data Accuracy:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>Ensure all information entered is accurate and up-to-date</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Regularly update facility information</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Maintain proper documentation as required by law</Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* 4. Privacy and Data Protection */}
            <Accordion expanded={expanded === 'panel4'} onChange={handleAccordionChange('panel4')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PrivacyIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>4. Privacy and Data Protection</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  We are committed to protecting your privacy and handling data in accordance with applicable privacy laws:
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Data Collection:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>We collect only necessary information for service provision</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Data is collected with your consent</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>You have the right to access and correct your data</Typography>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Data Security:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>Industry-standard encryption for data protection</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Regular security audits and updates</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Limited access to authorized personnel only</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Secure backup and disaster recovery systems</Typography>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Data Usage:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>Data is used only for service provision and improvement</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>We do not sell personal information to third parties</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Analytics data is anonymized and aggregated</Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* 5. Intellectual Property */}
            <Accordion expanded={expanded === 'panel5'} onChange={handleAccordionChange('panel5')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <GavelIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>5. Intellectual Property</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  All content, features, and functionality of this system are owned by our company and are protected by 
                  copyright, trademark, and other intellectual property laws.
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>What You Can Do:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>Use the system for its intended purpose</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Download and print materials for personal use</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Share non-confidential information about our services</Typography>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>What You Cannot Do:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>Copy, modify, or distribute our proprietary code</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Reverse engineer or attempt to extract source code</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Use our trademarks without permission</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Create derivative works based on our system</Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* 6. Limitation of Liability */}
            <Accordion expanded={expanded === 'panel6'} onChange={handleAccordionChange('panel6')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <GavelIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>6. Limitation of Liability</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  To the fullest extent permitted by law, our company shall not be liable for any indirect, incidental, 
                  special, or consequential damages resulting from your use of this system.
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Service Availability:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>We do not guarantee uninterrupted or error-free service</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Temporary interruptions may occur for maintenance</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>We are not liable for data loss due to user error</Typography>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Maximum Liability:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>Our total liability shall not exceed the amount paid for services</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>This limitation applies to all claims and causes of action</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Some jurisdictions do not allow this limitation</Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* 7. Termination */}
            <Accordion expanded={expanded === 'panel7'} onChange={handleAccordionChange('panel7')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <GavelIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>7. Termination</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  Either party may terminate this agreement under the following conditions:
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Termination by User:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>You may terminate your account at any time</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Written notice is preferred for record-keeping</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Data export options are available upon request</Typography>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Termination by Us:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>We may terminate for violation of terms</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>We may terminate for illegal activities</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>We may terminate for security concerns</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Notice will be provided when possible</Typography>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Post-Termination:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>Your account will be deactivated</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Data will be retained according to our privacy policy</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Outstanding fees must be paid</Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* 8. Dispute Resolution */}
            <Accordion expanded={expanded === 'panel8'} onChange={handleAccordionChange('panel8')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <GavelIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>8. Dispute Resolution</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  We are committed to resolving disputes amicably and efficiently.
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Resolution Process:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>First, contact our support team for informal resolution</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>If unresolved, we offer formal mediation</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Arbitration may be required for certain disputes</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Legal action is a last resort</Typography>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Governing Law:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>These terms are governed by applicable laws</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Disputes are handled in the appropriate jurisdiction</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>International users agree to local compliance</Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* 9. Changes to Terms */}
            <Accordion expanded={expanded === 'panel9'} onChange={handleAccordionChange('panel9')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <InfoIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>9. Changes to Terms</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  We reserve the right to modify these terms at any time.
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Notification Process:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>Significant changes will be communicated via email</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Minor changes may be posted on our website</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Continued use constitutes acceptance</Typography>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Effective Date:</Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <Typography component="li" sx={{ mb: 1 }}>Changes take effect immediately upon posting</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Users will be notified of material changes</Typography>
                  <Typography component="li" sx={{ mb: 1 }}>Previous versions are archived for reference</Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* 10. Contact Information */}
            <Accordion expanded={expanded === 'panel10'} onChange={handleAccordionChange('panel10')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <InfoIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>10. Contact Information</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  If you have questions about these Terms & Conditions, please contact us:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Email:</strong> legal@facilitymanagement.com
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Address:</strong> 123 Healthcare Boulevard, Medical District, MD 12345
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Business Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM EST
                  </Typography>
                </Box>
                <Typography sx={{ lineHeight: 1.7 }}>
                  For technical support, please contact our support team at support@facilitymanagement.com
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Paper>

        {/* Additional Information Section */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Paper sx={{ flex: 1, minWidth: 300, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>Quick Links</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="text" href="/privacy" sx={{ justifyContent: 'flex-start' }}>
                Privacy Policy
              </Button>
              <Button variant="text" href="/cookies" sx={{ justifyContent: 'flex-start' }}>
                Cookie Policy
              </Button>
              <Button variant="text" href="/support" sx={{ justifyContent: 'flex-start' }}>
                Support Center
              </Button>
            </Box>
          </Paper>
          
          <Paper sx={{ flex: 1, minWidth: 300, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>Legal Resources</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="text" href="/compliance" sx={{ justifyContent: 'flex-start' }}>
                Compliance Information
              </Button>
              <Button variant="text" href="/security" sx={{ justifyContent: 'flex-start' }}>
                Security Practices
              </Button>
              <Button variant="text" href="/gdpr" sx={{ justifyContent: 'flex-start' }}>
                GDPR Information
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Footer Notice */}
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f1f5f9' }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 Facility Management System. All rights reserved. These terms were last updated in {lastUpdated}.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This document is a legal agreement. Please read it carefully and keep a copy for your records.
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
