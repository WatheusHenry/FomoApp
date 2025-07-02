import haversine from "haversine-distance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const CACHE_KEY = "nearby_places_cache";
const CACHE_DURATION_MS = 5 * 60 * 10000;
const MAX_DISTANCE_METERS = 100000;

let cachedData: any[] = [];
let cachedAt: number | null = null;
let cachedCoords: { latitude: number; longitude: number } | null = null;

export const fetchNearbyPlaces = async (
  latitude: number,
  longitude: number
): Promise<any[]> => {
  const now = Date.now();

  if (!cachedAt || !cachedCoords || cachedData.length === 0) {
    try {
      const cachedString = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedString) {
        const parsed = JSON.parse(cachedString);
        cachedAt = parsed.cachedAt;
        cachedCoords = parsed.cachedCoords;
        cachedData = parsed.cachedData;
        console.log("💾 Cache carregado do AsyncStorage");
      }
    } catch (err) {
      console.warn("⚠️ Falha ao carregar cache:", err);
    }
  }

  const age = now - (cachedAt || 0);
  const distance = cachedCoords
    ? haversine(cachedCoords, { latitude, longitude })
    : Infinity;

  const isCacheValid =
    age < CACHE_DURATION_MS && distance < MAX_DISTANCE_METERS;

  if (isCacheValid) {
    console.log("✅ Usando cache local");
    return cachedData;
  }

  if (!GOOGLE_API_KEY) {
    console.error("❌ GOOGLE_API_KEY não está configurada");
    return [];
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const requestBody = {
    includedTypes: ["bar", "restaurant", "night_club"],
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: { latitude, longitude },
        radius: 20000,
      },
    },
  };

  try {
    console.log("🔄 Buscando locais na API do Google");

    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.types,places.location,places.primaryType,places.primaryTypeDisplayName",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.text();
        console.error("❌ Corpo do erro:", errorBody);
      } catch (e) {
        console.error("❌ Não foi possível ler o corpo do erro:", e);
      }
      throw new Error(`Erro ${response.status}`);
    }

    const data = await response.json();
    const results = data.places || [];

    cachedAt = now;
    cachedCoords = { latitude, longitude };
    cachedData = results;

    await AsyncStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ cachedAt, cachedCoords, cachedData })
    );

    console.log("💾 Cache salvo no AsyncStorage");
    return results;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      console.error("❌ Timeout na requisição");
    } else {
      console.error("❌ Erro ao buscar locais:", error);
    }
    return [];
  }
};
