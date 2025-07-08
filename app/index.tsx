import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import * as Location from "expo-location";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LocationComponent from "../components/Location";
import WheaterComponent from "../components/Wheater";
import MapContainer from "../components/MapContainer";
import LocationError from "../components/LocationError";
import HomeButtons from "@/components/HomeButtons";
import SearchPlaces from "@/components/sheets/SearchPlaces";
import BottomSheet from "@gorhom/bottom-sheet";
import { fetchNearbyPlaces } from "@/utils/fetchNearbyPlaces";

// Interface para o tipo Place
interface Place {
  id: string;
  name: string;
  address: string;
  types: string[];
  location: {
    lng: number;
    lat: number;
  };
}

export default function Index() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado compartilhado para os lugares
  const [places, setPlaces] = useState<Place[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Função para buscar lugares próximos
  const loadNearbyPlaces = async (lat: number, lng: number) => {
    try {
      setPlacesLoading(true);
      const fetchedPlaces = await fetchNearbyPlaces(lat, lng);
      setPlaces(fetchedPlaces);
    } catch (error) {
      console.error("❌ Erro ao carregar locais:", error);
    } finally {
      setPlacesLoading(false);
    }
  };

  const handleOpenSearchSheet = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão de localização negada");
        Alert.alert(
          "Permissão Necessária",
          "O app precisa de acesso à localização."
        );
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(newLocation);
      setErrorMsg(null);

      // Carregar lugares próximos após obter a localização
      await loadNearbyPlaces(coords.latitude, coords.longitude);
    } catch (err) {
      setErrorMsg("Erro ao obter localização.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Obtendo sua localização...</Text>
      </View>
    );
  }

  if (errorMsg || !location) {
    return (
      <LocationError message={errorMsg || ""} onRetry={getCurrentLocation} />
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Passa os lugares como props */}
      <MapContainer location={location} places={places} />
      <LocationComponent />
      <WheaterComponent />

      <HomeButtons onSearchPress={handleOpenSearchSheet} />

      {/* Passa os lugares e estados para o SearchPlaces */}
      <SearchPlaces
        ref={bottomSheetRef}
        places={places}
        loading={placesLoading}
        onRefresh={() =>
          loadNearbyPlaces(location.latitude, location.longitude)
        }
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
