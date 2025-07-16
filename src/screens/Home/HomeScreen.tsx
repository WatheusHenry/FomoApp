import React, { useRef, useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";

import { useLocation } from "@/hooks/useLocation";
import { usePlaces } from "@/hooks/usePlaces";
import { useHaptics } from "@/hooks/useHaptics";
import { Place } from "@/types/place";

// Components
import MapContainer from "@/components/maps/MapContainer";
import LocationComponent from "@/components/common/Location";
import WeatherComponent from "@/components/weather/Weather";
import HomeButtons from "@/components/common/HomeButtons";
import PlaceDetailsSheet from "@/components/sheets/PlaceDetails";
import LocationError from "@/components/common/LocationError";
import LoadingScreen from "@/components/common/LoadingScreen";
import HomeList from "@/components/common/HomeList";

export default function HomeScreen() {
  const { location, error, loading, refreshLocation } = useLocation();
  const {
    places,
    loading: placesLoading,
    loadNearbyPlaces,
    refreshPlaces,
  } = usePlaces();
  const { triggerSuccess, triggerError } = useHaptics();

  const [selectedPlace, setSelectedPlace] = React.useState<Place | null>(null);

  const searchBottomSheetRef = useRef<BottomSheet>(null);
  const placeDetailsBottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (location) {
      loadNearbyPlaces(location.latitude, location.longitude);
    }
  }, [location, loadNearbyPlaces]);

  const handleOpenSearchSheet = () => {
    searchBottomSheetRef.current?.snapToIndex(1);
  };

  const handleMarkerPress = useCallback((place: Place) => {
    console.log(" Marker pressionado:", place.name);

    // Fechar o bottom sheet atual se estiver aberto
    placeDetailsBottomSheetRef.current?.close();

    // Definir o novo lugar selecionado
    setSelectedPlace(place);

    // Abrir o bottom sheet com o novo lugar
    setTimeout(() => {
      placeDetailsBottomSheetRef.current?.snapToIndex(1);
    }, 150);
  }, []);

  const handleClosePlaceDetails = useCallback(() => {
    console.log("🔒 Fechando detalhes do lugar");
    setSelectedPlace(null);
  }, []);

  const handleRefreshPlaces = () => {
    if (location) {
      refreshPlaces(location.latitude, location.longitude);
      triggerSuccess();
    }
  };

  if (loading) {
    return <LoadingScreen message="Obtendo sua localização..." />;
  }

  if (error || !location) {
    triggerError();
    return (
      <LocationError
        message={error || "Erro ao obter localização"}
        onRetry={refreshLocation}
      />
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapContainer
        location={location}
        places={places}
        onMarkerPress={handleMarkerPress}
      />

      <LocationComponent />
      <WeatherComponent />
      <HomeList
        places={places}
        loading={placesLoading}
        onRefresh={handleRefreshPlaces}
      />

      <PlaceDetailsSheet
        ref={placeDetailsBottomSheetRef}
        place={selectedPlace}
        onClose={handleClosePlaceDetails}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
