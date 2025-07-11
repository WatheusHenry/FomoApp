// Interface principal para Place
export interface Place {
  id: string;
  name: string;
  address: string;
  types: string[];
  location: {
    latitude?: number;
    longitude?: number;
    lat?: number;
    lng?: number;
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
  photos?: Array<{
    photo_reference: string;
    width: number;
    height: number;
  }>;
}

// Interface para coordenadas
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Interface para localização com delta
export interface LocationRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Mapeamento de tipos para ícones
export const TYPE_ICON_MAP: { [key: string]: any } = {
  // Alimentação
  restaurant: require("../assets/icons/Restaurant.png"),
  meal_takeaway: require("../assets/icons/Restaurant.png"),
  food: require("../assets/icons/Restaurant.png"),
  bakery: require("../assets/icons/Restaurant.png"),
  cafe: require("../assets/icons/Restaurant.png"),

  // Entretenimento
  bar: require("../assets/icons/Bar.png"),
  movie_theater: require("../assets/icons/Party.png"),
  night_club: require("../assets/icons/Party.png"),
};

// Traduções de tipos para português
export const TYPE_TRANSLATIONS: { [key: string]: string } = {
  restaurant: "Restaurante",
  meal_takeaway: "Comida para Viagem",
  food: "Alimentação",
  bakery: "Padaria",
  cafe: "Café",
  bar: "Bar",
  movie_theater: "Cinema",
  night_club: "Balada",
  tourist_attraction: "Atração Turística",
  lodging: "Hospedagem",
  gas_station: "Posto de Gasolina",
  hospital: "Hospital",
  pharmacy: "Farmácia",
  bank: "Banco",
  atm: "Caixa Eletrônico",
  shopping_mall: "Shopping",
  store: "Loja",
  point_of_interest: "Ponto de Interesse",
  establishment: "Estabelecimento",
  premise: "Local",
};

// Tipos de lugares suportados
export const PLACE_TYPES = {
  RESTAURANT: 'restaurant',
  BAR: 'bar',
  CAFE: 'cafe',
  NIGHT_CLUB: 'night_club',
  PARTY: 'party',
  ENTERTAINMENT: 'entertainment',
} as const;

// Ícones para cada tipo de lugar
export const PLACE_ICONS = {
  [PLACE_TYPES.RESTAURANT]: '🍽️',
  [PLACE_TYPES.BAR]: '🍺',
  [PLACE_TYPES.CAFE]: '☕',
  [PLACE_TYPES.NIGHT_CLUB]: '🎵',
  [PLACE_TYPES.PARTY]: '🎉',
  [PLACE_TYPES.ENTERTAINMENT]: '🎮',
} as const;

// Configurações de busca
export const SEARCH_CONFIG = {
  DEFAULT_RADIUS: 1000, // metros
  MAX_RADIUS: 5000,
  MIN_RADIUS: 100,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
} as const;

// Filtros de preço
export const PRICE_LEVELS = {
  FREE: 0,
  INEXPENSIVE: 1,
  MODERATE: 2,
  EXPENSIVE: 3,
  VERY_EXPENSIVE: 4,
} as const;
