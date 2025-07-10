// MapContainer.tsx

import React, { useState, useRef } from "react";
import { StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { nightMapStyle } from "../const/nightMapStyle";
import UserLocationMarker from "./UserLocationMarker";
import CustomMarker from "./CustomMarker";
import { Place } from "@/interfaces/Place";
import { Coordinates } from "@/interfaces/Coordinates";

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
  return {
    latitude: place.location?.lat || 0,
    longitude: place.location?.lng || 0,
  };
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const MapContainer: React.FC<Props> = ({ location, places, onMarkerPress }) => {
  const [currentZoom, setCurrentZoom] = useState(location.latitudeDelta);
  const mapRef = useRef<MapView>(null);

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentZoom(region.latitudeDelta);
  };

  const shouldShowIcon = currentZoom < ZOOM_THRESHOLD;

  const handleMarkerPress = (place: Place) => {
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
  };

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFillObject}
      region={location}
      customMapStyle={nightMapStyle}
      minZoomLevel={MIN_ZOOM_LEVEL}
      onRegionChangeComplete={handleRegionChangeComplete}
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
