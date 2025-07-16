import { Platform } from 'react-native';

// Configurações do ambiente
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
} as const;

// Configurações da plataforma
export const PLATFORM = {
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android',
  IS_WEB: Platform.OS === 'web',
} as const;

// Configurações de localização
export const LOCATION_CONFIG = {
  ACCURACY: 'high' as const,
  TIMEOUT: 15000,
  MAX_AGE: 10000,
  DISTANCE_FILTER: 10,
} as const;

// Configurações do mapa
export const MAP_CONFIG = {
  INITIAL_ZOOM: 15,
  MIN_ZOOM: 10,
  MAX_ZOOM: 20,
  ANIMATION_DURATION: 300,
} as const;

// Configurações de cache
export const CACHE_CONFIG = {
  PLACES_TTL: 5 * 60 * 1000, // 5 minutos
  WEATHER_TTL: 10 * 60 * 1000, // 10 minutos
  MAX_CACHE_SIZE: 50,
} as const;

// Configurações de performance
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 200,
  THROTTLE_DELAY: 100,
  ANIMATION_DURATION: 200,
} as const; 