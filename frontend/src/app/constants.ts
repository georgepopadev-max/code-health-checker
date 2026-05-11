// Mock mode toggle - set to true to use mock data instead of real API
export const USE_MOCK_DATA = false;

// API Configuration
export const API_CONFIG = {
  timeoutMs: 5000,
  baseUrl: '/api'
};

// Theme colors - Indigo based
export const THEME = {
  primary: '#4f46e5',
  primaryHover: '#4338ca',
  primaryLight: '#eef2ff',
  
  // Semantic colors
  success: '#22c55e',
  successLight: '#dcfce7',
  successDark: '#166534',
  
  warning: '#eab308',
  warningLight: '#fef9c3',
  warningDark: '#854d0e',
  
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  dangerDark: '#991b1b',
  
  // Neutrals
  background: '#f5f7fa',
  surface: '#ffffff',
  border: '#e5e7eb',
  textPrimary: '#1a1a2e',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af'
} as const;