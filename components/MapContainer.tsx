import { fetchNearbyPlaces } from "@/utils/fetchNearbyPlaces";
import React, { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
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
  const [currentZoom, setCurrentZoom] = useState(location.latitudeDelta);

  // Definir o limiar de zoom (ajuste conforme necessário)
  const ZOOM_THRESHOLD = 0.01; // Quanto menor o valor, mais "zoom in"

  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      try {
        const fetched = await fetchNearbyPlaces(
          location.latitude,
          location.longitude
        );
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

  const getCoordinates = (place: Place) => {
    return {
      latitude:
        place.location?.latitude || place.location?.latLng?.latitude || 0,
      longitude:
        place.location?.longitude || place.location?.latLng?.longitude || 0,
    };
  };

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentZoom(region.latitudeDelta);
    console.log("🔍 Zoom level:", region.latitudeDelta);
  };

  const renderMarkerContent = (place: Place) => {
    const isZoomedOut = currentZoom > ZOOM_THRESHOLD;

    if (isZoomedOut) {
      // Renderizar apenas bolinha quando zoom out
      return (
        <View style={styles.dotMarker}>
          <View style={styles.dot} />
        </View>
      );
    } else {
      // Renderizar ícone completo quando zoom in
      return (
        <View style={styles.fullMarker}>
          <Image
            source={require("../assets/icons/Fire.png")}
            style={styles.markerIcon}
          />
          <Text style={styles.markerText}>
            {place.displayName?.text || "Local sem nome"}
          </Text>
        </View>
      );
    }
  };

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFillObject}
      region={location}
      customMapStyle={nightMapStyle}
      minZoomLevel={13}
      onRegionChangeComplete={handleRegionChangeComplete}
    >
      <UserLocationMarker
        latitude={location.latitude}
        longitude={location.longitude}
      />

      {places.map((place) => {
        const coordinates = getCoordinates(place);

        return (
          <Marker
            tracksViewChanges={true}
            key={place.id}
            anchor={{ x: 0.5, y: 0.5 }}
            coordinate={coordinates}
            title={place.displayName?.text || "Local sem nome"}
            description={place.formattedAddress || "Endereço não disponível"}
          >
            {renderMarkerContent(place)}
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  fullMarker: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 120,
    alignContent: "center",
    justifyContent: "center",
  },
  markerIcon: {
    width: 31,
    height: 35,
  },
  markerText: {
    color: "#fff",
    fontWeight: "600",
    flexWrap: "wrap",
    fontSize: 12,
    // textAlign: "center",
  },
  dotMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF6B6B", // Cor da bolinha (ajuste conforme seu tema)
    borderWidth: 2,
    borderColor: "#fff",
  },
});
