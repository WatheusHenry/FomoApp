import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";

interface Props {
  latitude: number;
  longitude: number;
  type: string[];
  children: any;
}

export default function UserLocationMarker({
  latitude,
  longitude,
  type,
}: Props) {
  return (
    <Marker
      style={styles.CustomMarker}
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={999}
      tracksViewChanges={Platform.OS === "ios" ? false : true}
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/images/BarPin.png")}
          style={styles.CustomMarkerIcon}
        ></Image>
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
  placeText: {
    backgroundColor: "#B9FA5E",
    borderColor: "#468C38",
    paddingInline: 7,
    borderRadius: 10,
    borderWidth: 1,
    fontWeight: "600",
    fontSize: 13,
    color: "#468C38",
    textAlign: "center",
  },
  CustomMarker: {
    width: 60,
  },
  CustomMarkerIcon: {
    width: 40,
    height: 40,
    zIndex: 10,
  },
});
