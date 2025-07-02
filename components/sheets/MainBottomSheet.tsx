// components/MainBottomSheet.tsx
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fetchNearbyPlaces } from "../../utils/fetchNearbyPlaces";
import { getLocation, getCoords } from "../../utils/getLocation";

import Button from "../Button";

export default function MainBottomSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [city, setCity] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);

  const getIconForType = (type: string) => {
    const normalized = type.toLowerCase();

    if (
      normalized.includes("restaurant") ||
      normalized.includes("food") ||
      normalized.includes("dinner") ||
      normalized.includes("shop")
    )
      return require("../../assets/images/RestaurantPin.png");
    if (normalized.includes("bar"))
      return require("../../assets/images/BarPin.png");
    if (
      normalized.includes("night_club") ||
      normalized.includes("pub") ||
      normalized.includes("dance_hall") ||
      normalized.includes("cassino") ||
      normalized.includes("comedy_club ")
    )
      return require("../../assets/images/PartyPin.png");

    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const coords = await getCoords();
      const locationInfo = await getLocation();
      if (coords && locationInfo) {
        setCity(locationInfo.city || "");
        setRegion(locationInfo.region || "");

        const places = await fetchNearbyPlaces(
          coords.coords.latitude,
          coords.coords.longitude
        );

        const shuffled = places.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        const mappedPlaces = selected.map((place: any) => ({
          title: place.displayName?.text || "Sem nome",
          address: place.formattedAddress || "Endereço não disponível",
          type: place.types?.[0] || "default",
        }));

        setNearbyPlaces(mappedPlaces);
      }
    };

    fetchData();
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={["13%", "50%"]}
      backgroundStyle={{ backgroundColor: "#2C3035" }}
      keyboardBehavior="interactive"
    >
      <BottomSheetView style={styles.content}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={styles.title}>{city}</Text>
            <Text style={styles.subtitle}>{region}</Text>
          </View>
          <View>
            <Button onPress={() => console.log("Checkin")}></Button>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.nerbyPlaces}>Locais próximos:</Text>
          <TouchableOpacity
            onPress={() => {
              console.log("Mais");
            }}
          >
            <Text style={styles.more}>Mais</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: "#3F444B",
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          {nearbyPlaces.map((place, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                width: "95%",
                alignSelf: "center",
                paddingVertical: 6,
                borderBottomWidth: index !== nearbyPlaces.length - 1 ? 1 : 0,
                borderBottomColor: "#464E58",
              }}
            >
              <Image
                source={getIconForType(place.type)}
                style={{ width: 40, height: 40, resizeMode: "contain" }}
              />
              <View style={{ paddingVertical: 3, width: "80%" }}>
                <Text
                  style={{ color: "#fff", fontFamily: "Onest", fontSize: 16 }}
                >
                  {place.title}
                </Text>
                <Text
                  style={{
                    color: "#aaa",
                    fontFamily: "Onest",
                    fontSize: 14,
                    flexWrap: "wrap",
                  }}
                >
                  {place.address}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { paddingInline: 20, paddingBottom: 20 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#fff",
    fontFamily: "Onest",
  },
  subtitle: {
    fontSize: 16,
    color: "#787B80",
    fontWeight: "600",
    fontFamily: "Onest",
  },
  nerbyPlaces: {
    fontSize: 16,
    color: "#787B80",
    fontWeight: "600",
    fontFamily: "Onest",
  },
  more: {
    fontSize: 14,
    color: "#B9FA5E",
    fontWeight: "500",
  },
});
