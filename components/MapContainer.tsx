import { fetchNearbyPlaces } from "@/utils/fetchNearbyPlaces";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { nightMapStyle } from "../const/nightMapStyle";
import UserLocationMarker from "./UserLocationMarker";

interface Props {
  location: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  selectedCategory: string | null;
}

interface Place {
  id: string;
  displayName: {
    text: string;
  };
  formattedAddress: string;
  types: string[];
  location: {
    latitude?: number;
    longitude?: number;
    latLng?: {
      latitude: number;
      longitude: number;
    };
  };
}

export default function MapContainer({ location, selectedCategory }: Props) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      try {
      const fetched = await fetchNearbyPlaces(
        location.latitude,
        location.longitude
      );
      // console.log(fetched);
      setPlaces(fetched);
      console.log(`🏪 ${fetched.length} locais carregados`);
      } catch (error) {
        console.error("❌ Erro ao carregar locais:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, [location]);

  const getCategoryFromTypes = (types: string[] = []): string => {
    const categoryMap = {
      night_club: "Festas",
      bar: "Bares",
      restaurant: "Restaurantes",
      cafe: "Cafés",
      bakery: "Padarias",
    };

    for (const [type, category] of Object.entries(categoryMap)) {
      if (types.some((t) => t.includes(type))) {
        return category;
      }
    }

    return "Outro";
  };

  const getCoordinates = (place: Place) => {
    return {
      latitude:
        place.location?.latitude || place.location?.latLng?.latitude || 0,
      longitude:
        place.location?.longitude || place.location?.latLng?.longitude || 0,
    };
  };

  const filteredPlaces =
    selectedCategory === null
      ? []
      : places.filter((place) => {
          const placeCategory = getCategoryFromTypes(place.types);
          return placeCategory.toLowerCase() === selectedCategory.toLowerCase();
        });

  // Debug: Log das categorias encontradas
  useEffect(() => {
    if (places.length > 0) {
      const categories = places.map((place) => ({
        name: place.displayName?.text,
        types: place.types,
        category: getCategoryFromTypes(place.types),
      }));

      console.log("🏷️ Categorias encontradas:", [
        ...new Set(categories.map((c) => c.category)),
      ]);
    }
  }, [places]);

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

      {filteredPlaces.map((place) => {
        const coordinates = getCoordinates(place);

        if (!coordinates.latitude || !coordinates.longitude) {
          console.warn(
            "⚠️ Local sem coordenadas válidas:",
            place.displayName?.text
          );
          return null;
        }

        return (
          <Marker
            key={place.id || `${coordinates.latitude}-${coordinates.longitude}`}
            coordinate={coordinates}
            title={place.displayName?.text || "Local sem nome"}
            description={place.formattedAddress || "Endereço não disponível"}
          />
        );
      })}
    </MapView>
  );
}
