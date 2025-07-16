import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WeatherProps {
  temperature?: number;
  condition?: "sunny" | "cloudy" | "rainy" | "partly-cloudy" | "stormy";
  location?: string;
  onPress?: () => void;
  style?: any;
}

const weatherIcons = {
  sunny: "sunny",
  cloudy: "cloud",
  rainy: "rainy",
  "partly-cloudy": "partly-sunny",
  stormy: "thunderstorm",
};

export default function Weather({
  temperature = 26,
  condition = "cloudy",
  style,
}: WeatherProps) {
  const iconName = weatherIcons[condition];

  const content = (
    <View style={[styles.container, , style]}>
      <View style={styles.content}>
        <Ionicons
          name={iconName as any}
          size={22}
          color="#333"
          style={styles.icon}
        />
        <Text style={[styles.temperature]}>{temperature}°</Text>
      </View>
    </View>
  );


  return content;
}

const styles = StyleSheet.create({
  container: {
    marginInline: 25,
    borderRadius: 12,
    shadowColor: "#000",
    alignSelf: "flex-start",
    paddingInline: 4,
    paddingVertical: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
    color: "#fff",
  },
  temperature: {
    fontSize: 16,
    color: "#fff",
    fontFamily: Platform.select({
      ios: "Onest_900Black",
      android: "Onest_900Black",
    }),
  },
});
