import React from "react";
import { Platform, StyleSheet, View } from "react-native";
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
      tracksViewChanges={Platform.OS === "ios" ? false : true} 
    >
      <View style={styles.container}>
        <View style={styles.userMarker}>{""}</View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    zIndex: 10,
    backgroundColor: "#B9FA5E",
    shadowColor: "#B9FA5E",
    shadowOffset: { width: 0, height: 2 },
  },
});
