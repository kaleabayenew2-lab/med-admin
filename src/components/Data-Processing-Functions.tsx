import { Facility } from '../utils/facilityUtils';

// TypeScript interfaces
interface Coordinates {
  lat: number;
  lng: number;
  text: string;
}

interface StatusColors {
  bg: string;
  text: string;
  border: string;
}

interface ServiceColors {
  bg: string;
  text: string;
}

interface FacilityStatusBadge {
  status: boolean;
  completion: number;
  isComplete: boolean;
  needsAttention: boolean;
  isPartiallyComplete: boolean;
}

// Format coordinates for display
export const formatCoordinates = (loc: any): Coordinates | null => {
  console.log('=== FORMAT COORDINATES DEBUGGING ===');
  console.log('Input location:', loc);
  console.log('Input type:', typeof loc);
  
  if (!loc) {
    console.log('formatCoordinates: No location data provided');
    return null;
  }
  
  // Handle different location data structures
  let coordinates: number[] | null = null;
  
  // Handle GeoJSON format: {"type":"Point","coordinates":[37.441361,12.587871]}
  if (loc.type === 'Point' && Array.isArray(loc.coordinates) && loc.coordinates.length >= 2) {
    console.log('Detected GeoJSON Point format');
    coordinates = loc.coordinates;
  }
  // Handle direct coordinates array: [37.441361,12.587871]
  else if (Array.isArray(loc) && loc.length >= 2) {
    console.log('Detected direct coordinates array');
    coordinates = loc;
  }
  // Handle lat/lng objects: {lat: 12.587871, lng: 37.441361}
  else if (loc.lat && loc.lng) {
    console.log('Detected lat/lng object format');
    coordinates = [loc.lng, loc.lat]; // Note: GeoJSON format is [lng, lat]
  }
  // Handle latitude/longitude objects: {latitude: 12.587871, longitude: 37.441361}
  else if (loc.latitude && loc.longitude) {
    console.log('Detected latitude/longitude object format');
    coordinates = [loc.longitude, loc.latitude];
  }
  // Handle nested coordinates: {coordinates: [37.441361,12.587871]}
  else if (loc.coordinates && Array.isArray(loc.coordinates) && loc.coordinates.length >= 2) {
    console.log('Detected nested coordinates format');
    coordinates = loc.coordinates;
  }
  else {
    console.log('Unknown location format detected');
    console.log('Location keys:', Object.keys(loc || {}));
    console.log('Location values:', Object.values(loc || {}));
  }
  
  console.log('Extracted coordinates:', coordinates);
  
  if (!coordinates || coordinates.length < 2) {
    console.log('formatCoordinates: Invalid coordinates structure', loc);
    return null;
  }
  
  const lng = coordinates[0];
  const lat = coordinates[1];
  
  console.log('Extracted lng:', lng, 'lat:', lat);
  
  // Validate coordinate values
  if (typeof lat !== 'number' || typeof lng !== 'number' || 
      isNaN(lat) || isNaN(lng) || 
      lat < -90 || lat > 90 || 
      lng < -180 || lng > 180) {
    console.log('formatCoordinates: Invalid coordinate values', { lat, lng });
    return null;
  }
  
  const result = { lat, lng, text: `${lat.toFixed(6)}, ${lng.toFixed(6)}` };
  console.log('formatCoordinates: Successfully formatted coordinates', result);
  return result;
};

// Phone number validation
export const validatePhoneNumber = (value: string): boolean => {
  const phoneRegex = /^[97]\d{0,8}$/;
  return value === '' || phoneRegex.test(value);
};

// Copy to clipboard handler
export const copyToClipboardHandler = async (text: string, label: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    console.log(`${label} copied to clipboard:`, text);
  } catch (err) {
    console.error(`Failed to copy ${label}:`, err);
  }
};

// Generate Google Maps link
export const mapsLinkGenerator = (lat: number, lng: number): string => {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};

// Check for missing required fields
export const missingDataChecker = (facility: Facility): string[] => {
  const requiredFields: string[] = [];
  
  if (!facility.name || facility.name.trim() === '') {
    requiredFields.push('name');
  }
  if (!facility.phone || facility.phone.trim() === '') {
    requiredFields.push('phone');
  }
  if (!facility.email || facility.email.trim() === '') {
    requiredFields.push('email');
  }
  if (!facility.address || facility.address.trim() === '') {
    requiredFields.push('address');
  }
  if (!facility.username || facility.username.trim() === '') {
    requiredFields.push('username');
  }
  if (!(facility as any).agentId || (facility as any).agentId.trim() === '') {
    requiredFields.push('agentId');
  }
  if (!facility.location || !facility.location.coordinates) {
    requiredFields.push('location');
  }
  if (!facility.services || !Array.isArray(facility.services) || facility.services.length === 0) {
    requiredFields.push('services');
  }
  if (!facility.openingHours || facility.openingHours.trim() === '') {
    requiredFields.push('openingHours');
  }
  if (!facility.ownership || facility.ownership.trim() === '') {
    requiredFields.push('ownership');
  }
  
  return requiredFields;
};

// Validate Agent ID format
export const validateAgentId = (value: string): boolean => {
  const agentIdRegex = /^[A-Za-z]{2}\d{3,}$/;
  return value === '' || agentIdRegex.test(value);
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 9) {
    return `+251 ${cleanPhone}`;
  }
  return phone;
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get facility type display name
export const getFacilityTypeDisplay = (type: string): string => {
  const typeMap: Record<string, string> = {
    'hospital': 'Hospital',
    'pharmacy': 'Pharmacy',
    'clinic': 'Clinic',
    'laboratory': 'Laboratory'
  };
  return typeMap[type] || 'Unknown';
};

// Get status color based on facility state
export const getStatusColor = (isActive: boolean): StatusColors => {
  return isActive 
    ? { bg: '#10b981', text: '#059669', border: '#059669' }
    : { bg: '#ef4444', text: '#dc2626', border: '#dc2626' };
};

// Get service category color
export const getServiceCategoryColor = (service: string): ServiceColors => {
  const emergencyServices = ['emergency', 'urgent care', 'trauma'];
  const medicalServices = ['surgery', 'maternity', 'pediatrics', 'cardiology'];
  const labServices = ['laboratory', 'radiology', 'pathology'];
  const pharmacyServices = ['pharmacy', 'medication', 'prescription'];
  
  const serviceLower = service.toLowerCase();
  
  if (emergencyServices.some(s => serviceLower.includes(s))) {
    return { bg: '#ef4444', text: '#ffffff' };
  }
  if (medicalServices.some(s => serviceLower.includes(s))) {
    return { bg: '#3b82f6', text: '#ffffff' };
  }
  if (labServices.some(s => serviceLower.includes(s))) {
    return { bg: '#8b5cf6', text: '#ffffff' };
  }
  if (pharmacyServices.some(s => serviceLower.includes(s))) {
    return { bg: '#10b981', text: '#ffffff' };
  }
  
  return { bg: '#6b7280', text: '#ffffff' };
};

// Format opening hours for display
export const formatOpeningHours = (hours: string): string => {
  if (!hours) return 'Not specified';
  
  // Common patterns
  const patterns: Record<string, string> = {
    '24/7': 'Open 24/7',
    '24h': 'Open 24 Hours',
    'daily': 'Daily',
    'weekdays': 'Weekdays Only',
    'weekends': 'Weekends Only'
  };
  
  const hoursLower = hours.toLowerCase();
  for (const [pattern, display] of Object.entries(patterns)) {
    if (hoursLower.includes(pattern)) {
      return display;
    }
  }
  
  return hours;
};

// Calculate facility completion percentage
export const calculateCompletionPercentage = (facility: Facility): number => {
  const totalFields = 10; // name, phone, email, address, username, agentId, location, services, openingHours, ownership
  const missingFields = missingDataChecker(facility);
  const completedFields = totalFields - missingFields.length;
  return Math.round((completedFields / totalFields) * 100);
};

// Get facility status badge
export const getFacilityStatusBadge = (facility: Facility): FacilityStatusBadge => {
  const status = facility.isActive;
  const completion = calculateCompletionPercentage(facility);
  
  return {
    status,
    completion,
    isComplete: completion === 100,
    needsAttention: completion < 50,
    isPartiallyComplete: completion > 0 && completion < 100
  };
};
