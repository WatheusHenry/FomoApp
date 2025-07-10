import { Coordinates } from "@/interfaces/Coordinates";
import { Place } from "@/interfaces/Place";
import React, { useEffect, useState, useRef } from "react";
import { Image, StyleSheet, View, Animated } from "react-native";
import { Marker } from "react-native-maps";

// =============================================
// TIPOS E INTERFACES (Exportados para reuso)
// =============================================

interface SmoothAnimatedMarkerProps {
  place: Place;
  shouldShowIcon: boolean;
  coordinates: Coordinates;
  onPress?: () => void;
}

// =============================================
// CONSTANTES DO MARCADOR
// =============================================
const ANIMATION_DURATION = 200;
const BOUNCE_DURATION = 300;

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
// FUNÇÕES UTILITÁRIAS DO MARCADOR
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

// =============================================
// COMPONENTE DO MARCADOR
// =============================================
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
  const [isTracking, setIsTracking] = useState(true);

  useEffect(() => {
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

    Animated.parallel(animations).start(() => setIsTracking(false));
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
            { opacity: dotOpacity, transform: [{ scale: pulseAnim }] },
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
// ESTILOS DO MARCADOR
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
  markerIcon: { width: 40, height: 40, resizeMode: "contain" },
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default SmoothAnimatedMarker;
