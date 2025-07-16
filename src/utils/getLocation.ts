import * as Location from "expo-location";

const getLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permissão de localização negada");
      return null;
    }

    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const address = await Location.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    return address[0];
  } catch (error) {
    console.error("Erro ao obter localização:", error);
    return null;
  }
};

const getCoords = async () => {
  const coords = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return coords;
};

export { getCoords, getLocation };
