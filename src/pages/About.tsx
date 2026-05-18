import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Fade,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  LocalHospital as HospitalIcon,
  Medication as PharmacyIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon,
  Warning as EmergencyIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  ArrowUpward as ArrowUpwardIcon,
  ContentCopy as ContentCopyIcon,
  Launch as LaunchIcon,
  History as TimelineIcon
} from '@mui/icons-material';

export default function About() {
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

  const systemInfo = {
    version: '2.1.0',
    lastUpdated: 'November 2024',
    totalFacilities: '10,000+',
    activeUsers: '50,000+',
    uptime: '99.9%',
    responseTime: '< 200ms'
  };

  const features = [
    {
      icon: <SearchIcon />,
      title: 'Smart Search',
      description: 'Advanced search algorithms to find the perfect healthcare facility'
    },
    {
      icon: <LocationIcon />,
      title: 'Real-time Location',
      description: 'GPS-enabled location services for accurate facility recommendations'
    },
    {
      icon: <EmergencyIcon />,
      title: 'Emergency Access',
      description: 'Quick access to emergency services and nearest facilities'
    },
    {
      icon: <SettingsIcon />,
      title: 'Facility Management',
      description: 'Comprehensive tools for healthcare facility administrators'
    }
  ];

  const technology = [
    {
      icon: <CodeIcon />,
      name: 'React & TypeScript',
      description: 'Modern frontend framework for responsive user interface'
    },
    {
      icon: <StorageIcon />,
      name: 'Cloud Database',
      description: 'Scalable cloud storage with real-time synchronization'
    },
    {
      icon: <SecurityIcon />,
      name: 'Advanced Security',
      description: 'End-to-end encryption and secure data transmission'
    },
    {
      icon: <SpeedIcon />,
      name: 'Performance Optimization',
      description: 'Lightning-fast response times and caching strategies'
    }
  ];

  const milestones = [
    {
      date: '2022 Q1',
      title: 'Platform Launch',
      description: 'Initial release with basic hospital and pharmacy search'
    },
    {
      date: '2022 Q3',
      title: 'Mobile App Release',
      description: 'Native mobile applications for iOS and Android'
    },
    {
      date: '2023 Q1',
      title: 'Advanced Analytics',
      description: 'Real-time analytics and facility performance metrics'
    },
    {
      date: '2023 Q4',
      title: 'AI Integration',
      description: 'Machine learning for personalized recommendations'
    },
    {
      date: '2024 Q2',
      title: 'Global Expansion',
      description: 'Expanded to 50+ countries with multi-language support'
    }
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
            <HospitalIcon sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
              About Facility Management System
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
              Connecting people with healthcare facilities through innovative technology
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<LocationIcon />} 
                label="Find Nearby" 
                color="primary" 
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
              <Chip 
                icon={<HospitalIcon />} 
                label="Healthcare Access" 
                color="primary" 
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
              <Chip 
                icon={<TrendingUpIcon />} 
                label="Growing Network" 
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
        {/* System Overview */}
        <Paper sx={{ p: 4, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
            System Overview
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
            Our Facility Management System is a comprehensive healthcare platform designed to bridge the gap between patients 
            and healthcare facilities. We provide real-time information about hospitals and pharmacies, making it easier for 
            people to find the care they need when they need it most.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  <HospitalIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                    {systemInfo.totalFacilities}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Healthcare Facilities
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  <PeopleIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                    {systemInfo.activeUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  <TrendingUpIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                    {systemInfo.uptime}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    System Uptime
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  <SpeedIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                    {systemInfo.responseTime}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Response Time
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Mission and Vision */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3 }}>
                To improve access to healthcare services by providing a comprehensive platform that connects patients 
                with the right healthcare facilities at the right time.
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Make healthcare information accessible to everyone" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Reduce wait times and improve patient outcomes" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Empower patients with informed healthcare decisions" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Our Vision
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3 }}>
                To become the world's most trusted healthcare platform, revolutionizing how people discover 
                and interact with healthcare facilities globally.
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Global healthcare accessibility for all communities" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="AI-powered personalized healthcare recommendations" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Seamless integration with healthcare systems worldwide" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Features Overview */}
        <Paper sx={{ p: 4, mt: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
            Key Features
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                  <CardContent>
                    <Box sx={{ color: '#667eea', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Technology Stack */}
        <Paper sx={{ p: 4, mt: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
            Technology Used
          </Typography>
          <Grid container spacing={3}>
            {technology.map((tech, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', p: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ color: '#667eea' }}>
                        {tech.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {tech.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {tech.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Development Timeline */}
        <Paper sx={{ p: 4, mt: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
            Development Timeline
          </Typography>
          <List>
            {milestones.map((milestone, index) => (
              <ListItem key={index} sx={{ py: 2 }}>
                <ListItemIcon>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    bgcolor: '#667eea', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {index + 1}
                    </Typography>
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#667eea' }}>
                        {milestone.date}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {milestone.title}
                      </Typography>
                    </Box>
                  }
                  secondary={milestone.description}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Version Information */}
        <Paper sx={{ p: 4, mt: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Version & Updates
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip label={`Version ${systemInfo.version}`} color="primary" />
              <Typography variant="caption" color="text.secondary">
                Last updated: {systemInfo.lastUpdated}
              </Typography>
              <Tooltip title="Copy version info">
                <IconButton size="small" onClick={() => copyToClipboard(`Version ${systemInfo.version} - Updated ${systemInfo.lastUpdated}`)}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3 }}>
            Our platform is continuously evolving with regular updates to improve functionality, 
            security, and user experience. We follow agile development practices to deliver 
            new features and improvements on a regular basis.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" startIcon={<LaunchIcon />} href="/about" sx={{ bgcolor: '#667eea', '&:hover': { bgcolor: '#5a67d8' } }}>
              View Changelog
            </Button>
            <Button variant="outlined" startIcon={<TimelineIcon />} href="/about">
              Release Roadmap
            </Button>
            <Button variant="outlined" href="/contact">
              Send Feedback
            </Button>
          </Box>
        </Paper>

        {/* Additional Resources */}
        <Box sx={{ display: 'flex', gap: 3, mt: 4, flexWrap: 'wrap' }}>
          <Card sx={{ flex: 1, minWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>
                Learn More
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="text" href="/terms" sx={{ justifyContent: 'flex-start' }}>
                  Terms & Conditions
                </Button>
                <Button variant="text" href="/privacy" sx={{ justifyContent: 'flex-start' }}>
                  Privacy Policy
                </Button>
                <Button variant="text" href="/cookies" sx={{ justifyContent: 'flex-start' }}>
                  Cookie Policy
                </Button>
                <Button variant="text" href="/contact" sx={{ justifyContent: 'flex-start' }}>
                  Contact Support
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ flex: 1, minWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>
                System Features
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="text" href="/hospitals" sx={{ justifyContent: 'flex-start' }}>
                  Hospital Management
                </Button>
                <Button variant="text" href="/pharmacies" sx={{ justifyContent: 'flex-start' }}>
                  Pharmacy Management
                </Button>
                <Button variant="text" href="/facilities" sx={{ justifyContent: 'flex-start' }}>
                  Facility Directory
                </Button>
                <Button variant="text" href="/dashboard" sx={{ justifyContent: 'flex-start' }}>
                  Admin Dashboard
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
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
