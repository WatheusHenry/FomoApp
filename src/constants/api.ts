// Configurações da API
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.18.53:3000",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Endpoints da API
export const API_ENDPOINTS = {
  PLACES: {
    NEARBY: '/places/nearby',
    DETAILS: (id: string) => `/places/${id}`,
  },
  WEATHER: {
    CURRENT: '/weather/current',
    FORECAST: '/weather/forecast',
  },
} as const;

// Headers padrão
export const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
} as const; 