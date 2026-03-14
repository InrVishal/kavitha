export type Role = 'CITIZEN' | 'VOLUNTEER' | 'AUTHORITY' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  region: string;
  phone?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  latitude: number;
  longitude: number;
  region: string;
  status: string;
  affected: number;
  rescued: number;
  reportedBy: string;
  user?: { name: string; region?: string };
  createdAt: string;
  updatedAt: string;
}

export interface HelpRequest {
  id: string;
  type: string;
  description: string;
  urgency: string;
  latitude: number;
  longitude: number;
  region: string;
  peopleCount: number;
  contact?: string;
  landmark?: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  assignedTo?: string;
  requestedBy: string;
  user?: { name: string; phone?: string; region?: string };
  createdAt: string;
  updatedAt: string;
}

export interface Volunteer {
  id: string;
  userId: string;
  skills: string[];
  status: 'AVAILABLE' | 'DEPLOYED' | 'OFFLINE';
  latitude?: number;
  longitude?: number;
  region: string;
  user?: { name: string; email: string; phone?: string; region?: string };
  createdAt: string;
  updatedAt: string;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
  region: string;
  capacity: number;
  occupancy: number;
  amenities: string[];
  contact?: string;
  status: string;
}

export interface Resource {
  id: string;
  name: string;
  category: string;
  icon?: string;
  needed: number;
  pledged: number;
  region: string;
  postedBy: string;
  status: string;
}

export interface DamageReport {
  id: string;
  type: string;
  severity: 'MINOR' | 'MODERATE' | 'SEVERE' | 'CATASTROPHIC';
  description: string;
  latitude: number;
  longitude: number;
  region: string;
  photoUrl?: string;
  reportedBy: string;
  user?: { name: string };
  status: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: string;
  severity: string;
  region: string;
  active: boolean;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  phone?: string;
  relation?: string;
}

export interface SafetyStatus {
  id: string;
  userId: string;
  isSafe: boolean;
  latitude?: number;
  longitude?: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  wind: number;
  description: string;
  icon: string;
  feels_like: number;
  pressure: number;
  visibility: number;
  alerts?: { event: string; description: string }[];
}

export interface RiskData {
  region: string;
  generatedAt: string;
  risks: {
    type: string;
    label: string;
    score: number;
    trend: string;
    prediction: string;
    timeline: { hour: number; risk: number }[];
  }[];
  satellite: {
    lastUpdate: string;
    cloudCover: number;
    surfaceTemp: number;
    precipitation: number;
    windSpeed: number;
  };
}

export interface AdminDashboard {
  metrics: {
    activeIncidents: number;
    totalHelpRequests: number;
    pendingHelpRequests: number;
    totalVolunteers: number;
    availableVolunteers: number;
    totalResources: number;
    totalShelters: number;
    totalDamageReports: number;
  };
  recentHelpRequests: HelpRequest[];
}
