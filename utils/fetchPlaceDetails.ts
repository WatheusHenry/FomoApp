// utils/fetchPlaceDetails.ts

const BACKEND_BASE_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.18.53:3000";

export const fetchPlaceDetails = async (placeId: string) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/places/${placeId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro ao buscar detalhes:", response.status, errorText);
      throw new Error(`Erro: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data; // contém os detalhes do lugar
  } catch (error) {
    console.error("❌ Erro de rede ao buscar detalhes:", error);
    throw error;
  }
  
};
