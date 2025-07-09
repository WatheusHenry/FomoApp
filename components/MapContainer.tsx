import React, { useEffect, useState, useRef } from "react";
import { Image, StyleSheet, View, Animated } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { nightMapStyle } from "../const/nightMapStyle";
import UserLocationMarker from "./UserLocationMarker";

// =============================================
// TYPES & INTERFACES
// =============================================
interface Props {
  location: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  places: Place[];
  onMarkerPress?: (place: Place) => void;
}

interface Place {
  id: string;
  name: string;
  address: string;
  types: string[];
  location: {
    lng: number;
    lat: number;
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

interface Coordinates {
  latitude: number;
  longitude: number;
}

// =============================================
// CONSTANTS
// =============================================
const ZOOM_THRESHOLD = 0.05;
const ANIMATION_DURATION = 200;
const BOUNCE_DURATION = 300;
const MIN_ZOOM_LEVEL = 13;

const MARKER_ZOOM_DELTA = 0.005;
const ZOOM_ANIMATION_DURATION = 500;
const MARKER_VERTICAL_OFFSET = 0.002;

const TYPE_ICON_MAP: { [key: string]: any } = {
  restaurant: require("../assets/icons/Restaurant.png"),
  meal_takeaway: require("../assets/icons/Restaurant.png"),
  food: require("../assets/icons/Restaurant.png"),
  bakery: require("../assets/icons/Restaurant.png"),
  cafe: require("../assets/icons/Restaurant.png"),
  bar: require("../assets/icons/Bar.png"),
  movie_theater: require("../assets/icons/Party.png"),
  night_club: require("../assets/icons/Party.png"),
};

// =============================================
// UTILITY FUNCTIONS
// =============================================
const getMarkerIcon = (placeTypes: string[]) => {
  for (const type of placeTypes) {
    if (TYPE_ICON_MAP[type]) {
      return TYPE_ICON_MAP[type];
    }
  }

  console.log("⚠️ No matching type found, using default restaurant icon");
  return require("../assets/icons/Restaurant.png");
};

const getCoordinates = (place: Place): Coordinates => {
  return {
    latitude: place.location?.lat || 0,
    longitude: place.location?.lng || 0,
  };
};

// =============================================
// COMPONENTS
// =============================================
interface SmoothAnimatedMarkerProps {
  place: Place;
  shouldShowIcon: boolean;
  coordinates: Coordinates;
  onPress?: () => void;
}

const SmoothAnimatedMarker: React.FC<SmoothAnimatedMarkerProps> = ({
  place,
  shouldShowIcon,
  coordinates,
  onPress,
}) => {
  const iconOpacity = useRef(
    new Animated.Value(shouldShowIcon ? 1 : 0)
  ).current;
  const dotOpacity = useRef(new Animated.Value(shouldShowIcon ? 0 : 1)).current;

  const bounceAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // CORREÇÃO: Estado para controlar a performance do marcador
  const [isTracking, setIsTracking] = useState(true);

  useEffect(() => {
    // Ativa o rastreamento antes de iniciar a animação
    setIsTracking(true);
    const animations = shouldShowIcon
      ? [
          Animated.timing(iconOpacity, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity, {
            toValue: 0,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          }),
        ]
      : [
          Animated.timing(iconOpacity, {
            toValue: 0,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          }),
        ];

    Animated.parallel(animations).start(() => {
      // Desativa o rastreamento QUANDO a animação termina para melhorar a performance
      setIsTracking(false);
    });
  }, [shouldShowIcon, iconOpacity, dotOpacity]);

  const handlePress = () => {
    const bounceSequence = Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.3,
        duration: BOUNCE_DURATION / 2,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: BOUNCE_DURATION / 2,
        useNativeDriver: true,
      }),
    ]);

    const scaleSequence = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]);

    const pulseSequence = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]);

    if (shouldShowIcon) {
      Animated.parallel([bounceSequence, scaleSequence]).start();
    } else {
      pulseSequence.start();
    }

    if (onPress) {
      onPress();
    }
  };

  const markerIcon = getMarkerIcon(place.types);

  return (
    <Marker
      // CORREÇÃO: Propriedade controlada pelo estado para otimização
      tracksViewChanges={isTracking}
      key={place.id}
      anchor={{ x: 0.1, y: 0.1 }}
      coordinate={coordinates}
      onPress={handlePress}
    >
      <View style={styles.markerContainer}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: iconOpacity,
              transform: [{ scale: Animated.multiply(bounceAnim, scaleAnim) }],
            },
          ]}
        >
          <Image source={markerIcon} style={styles.markerIcon} />
        </Animated.View>

        <Animated.View
          style={[
            styles.dotContainer,
            {
              opacity: dotOpacity,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.dotMarker}>
            <View style={styles.dot} />
          </View>
        </Animated.View>
      </View>
    </Marker>
  );
};

// =============================================
// COMPONENTE PRINCIPAL MapContainer (com as alterações)
// =============================================
const MapContainer: React.FC<Props> = ({ location, places, onMarkerPress }) => {
  const [currentZoom, setCurrentZoom] = useState(location.latitudeDelta);
  const mapRef = useRef<MapView>(null);

  // O estado e o useEffect para 'selectedPlace' foram removidos.

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentZoom(region.latitudeDelta);
  };

  const shouldShowIcon = currentZoom < ZOOM_THRESHOLD;

  // CORREÇÃO: A função agora dispara as duas ações imediatamente.
  const handleMarkerPress = (place: Place) => {
    const coordinates = getCoordinates(place);

    if (coordinates.latitude && coordinates.longitude) {
      const newRegion: Region = {
        latitude: coordinates.latitude - MARKER_VERTICAL_OFFSET,
        longitude: coordinates.longitude + 0.0001,
        latitudeDelta: MARKER_ZOOM_DELTA,
        longitudeDelta: MARKER_ZOOM_DELTA,
      };

      // Ação 1: Inicia a animação de zoom
      mapRef.current?.animateToRegion(newRegion, ZOOM_ANIMATION_DURATION);
    }

    // Ação 2: Inicia a abertura do Bottom Sheet imediatamente
    if (onMarkerPress) {
      onMarkerPress(place);
    }
  };

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFillObject}
      region={location}
      customMapStyle={nightMapStyle}
      minZoomLevel={MIN_ZOOM_LEVEL}
      onRegionChangeComplete={handleRegionChangeComplete}
    >
      <UserLocationMarker
        latitude={location.latitude}
        longitude={location.longitude}
      />

      {places.map((place) => {
        const coordinates = getCoordinates(place);
        if (!coordinates.latitude || !coordinates.longitude) return null;

        return (
          <SmoothAnimatedMarker
            key={place.id}
            place={place}
            shouldShowIcon={shouldShowIcon}
            coordinates={coordinates}
            onPress={() => handleMarkerPress(place)}
          />
        );
      })}
    </MapView>
  );
};

// =============================================
// STYLES
// =============================================
const styles = StyleSheet.create({
  markerContainer: {
    position: "relative",
    width: 53,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    width: 53,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  dotContainer: {
    position: "absolute",
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  markerIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  dotMarker: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: "#000000",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default MapContainer;
