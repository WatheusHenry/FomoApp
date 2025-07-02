import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";

interface Props {
  onPress: () => void;
}

export default function Button({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.content}>
        <Image
          source={require("../assets/icons/CheckIn.png")}
          style={[styles.icon, { width: 18, height: 18 }]}
        />
        <Text style={styles.text}>Check-in</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#B5FF5D",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
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
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontWeight: "700",
    color: "#1E5514",
    fontSize: 18,
  },
});
