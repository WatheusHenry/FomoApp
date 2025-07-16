// src/components/common/BottomShadow.tsx
import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function BottomShadow() {
  return (
    <LinearGradient
      colors={["transparent", "rgba(0,0,0,0.25)", "rgba(0,0,0,0.5)"]}
      style={styles.shadow}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  shadow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: 80, // ajuste conforme necessário
  },
});