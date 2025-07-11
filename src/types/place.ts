export interface Place {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  location?: {
    latitude: number;
    longitude: number;
    lat?: number;
    lng?: number;
  };
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  photos?: string[];
  opening_hours?: {
    open_now: boolean;
    weekday_text?: string[];
  };
  price_level?: number;
  vicinity?: string;
  formatted_phone_number?: string;
  website?: string;
}

export interface PlaceDetails extends Place {
  phone?: string;
  website?: string;
  reviews?: Review[];
  formatted_address?: string;
  international_phone_number?: string;
}

export interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: number;
} 