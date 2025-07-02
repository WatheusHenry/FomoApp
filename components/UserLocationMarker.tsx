import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";

interface Props {
  latitude: number;
  longitude: number;
}

export default function UserLocationMarker({ latitude, longitude }: Props) {
  return (
    <Marker
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={999}
      tracksViewChanges={false}
    >
      <View style={styles.container}>
        <View style={styles.userMarker}>{""}</View>
        <Text style={styles.placeText}>Você</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeText: {
    backgroundColor: "#B9FA5E",
    borderColor: "#468C38",
    paddingInline: 7,
    borderRadius: 10,
    borderWidth: 1,
    fontWeight: "600",
    fontSize: 16,
    color: "#468C38",
    textAlign: "center",
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "white",
    marginBottom: 10,
    zIndex: 10,
    backgroundColor: "#B9FA5E",
  },
});
