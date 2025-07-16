import { Coordinates } from "@/interfaces/Coordinates";
import { Place } from "@/interfaces/Place";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Camera, PROVIDER_GOOGLE, Region } from "react-native-maps";
import CustomMarker from "./CustomMarker";
import UserLocationMarker from "./UserLocationMarker";

interface Props {
  location: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  places: Place[];
  focusedPlace: Place | null;
  onMarkerPress?: (place: Place) => void;
  onClearFocus: () => void;
  onCameraStateChange?: (state: any) => void;
  shouldResetCamera?: boolean;
}

// =============================================
// CONSTANTES DO MAPA
// =============================================
const ZOOM_THRESHOLD = 0.05;
const ZOOM_ANIMATION_DURATION = 1000;
const ROTATION_SPEED = 1;

// =============================================
// FUNÇÕES UTILITÁRIAS DO MAPA
// =============================================
const getCoordinates = (place: Place): Coordinates => {
  return {
    latitude: place.location?.lat || 0,
    longitude: place.location?.lng || 0,
  };
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const MapContainer: React.FC<Props> = ({
  location,
  places,
  focusedPlace,
  onMarkerPress,
  onClearFocus,
  onCameraStateChange,
  shouldResetCamera,
}) => {
  const [currentZoom, setCurrentZoom] = useState(location.latitudeDelta);
  const [heading, setHeading] = useState(0);
  const [originalCameraState, setOriginalCameraState] = useState(null);
  const mapRef = useRef<MapView>(null);
  const rotationIntervalRef = useRef<any | null>(null);
  const shouldShowIcon = currentZoom < ZOOM_THRESHOLD;

  // Salva o estado original da câmera quando não há lugar focado
  useEffect(() => {
    if (!focusedPlace && !originalCameraState) {
      setOriginalCameraState({
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        pitch: 0,
        heading: 0,
        zoom: 15, // Zoom padrão
      });
    }
  }, [location, focusedPlace, originalCameraState]);

  // Reseta a câmera quando shouldResetCamera é true
  useEffect(() => {
    if (shouldResetCamera && originalCameraState) {
      stopRotation();
      setHeading(0);

      mapRef.current?.animateCamera(originalCameraState, {
        duration: ZOOM_ANIMATION_DURATION,
      });

      // Notifica o componente pai sobre a mudança
      if (onCameraStateChange) {
        onCameraStateChange(null);
      }
    }
  }, [shouldResetCamera, originalCameraState, onCameraStateChange]);

  useEffect(() => {
    stopRotation();

    if (focusedPlace) {
      const coordinates = getCoordinates(focusedPlace);

      // Salva o estado atual da câmera antes de focar no lugar
      if (onCameraStateChange && !originalCameraState) {
        const currentState = {
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          pitch: 0,
          heading: 0,
          zoom: 15,
        };
        setOriginalCameraState(currentState);
        onCameraStateChange(currentState);
      }

      const initialCamera: Camera = {
        center: {
          latitude: coordinates.latitude - 1,
          longitude: coordinates.longitude - 1,
        },
        pitch: 60,
        heading: heading,
        zoom: 19,
      };

      mapRef.current?.animateCamera(initialCamera, {
        duration: ZOOM_ANIMATION_DURATION,
      });

      rotationIntervalRef.current = setInterval(() => {
        setHeading((prevHeading) => {
          const newHeading = (prevHeading + ROTATION_SPEED) % 360;
          const camera: Camera = {
            center: {
              latitude: coordinates.latitude ,
              longitude: coordinates.longitude,
            },
            pitch: 60,
            heading: newHeading,
            zoom: 19,
          };
          mapRef.current?.animateCamera(camera, { duration: 50 });
          return newHeading;
        });
      }, 50);
    }

    return () => {
      stopRotation();
    };
  }, [focusedPlace]);

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentZoom(region.latitudeDelta);
  };

  const handlePanDrag = () => {
    stopRotation();
    onClearFocus();
  };

  // Função para parar a rotação
  const stopRotation = () => {
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current);
      rotationIntervalRef.current = null;
    }
  };

  const handleMarkerPress = (place: Place) => {
    const coordinates = getCoordinates(place);

    if (coordinates.latitude && coordinates.longitude) {
      const camera = {
        center: {
          latitude: coordinates.latitude -1,
          longitude: coordinates.longitude ,
        },
        pitch: 70,
        heading: 0,
        zoom: 20,
      };

      // Anima a câmera para a nova perspectiva
      mapRef.current?.animateCamera(camera, {
        duration: ZOOM_ANIMATION_DURATION,
      });
    }

    if (onMarkerPress) {
      onMarkerPress(place);
    }
  };

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFillObject}
      region={location}
      pitchEnabled={true}
      onRegionChangeComplete={handleRegionChangeComplete}
      onPanDrag={handlePanDrag}
    >
      <UserLocationMarker
        latitude={location.latitude}
        longitude={location.longitude}
      />

      {places.map((place) => {
        const coordinates = getCoordinates(place);
        if (!coordinates.latitude || !coordinates.longitude) return null;

        return (
          <CustomMarker
            key={place.id}
            place={place}
            shouldShowIcon={shouldShowIcon}
            coordinates={coordinates}
            onPress={() => handleMarkerPress(place)}
          />
        );
      })}
    </MapView>
  );
};

export default MapContainer;
