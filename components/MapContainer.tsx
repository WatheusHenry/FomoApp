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
const MIN_ZOOM_LEVEL = 13;

const TYPE_ICON_MAP: { [key: string]: any } = {
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
}

const SmoothAnimatedMarker: React.FC<SmoothAnimatedMarkerProps> = ({
  place,
  shouldShowIcon,
  coordinates,
}) => {
  const iconOpacity = useRef(
    new Animated.Value(shouldShowIcon ? 1 : 0)
  ).current;
  const dotOpacity = useRef(new Animated.Value(shouldShowIcon ? 0 : 1)).current;
  
  useEffect(() => {
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

    Animated.parallel(animations).start();
  }, [shouldShowIcon, iconOpacity, dotOpacity]);

  const markerIcon = getMarkerIcon(place.types);

  return (
    <Marker
      tracksViewChanges={true}
      key={place.id}
      anchor={{ x: 0.5, y: 0.5 }}
      coordinate={coordinates}
      title={place.name || "Local sem nome"}
      description={place.address || "Endereço não disponível"}
    >
      <View style={styles.markerContainer}>
        <Animated.View style={[styles.iconContainer, { opacity: iconOpacity }]}>
          <Image source={markerIcon} style={styles.markerIcon} />
        </Animated.View>

        <Animated.View style={[styles.dotContainer, { opacity: dotOpacity }]}>
          <View style={styles.dotMarker}>
            <View style={styles.dot} />
          </View>
        </Animated.View>
      </View>
    </Marker>
  );
};

// =============================================
// MAIN COMPONENT
// =============================================
const MapContainer: React.FC<Props> = ({ location, places }) => {
  const [currentZoom, setCurrentZoom] = useState(location.latitudeDelta);

  // Removido: estado local de places e useEffect para buscar lugares
  // Agora os lugares vêm como props do componente pai

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentZoom(region.latitudeDelta);
  };

  const shouldShowIcon = currentZoom < ZOOM_THRESHOLD;

  return (
    <MapView
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
    width: 32,
    height: 33,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    width: 32,
    height: 33,
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
    width: 32,
    height: 33,
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