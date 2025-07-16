import HomeList from "@/components/HomeList";
import PlaceDetails from "@/components/sheets/PlaceDetails";
import { fetchNearbyPlaces } from "@/utils/fetchNearbyPlaces";
import BottomSheet from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LocationComponent from "../components/Location";
import LocationError from "../components/LocationError";
import MapContainer from "../components/MapContainer";

// Interface para o tipo Place
interface Place {
  id: string;
  name: string;
  address: string;
  types: string[];
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  formatted_phone_number?: string;
  website?: string;
  photos?: {
    photo_reference: string;
    width: number;
    height: number;
  }[];
}

export default function Index() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [places, setPlaces] = useState<Place[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [previousCameraState, setPreviousCameraState] = useState(null);

  const placeDetailsBottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

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

  const handleMarkerPress = (place: Place) => {
    setSelectedPlace(place);
    placeDetailsBottomSheetRef.current?.snapToIndex(1);
  };

  const handleClosePlaceDetails = () => {
    placeDetailsBottomSheetRef.current?.close();
    setSelectedPlace(null);
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

      setLocation(newLocation as any);
      setErrorMsg(null);

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
      <MapContainer
        location={location}
        places={places}
        focusedPlace={selectedPlace}
        onMarkerPress={handleMarkerPress}
        onClearFocus={() => setSelectedPlace(null)}
        onCameraStateChange={setPreviousCameraState}
        shouldResetCamera={!selectedPlace && previousCameraState}
      />
      <LocationComponent />
      <HomeList places={places} loading={loading} />

      {/* Bottom Sheet para detalhes do lugar */}
      <PlaceDetails
        ref={placeDetailsBottomSheetRef}
        place={selectedPlace}
        onClose={handleClosePlaceDetails}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});