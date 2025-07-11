// MapContainer.tsx

import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { nightMapStyle } from "@/constants/nightMapStyle";
import UserLocationMarker from "./UserLocationMarker";
import CustomMarker from "./CustomMarker";
import type { Place } from "@/types/place";
import type { Coordinates } from "@/constants/places";
import { useHaptics } from "@/hooks/useHaptics";
import BottomShadow from "@/components/common/BottomShadow";

interface Props {
  location: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  places: Place[];
  onMarkerPress?: (place: Place) => void;
}

// =============================================
// CONSTANTES DO MAPA
// =============================================
const ZOOM_THRESHOLD = 0.05;
const MIN_ZOOM_LEVEL = 13;
const MARKER_ZOOM_DELTA = 0.005;
const ZOOM_ANIMATION_DURATION = 500;
const MARKER_VERTICAL_OFFSET = 0.002;

// =============================================
// FUNÇÕES UTILITÁRIAS DO MAPA
// =============================================
const getCoordinates = (place: Place): Coordinates => {
  // Corrigido para usar latitude/longitude direto ou location.lat/lng
  return {
    latitude: place.latitude || place.location?.lat || place.location?.latitude || 0,
    longitude: place.longitude || place.location?.lng || place.location?.longitude || 0,
  };
};

// Função para verificar se um marker está em foco (centralizado)
const isMarkerInFocus = (
  markerCoords: Coordinates, 
  mapCenter: { latitude: number; longitude: number },
  currentZoom: number
): boolean => {
  // Calcula a distância em graus
  const latDiff = Math.abs(markerCoords.latitude - mapCenter.latitude);
  const lonDiff = Math.abs(markerCoords.longitude - mapCenter.longitude);
  
  // Threshold mais restritivo - 15% do zoom atual para garantir apenas um marker
  const threshold = currentZoom * 0.15;
  
  return latDiff < threshold && lonDiff < threshold;
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const MapContainer: React.FC<Props> = ({ location, places, onMarkerPress }) => {
  const [currentZoom, setCurrentZoom] = useState(location.latitudeDelta);
  const [mapCenter, setMapCenter] = useState({
    latitude: location.latitude,
    longitude: location.longitude,
  });
  const [stableMapCenter, setStableMapCenter] = useState({
    latitude: location.latitude,
    longitude: location.longitude,
  });
  const mapRef = useRef<MapView>(null);
  const debounceRef = useRef<any>(null);
  const focusTimeoutRef = useRef<any>(null);
  const { triggerMarkerPress } = useHaptics();

  // Cleanup do timeout quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []);

  const shouldShowIcon = currentZoom < ZOOM_THRESHOLD;

  // Função para calcular a distância do marker ao centro
  const getDistanceToCenter = useCallback((coordinates: Coordinates): number => {
    const latDiff = Math.abs(coordinates.latitude - stableMapCenter.latitude);
    const lonDiff = Math.abs(coordinates.longitude - stableMapCenter.longitude);
    return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
  }, [stableMapCenter.latitude, stableMapCenter.longitude]);

  // Encontra o marker mais próximo do centro que está dentro do range de foco
  const getFocusedMarker = useCallback((): string | null => {
    // Primeiro, encontra todos os markers dentro do range
    const markersInRange: Array<{id: string, distance: number}> = [];

    places.forEach((place) => {
      const coordinates = getCoordinates(place);
      if (coordinates.latitude && coordinates.longitude) {
        const isInRange = isMarkerInFocus(coordinates, stableMapCenter, currentZoom);
        if (isInRange) {
          const distance = getDistanceToCenter(coordinates);
          markersInRange.push({ id: place.id, distance });
        }
      }
    });

    // Se não há markers no range, retorna null (limpa o foco)
    if (markersInRange.length === 0) {
      return null;
    }

    // Se há apenas um marker no range, seleciona ele
    if (markersInRange.length === 1) {
      return markersInRange[0].id;
    }
    
    // Se há múltiplos markers, seleciona o mais próximo
    if (markersInRange.length > 1) {
      markersInRange.sort((a, b) => a.distance - b.distance);
      return markersInRange[0].id;
    }

    return null;
  }, [places, stableMapCenter, currentZoom, getDistanceToCenter]);

  const handleRegionChangeComplete = useCallback((region: Region) => {
    setCurrentZoom(region.latitudeDelta);
    setMapCenter({
      latitude: region.latitude,
      longitude: region.longitude,
    });
    setStableMapCenter({
      latitude: region.latitude,
      longitude: region.longitude,
    });

    // Limpa o debounce quando o usuário para de arrastar
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    
    // Limpa o timeout de foco quando o usuário para de arrastar
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
      focusTimeoutRef.current = null;
    }
  }, []);

  // Atualiza o foco em tempo real enquanto o usuário arrasta
  const handleRegionChange = useCallback((region: Region) => {
    setMapCenter({
      latitude: region.latitude,
      longitude: region.longitude,
    });

    // Debounce para estabilizar o foco - só atualiza após 10ms de pausa
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setStableMapCenter({
        latitude: region.latitude,
        longitude: region.longitude,
      });
      
      // Força uma limpeza do foco após movimento
      setTimeout(() => {
        const currentFocused = getFocusedMarker();
        if (!currentFocused) {
          // Se não há marker focado, força uma re-renderização
          setStableMapCenter(prev => ({ ...prev }));
        }
      }, 50);
    }, 10);
  }, [getFocusedMarker]);

  const handleMarkerPress = useCallback((place: Place) => {
    // 🔥 Trigger haptic feedback
    triggerMarkerPress();
    
    const coordinates = getCoordinates(place);

    if (coordinates.latitude && coordinates.longitude) {
      const newRegion: Region = {
        latitude: coordinates.latitude - MARKER_VERTICAL_OFFSET,
        longitude: coordinates.longitude + 0.0001,
        latitudeDelta: MARKER_ZOOM_DELTA,
        longitudeDelta: MARKER_ZOOM_DELTA,
      };
      mapRef.current?.animateToRegion(newRegion, ZOOM_ANIMATION_DURATION);
    }

    if (onMarkerPress) {
      onMarkerPress(place);
    }
  }, [triggerMarkerPress, onMarkerPress]);

  // Usa useMemo para otimizar a performance - só recalcula quando mapCenter ou currentZoom mudam
  const focusedMarkerId = useMemo(() => {
    const newFocusedId = getFocusedMarker();
    
    // Se não há marker focado, inicia um timeout para limpar completamente
    if (!newFocusedId) {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      
      focusTimeoutRef.current = setTimeout(() => {
        // Força uma re-renderização para limpar o foco
        setStableMapCenter(prev => ({ ...prev }));
      }, 200); // 200ms de delay para limpar o foco
    } else {
      // Se há marker focado, limpa o timeout
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
        focusTimeoutRef.current = null;
      }
    }
    
    return newFocusedId;
  }, [getFocusedMarker]);

  // Memoiza os markers para evitar re-renders desnecessários
  const renderedMarkers = useMemo(() => {
    return places.map((place) => {
      const coordinates = getCoordinates(place);
      
      if (!coordinates.latitude || !coordinates.longitude) {
        return null;
      }

      // Verifica se este é o marker mais próximo do centro
      const isFocused = focusedMarkerId === place.id;

      return (
        <CustomMarker
          key={place.id}
          place={place}
          shouldShowIcon={shouldShowIcon}
          coordinates={coordinates}
          onPress={() => handleMarkerPress(place)}
          isFocused={isFocused}
        />
      );
    });
  }, [places, focusedMarkerId, shouldShowIcon, handleMarkerPress]);

  return (
    <>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        region={location}
        customMapStyle={nightMapStyle}
        minZoomLevel={MIN_ZOOM_LEVEL}
        onRegionChangeComplete={handleRegionChangeComplete}
        onRegionChange={handleRegionChange}
      >
        <UserLocationMarker
          latitude={location.latitude}
          longitude={location.longitude}
        />

        {renderedMarkers}
      </MapView>
      <BottomShadow />
    </>
  );
};

export default MapContainer;

