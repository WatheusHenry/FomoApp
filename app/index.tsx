import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import * as Location from "expo-location";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import MapContainer from "../components/MapContainer";
import LocationError from "../components/LocationError";
import MainBottomSheet from "../components/sheets/MainBottomSheet";
import CategoryPills from "@/components/CategoryPills";

export default function Index() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

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

      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setErrorMsg(null);
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
      <MapContainer location={location} selectedCategory={selectedCategory} />
      <CategoryPills
        onSelect={setSelectedCategory}
        selected={selectedCategory}
      />
      <MainBottomSheet />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  pillsContainer: {
    position: "absolute",
    bottom: "15%",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },

  pill: {
    backgroundColor: "#3F444B",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  pillText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Onest",
  },
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
