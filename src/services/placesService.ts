import { Place, PlaceDetails } from '@/types/place';
import { API_CONFIG, API_ENDPOINTS, DEFAULT_HEADERS } from '@/constants/api';

export const fetchNearbyPlaces = async (latitude: number, longitude: number): Promise<Place[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PLACES.NEARBY}?lat=${latitude}&lng=${longitude}`,
      {
        method: 'GET',
        headers: DEFAULT_HEADERS,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao buscar lugares:', response.status, errorText);
      throw new Error(`Erro: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('❌ Erro de rede ao buscar lugares:', error);
    throw error;
  }
};

export const fetchPlaceDetails = async (placeId: string): Promise<PlaceDetails> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PLACES.DETAILS(placeId)}`,
      {
        method: 'GET',
        headers: DEFAULT_HEADERS,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao buscar detalhes:', response.status, errorText);
      throw new Error(`Erro: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('❌ Erro de rede ao buscar detalhes:', error);
    throw error;
  }
}; 