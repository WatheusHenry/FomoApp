import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_BASE_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.18.53:3000";

const isDevelopment = __DEV__;

const getBackendUrl = () => {
  if (isDevelopment) {
    return process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.18.53:3000";
  }
  return BACKEND_BASE_URL;
};

const CACHE_KEY = "nearby_places_cache";
const CACHE_DURATION_MS = 5 * 60 * 1000;
// const DEFAULT_TYPES = ["night_club", "restaurant", "bar", "cafe", "bakery"];

let cachedData: any[] = [];
let cachedAt: number | null = null;
let cachedCoords: { latitude: number; longitude: number } | null = null;

interface FetchNearbyPlacesOptions {
  radius?: number;
  types?: string[];
  limit?: number;
}

interface BackendResponse {
  fromCache: boolean;
  places: any[];
  nextPageToken?: string;
}

const fetchFromBackend = async (
  latitude: number,
  longitude: number,
  options: FetchNearbyPlacesOptions = {}
): Promise<BackendResponse> => {
  const {
    radius = 15000,
    // types = DEFAULT_TYPES,
    limit = 120,
  } = options;

  const params = new URLSearchParams({
    lat: latitude.toString(),
    lng: longitude.toString(),
    radius: radius.toString(),
    // types: types.join(","),
    limit: limit.toString(),
  });

  const backendUrl = getBackendUrl();
  const fullUrl = `${backendUrl}/nearby?${params}`;

  console.log(`🌐 Fazendo requisição para: ${fullUrl}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos timeout

  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro HTTP:", response.status, errorText);
      throw new Error(`Erro na API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Resposta recebida: ${data.places?.length || 0} lugares`);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("❌ Erro na requisição:", error);
    throw error;
  }
};

// Função principal para buscar lugares próximos
export const fetchNearbyPlaces = async (
  latitude: number,
  longitude: number,
  options: FetchNearbyPlacesOptions = {}
): Promise<any[]> => {
  const now = Date.now();

  // Verifica cache existente no AsyncStorage
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
  const isCacheValid = age < CACHE_DURATION_MS;

  // Verifica se as coordenadas são muito próximas do cache existente
  const isSameLocation =
    cachedCoords &&
    Math.abs(cachedCoords.latitude - latitude) < 0.001 &&
    Math.abs(cachedCoords.longitude - longitude) < 0.001;

  // Usa cache se válido e na mesma localização
  if (isCacheValid && isSameLocation && cachedData.length > 0) {
    console.log("✅ Usando cache local");
    return cachedData;
  }

  try {
    console.log("🔄 Buscando locais via backend...");

    const result = await fetchFromBackend(latitude, longitude, options);

    cachedAt = now;
    cachedCoords = { latitude, longitude };
    cachedData = result.places || [];

    await AsyncStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ cachedAt, cachedCoords, cachedData })
    );

    console.log(
      `✅ ${result.places?.length || 0} locais encontrados ${
        result.fromCache ? "(cache backend)" : "(fresh)"
      }`
    );

    return result.places || [];
  } catch (error) {
    console.error("❌ Erro ao buscar locais:", error);

    // Retorna cache antigo em caso de erro, se disponível
    if (cachedData.length > 0) {
      console.log("⚠️ Usando cache antigo devido ao erro");
      return cachedData;
    }

    return [];
  }
};
