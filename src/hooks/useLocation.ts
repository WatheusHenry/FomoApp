import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { LocationRegion } from '@/types/location';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationRegion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const requestLocationPermission = async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      setError('Permissão de localização negada');
      Alert.alert(
        'Permissão Necessária',
        'O app precisa de acesso à localização.'
      );
      return false;
    }
    
    return true;
  };

  const getCurrentLocation = async (): Promise<LocationRegion | null> => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return null;

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation: LocationRegion = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      return newLocation;
    } catch (err) {
      throw new Error('Erro ao obter localização');
    }
  };

  const refreshLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 🧪 MODO TESTE: Usar coordenadas de Marília, SP
      // Descomente a linha abaixo para usar localização real
      // const newLocation = await getCurrentLocation();
      
      // Usar coordenadas de Marília, SP para teste
      const newLocation: LocationRegion = {
        latitude: -22.2139, // Marília, SP
        longitude: -49.9456, // Marília, SP
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      setLocation(newLocation);
      console.log(' Usando localização de teste (Marília, SP):', newLocation);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return {
    location,
    error,
    loading,
    refreshLocation,
  };
}; 