import { useState, useCallback } from 'react';
import { Place } from '@/types/place';
import { fetchNearbyPlaces } from '@/services/placesService';
import { MOCK_PLACES } from '@/utils/mockData';

export const usePlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNearbyPlaces = useCallback(async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // 🧪 MODO TESTE: Usar dados mockados
      // Descomente a linha abaixo para usar dados reais da API
      // const fetchedPlaces = await fetchNearbyPlaces(latitude, longitude);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usar dados mockados
      setPlaces(MOCK_PLACES);
      console.log('🧪 Usando dados mockados para teste:', MOCK_PLACES.length, 'lugares');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar lugares';
      setError(errorMessage);
      console.error('❌ Erro ao carregar locais:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPlaces = useCallback((latitude: number, longitude: number) => {
    return loadNearbyPlaces(latitude, longitude);
  }, [loadNearbyPlaces]);

  const clearPlaces = useCallback(() => {
    setPlaces([]);
    setError(null);
  }, []);

  return {
    places,
    loading,
    error,
    loadNearbyPlaces,
    refreshPlaces,
    clearPlaces,
  };
}; 