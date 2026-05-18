import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Paper, 
  Fade,
  Slide,
  Chip,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Cookie as CookieIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface CookieConsentProps {
  onAccept?: () => void;
  onReject?: () => void;
  onCustomize?: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onAccept,
  onReject,
  onCustomize
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    }));
    setIsVisible(false);
    onAccept?.();
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      functional: false
    }));
    setIsVisible(false);
    onReject?.();
  };

  const handleCustomize = () => {
    setShowDetails(!showDetails);
    onCustomize?.();
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Fade in={isVisible}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Slide in={isVisible} direction="up">
          <Paper sx={{ m: 2, p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <CookieIcon sx={{ fontSize: 32, color: '#667eea', mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  🍪 Cookie Consent
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All", you agree to our use of cookies.
                </Typography>
                
                {showDetails && (
                  <Box sx={{ mb: 2 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Cookie Categories:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip 
                        icon={<CheckCircleIcon />} 
                        label="Essential (Required)" 
                        size="small" 
                        color="primary" 
                      />
                      <Chip 
                        label="Analytics (Performance)" 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label="Marketing (Personalization)" 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label="Functional (Features)" 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Essential cookies are required for the website to function properly. 
                      Other cookies help us improve your experience and provide personalized content.
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button 
                    variant="contained" 
                    onClick={handleAccept}
                    sx={{ bgcolor: '#667eea', '&:hover': { bgcolor: '#5a67d8' } }}
                  >
                    Accept All
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={handleCustomize}
                    startIcon={<SettingsIcon />}
                  >
                    Customize
                  </Button>
                  <Button 
                    variant="text" 
                    onClick={handleReject}
                    color="error"
                  >
                    Reject All
                  </Button>
                  <Button 
                    variant="text" 
                    href="/privacy"
                    size="small"
                  >
                    Learn More
                  </Button>
                </Box>
              </Box>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Paper>
        </Slide>
      </Box>
    </Fade>
  );
};

export default CookieConsent;
