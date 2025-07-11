import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  ViewStyle,
  StyleProp,
  Platform,
} from "react-native";
import { useHaptics } from "@/hooks/useHaptics";

interface Props {
  onPress: () => void;
  text: string;
  type: string;
  style?: StyleProp<ViewStyle>;
}

const iconMap: Record<string, any> = {
  CheckIn: require("../../../assets/icons/CheckIn.png"),
  Search: require("../../../assets/icons/Search.png"),
  Shuffle: require("../../../assets/icons/shuffle.png"),
};

export default function Button({ onPress, text, type, style }: Props) {
  const { triggerButtonPress } = useHaptics();
  const isTextEmpty = text.trim() === "";
  const iconSource = iconMap[type] ?? iconMap["CheckIn"]; // fallback

  const handlePress = () => {
    // 🔥 Trigger haptic feedback
    triggerButtonPress();
    onPress();
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
      <View style={styles.content}>
        <Image
          source={iconSource}
          style={[
            styles.icon,
            {
              width: iconMap[type] === 6 ? 25 : 29,
              height: iconMap[type] === 6 ? 25 : 28,
              marginRight: isTextEmpty ? 0 : 6,
            },
          ]}
        />
        {!isTextEmpty && <Text style={styles.text}>{text}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#B5FF5D",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
  },
  icon: {
    marginRight: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    color: "#1E5514",
    fontSize: 22,
    elevation: 5,
    lineHeight: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    fontFamily: Platform.select({
      android: "Onest_900Black",
      ios: "Onest-Black",
    }),
  },
});
