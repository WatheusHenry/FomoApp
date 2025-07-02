import React, { useEffect, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet } from "react-native";
import { nightMapStyle } from "../const/nightMapStyle";
import UserLocationMarker from "./UserLocationMarker";
import { fetchNearbyPlaces } from "@/utils/fetchNearbyPlaces";

interface Props {
  location: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  selectedCategory: string | null;
}

export default function MapContainer({ location, selectedCategory }: Props) {
  const [places, setPlaces] = useState<any[]>([]);

  useEffect(() => {
    const loadPlaces = async () => {
      const fetched = await fetchNearbyPlaces(
        location.latitude,
        location.longitude
      );
      setPlaces(fetched);
    };

    loadPlaces();
  }, [location]);

  const getLabelFromType = (type: string) => {
    if (type.includes("bar")) return "Bares";
    if (type.includes("restaurant")) return "Restaurantes";
    if (type.includes("night_club")) return "Festas";
    return "Outro";
  };

  const filteredPlaces =
    selectedCategory === null
      ? []
      : places.filter(
          (place) =>
            getLabelFromType(place.types?.[0] || "").toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFillObject}
      region={location}
      customMapStyle={nightMapStyle}
    >
      <UserLocationMarker
        latitude={location.latitude}
        longitude={location.longitude}
      />

      {filteredPlaces.map((place, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: place.location.latitude,
            longitude: place.location.longitude,
          }}
          title={place.displayName?.text}
          description={place.formattedAddress}
        />
      ))}
    </MapView>
  );
}
