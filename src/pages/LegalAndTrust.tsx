import React, { useState } from 'react';
import { Box, Paper, Tab, Tabs, Typography, Button } from '@mui/material';

const tabItems = [
  {
    title: 'Privacy Policy',
    description: 'Understand how we collect, use and protect personal data across the admin portal.',
    details: [
      'We collect only the data needed for user authentication and administration.',
      'Data is protected with secure transport and storage practices.',
      'Users can review how their information is used in a transparent way.'
    ]
  },
  {
    title: 'Terms & Conditions',
    description: 'Review the core rules and expectations for using the FindMed admin portal.',
    details: [
      'Use of this portal is restricted to authorized staff and administrators.',
      'Unauthorized access, sharing credentials, or data tampering is prohibited.',
      'The portal is provided as-is and usage may be monitored for security.'
    ]
  },
  {
    title: 'Cookie Consent',
    description: 'Learn how cookies are used, and how preferences are managed in the system.',
    details: [
      'Essential cookies keep the portal functional and secure.',
      'Analytics cookies help us improve performance and reliability.',
      'Users can manage preferences to control optional cookies.'
    ]
  },
  {
    title: 'Contact Page',
    description: 'Quick access to support and communication details for portal users.',
    details: [
      'Support is available via email for admin portal questions.',
      'Use the contact resources to report issues or request access.',
      'Response times may vary depending on the request priority.'
    ]
  },
  {
    title: 'About Page',
    description: 'Get a clean overview of the portal purpose and the organization it serves.',
    details: [
      'FindMed admin portal helps manage facilities, content, booking, and support.',
      'Designed for hospitals and pharmacies with modern admin workflows.',
      'The portal supports clear legal, trust, and operational documentation.'
    ]
  }
];

export default function LegalAndTrust() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const currentItem = tabItems[activeTab];

  return (
    <Box className="p-4">
      <Typography variant="h4" component="h2" className="mb-4 font-semibold">
        Legal & Trust
      </Typography>

      <Paper elevation={2} className="overflow-hidden rounded-2xl">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          className="bg-white"
          TabIndicatorProps={{ style: { height: 4, borderRadius: 4 } }}
        >
          {tabItems.map((item) => (
            <Tab key={item.title} label={item.title} className="text-sm font-medium text-slate-700" />
          ))}
        </Tabs>
      </Paper>

      <Paper elevation={1} className="mt-4 rounded-2xl p-6 bg-slate-50">
        <Typography variant="h5" component="h3" className="font-semibold mb-2">
          {currentItem.title}
        </Typography>
        <Typography variant="body1" className="text-gray-700 mb-4">
          {currentItem.description}
        </Typography>
        <Box component="ul" className="space-y-3 pl-5 text-sm text-gray-700 list-disc">
          {currentItem.details.map((detail) => (
            <Typography component="li" key={detail} className="text-gray-700">
              {detail}
            </Typography>
          ))}
        </Box>
        <Button variant="contained" color="primary" className="mt-6 rounded-full px-6" disableElevation>
          Learn more
        </Button>
      </Paper>
    </Box>
  );
}
