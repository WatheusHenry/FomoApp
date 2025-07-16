export interface LocationRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface LocationAddress {
  street?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  name?: string;
} 