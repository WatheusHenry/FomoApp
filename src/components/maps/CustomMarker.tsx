import { Coordinates } from "@/constants/places";
import { Place } from "@/types/place";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Image, StyleSheet, View, Animated } from "react-native";
import { Marker } from "react-native-maps";
import { useHaptics } from "@/hooks/useHaptics";

// =============================================
// TIPOS E INTERFACES (Exportados para reuso)
// =============================================

interface SmoothAnimatedMarkerProps {
  place: Place;
  shouldShowIcon: boolean;
  coordinates: Coordinates;
  onPress?: () => void;
  isFocused?: boolean; // Nova prop para indicar se o marker está em foco
}

// =============================================
// CONSTANTES DO MARCADOR
// =============================================
const ANIMATION_DURATION = 100;
const BOUNCE_DURATION = 200;
const BASE_SCALE = 0.8; // Escala base para ícones não focados (menores)
const FOCUS_SCALE = 2; // Escala quando o marker está em foco (grande)
const FOCUS_ANIMATION_DURATION = 200; // Duração da animação de foco

const TYPE_ICON_MAP: { [key: string]: any } = {
  restaurant: require("../../../assets/icons/Food.png"),
  meal_takeaway: require("../../../assets/icons/Food.png"),
  food: require("../../../assets/icons/Food.png"),
  bakery: require("../../../assets/icons/Coffee.png"),
  cafe: require("../../../assets/icons/Coffee.png"),
  bar: require("../../../assets/icons/Beer.png"),
  movie_theater: require("../../../assets/icons/Party.png"),
  night_club: require("../../../assets/icons/Party.png"),
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
  return require("../../../assets/icons/Restaurant.png");
};

// =============================================
// COMPONENTE DO MARCADOR
// =============================================
const SmoothAnimatedMarker: React.FC<SmoothAnimatedMarkerProps> = ({
  place,
  shouldShowIcon,
  coordinates,
  onPress,
  isFocused = false, // Valor padrão false
}) => {
  const { triggerMarkerPress, triggerHaptic } = useHaptics();
  const wasFocusedRef = useRef(false); // Rastreia se estava em foco anteriormente
  
  const iconOpacity = useRef(
    new Animated.Value(shouldShowIcon || isFocused ? 1 : 0)
  ).current;
  const dotOpacity = useRef(new Animated.Value(shouldShowIcon || isFocused ? 0 : 1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const focusScaleAnim = useRef(new Animated.Value(BASE_SCALE)).current; // Começa com escala base (menor)
  const [isTracking, setIsTracking] = useState(true);

  // Efeito para animar o foco do marker
  useEffect(() => {
    if (isFocused && shouldShowIcon) {
      Animated.timing(focusScaleAnim, {
        toValue: FOCUS_SCALE,
        duration: FOCUS_ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset para escala base ao perder o foco ou ao trocar para modo ponto
      focusScaleAnim.setValue(BASE_SCALE);
    }
  }, [isFocused, shouldShowIcon, focusScaleAnim]);

  // Efeito para vibrar quando o marker for focado
  useEffect(() => {
    // Vibra apenas quando o marker ENTRA em foco (não estava focado antes)
    if (isFocused && !wasFocusedRef.current) {
      triggerHaptic('light');
    }
    
    // Atualiza o estado anterior
    wasFocusedRef.current = isFocused;
  }, [isFocused, triggerHaptic]);

  useEffect(() => {
    setIsTracking(true);
    const animations = (shouldShowIcon || isFocused)
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
  }, [shouldShowIcon, isFocused, iconOpacity, dotOpacity]);

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
    
    // Vibração ao pressionar o marker
    triggerMarkerPress();
    
    if (onPress) {
      onPress();
    }
  };

  const markerIcon = getMarkerIcon(place.types ?? []);

  // Gera uma rotação aleatória fixa para cada marker (efeito adesivo)
  const randomRotation = useMemo(() => {
    const str = `${place.id}-${place.name}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // força 32 bits
    }
    // Gera um valor entre -20 e +20 graus
    const angle = ((hash % 5) - 15); 
    return angle;
  }, [place.id, place.name]);

  return (
    <Marker
      tracksViewChanges={isTracking}
      key={place.id}
      anchor={{ x: 0.5, y: 0.8 }}
      coordinate={coordinates}
      onPress={handlePress}
    >
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
        <View style={styles.dot} />
      </Animated.View>
    </Marker>
  );
};

// =============================================
// ESTILOS DO MARCADOR
// =============================================
const styles = StyleSheet.create({
  markerContainer: {
    position: "relative",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    width: 30,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  dotContainer: {
    position: "absolute",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  markerIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dotMarker: {
    width: 30,
    height: 30,
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
  }
});

export default SmoothAnimatedMarker;
