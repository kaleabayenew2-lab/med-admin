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
  ListItemIcon,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Cookie as CookieIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Analytics as AnalyticsIcon,
  Campaign as CampaignIcon,
  Extension as ExtensionIcon,
  Security as SecurityIcon,
  Info as InfoIcon,
  ArrowUpward as ArrowUpwardIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';

export default function Cookies() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false
  });

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

  const handlePreferenceChange = (category: keyof typeof cookiePreferences) => {
    if (category === 'essential') return; // Essential cookies cannot be disabled
    setCookiePreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    localStorage.setItem('cookieConsent', 'customized');
    window.location.reload();
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
            <CookieIcon sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
              Cookie Policy
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
              How we use cookies and tracking technologies to enhance your experience
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<CookieIcon />} 
                label="Cookie Management" 
                color="primary" 
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
              <Chip 
                icon={<SettingsIcon />} 
                label="User Control" 
                color="primary" 
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
              <Chip 
                icon={<SecurityIcon />} 
                label="Privacy First" 
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
        {/* Cookie Preferences Manager */}
        <Paper sx={{ p: 4, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
            Cookie Preferences Manager
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
            Customize your cookie preferences below. Essential cookies are required for the website to function properly.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={cookiePreferences.essential} 
                  disabled
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Essential Cookies (Required)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    These cookies are necessary for the website to function and cannot be disabled.
                  </Typography>
                </Box>
              }
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={cookiePreferences.analytics} 
                  onChange={() => handlePreferenceChange('analytics')}
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Analytics Cookies
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Help us understand how visitors interact with our website to improve performance.
                  </Typography>
                </Box>
              }
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={cookiePreferences.marketing} 
                  onChange={() => handlePreferenceChange('marketing')}
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Marketing Cookies
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Used to deliver personalized advertisements and track marketing effectiveness.
                  </Typography>
                </Box>
              }
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={cookiePreferences.functional} 
                  onChange={() => handlePreferenceChange('functional')}
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Functional Cookies
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Enable enhanced features and personalization options.
                  </Typography>
                </Box>
              }
            />
          </Box>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              onClick={savePreferences}
              sx={{ bgcolor: '#667eea', '&:hover': { bgcolor: '#5a67d8' } }}
            >
              Save Preferences
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setCookiePreferences({
                essential: true,
                analytics: true,
                marketing: true,
                functional: true
              })}
            >
              Accept All
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setCookiePreferences({
                essential: true,
                analytics: false,
                marketing: false,
                functional: false
              })}
            >
              Reject Non-Essential
            </Button>
          </Box>
        </Paper>

        {/* Detailed Cookie Information */}
        <Paper sx={{ p: 4, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Detailed Cookie Information
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Last updated: {lastUpdated}
              </Typography>
              <Tooltip title="Copy cookie policy link">
                <IconButton size="small" onClick={() => copyToClipboard(window.location.href)}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Accordion Sections */}
          <Box sx={{ '& .MuiAccordion-root': { mb: 2 } }}>
            {/* 1. What Cookies Are Used */}
            <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CookieIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>1. What Cookies Are Used</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  We use the following types of cookies on our platform:
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Session Cookies</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Maintain user login state during session" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Track shopping cart contents and preferences" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Enable secure navigation between pages" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Analytics Cookies</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><AnalyticsIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Google Analytics for website traffic analysis" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><AnalyticsIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Hotjar for user behavior and heatmaps" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><AnalyticsIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Custom analytics for facility search patterns" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Functional Cookies</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><ExtensionIcon color="info" /></ListItemIcon>
                    <ListItemText primary="Remember user preferences and settings" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><ExtensionIcon color="info" /></ListItemIcon>
                    <ListItemText primary="Enable personalized content recommendations" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><ExtensionIcon color="info" /></ListItemIcon>
                    <ListItemText primary="Store location preferences for faster searches" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            {/* 2. Purpose of Cookies */}
            <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <InfoIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>2. Purpose of Cookies</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  Cookies serve several important purposes on our platform:
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Improve User Experience</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Remember your login credentials for faster access" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Maintain your search preferences and filters" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Provide personalized facility recommendations" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Remember User Preferences</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Save your favorite hospitals and pharmacies" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Remember location preferences and search radius" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Store notification preferences and settings" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Usage Tracking</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><AnalyticsIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Analyze which features are most popular" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><AnalyticsIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Track search patterns to improve recommendations" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><AnalyticsIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Monitor website performance and identify issues" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            {/* 3. User Control */}
            <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SettingsIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>3. User Control</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  You have full control over the cookies we use:
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Accept / Reject Cookies</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Cookie consent banner on first visit" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Granular control over cookie categories" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="One-click accept or reject all options" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Manage Preferences</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Change cookie preferences at any time" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Cookie settings panel in user account" />
                  </ListItem>
                    <ListItem>
                    <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
                    <ListItemText primary="Clear individual cookies or all at once" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Browser Controls</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><BlockIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Block all cookies through browser settings" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BlockIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Delete existing cookies from your browser" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BlockIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Set exceptions for trusted websites" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            {/* 4. Third-Party Cookies */}
            <Accordion expanded={expanded === 'panel4'} onChange={handleAccordionChange('panel4')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CampaignIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>4. Third-Party Cookies</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
                  We work with trusted third-party services that may use cookies:
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Map Services</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CampaignIcon color="info" /></ListItemIcon>
                    <ListItemText primary="Google Maps for location services and facility mapping" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CampaignIcon color="info" /></ListItemIcon>
                    <ListItemText primary="MapBox for alternative mapping services" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Analytics Services</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><AnalyticsIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Google Analytics for website traffic analysis" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><AnalyticsIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Hotjar for user experience optimization" />
                  </ListItem>
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>Security and Performance</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SecurityIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Cloudflare for DDoS protection and performance" />
                  </ListItem>
                    <ListItem>
                    <ListItemIcon><SecurityIcon color="success" /></ListItemIcon>
                    <ListItemText primary="ReCAPTCHA for bot protection" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Paper>

        {/* Additional Information Section */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Paper sx={{ flex: 1, minWidth: 300, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>Quick Actions</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="text" href="/privacy" sx={{ justifyContent: 'flex-start' }}>
                Privacy Policy
              </Button>
              <Button variant="text" href="/terms" sx={{ justifyContent: 'flex-start' }}>
                Terms & Conditions
              </Button>
              <Button variant="text" href="/feedback" sx={{ justifyContent: 'flex-start' }}>
                Feedback
              </Button>
            </Box>
          </Paper>
          
          <Paper sx={{ flex: 1, minWidth: 300, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>Legal Resources</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="text" href="/gdpr" sx={{ justifyContent: 'flex-start' }}>
                GDPR Information
              </Button>
              <Button variant="text" href="/ccpa" sx={{ justifyContent: 'flex-start' }}>
                CCPA Information
              </Button>
              <Button variant="text" href="/data-rights" sx={{ justifyContent: 'flex-start' }}>
                Data Rights
              </Button>
            </Box>
          </Paper>
        </Box>

        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f1f5f9' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>Questions About Cookies?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            If you have questions about our Cookie Policy or how we use tracking technologies, please review our privacy resources or send feedback.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visit the Feedback page for support and suggestions.
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
