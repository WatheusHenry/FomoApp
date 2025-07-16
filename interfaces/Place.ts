interface Place {
  filter(arg0: (place: any) => any): unknown;
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
  // eslint-disable-next-line @typescript-eslint/array-type
  photos?: Array<{
    url: string;
    reference: string;
  }>;
}

export type { Place };
