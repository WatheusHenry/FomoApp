import { Place } from "@/interfaces/Place";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TYPE_ICON_MAP: { [key: string]: any } = {
  restaurant: require("../assets/icons/Food.png"),
  meal_takeaway: require("../assets/icons/Food.png"),
  food: require("../assets/icons/Food.png"),
  bakery: require("../assets/icons/Coffee.png"),
  cafe: require("../assets/icons/Coffee.png"),
  bar: require("../assets/icons/Beer.png"),
  movie_theater: require("../assets/icons/Party.png"),
  night_club: require("../assets/icons/Party.png"),
};

const getPlaceIcon = (placeTypes: string[]) => {
  for (const type of placeTypes) {
    if (TYPE_ICON_MAP[type]) {
      return TYPE_ICON_MAP[type];
    }
  }
  return require("../assets/icons/Restaurant.png");
};

interface HomeListProps {
  places: any;
  loading: boolean;
}

export default function HomeList({ places, loading }: HomeListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlaces = places.filter(
    (place: any) =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPlaceItem = (place: Place) => {
    const icon = getPlaceIcon(place.types);

    return (
      <TouchableOpacity
        key={place.id}
        style={styles.placeItem}
        onPress={() => {
          console.log("Local selecionado:", place.name);
        }}
      >
        <Image source={icon} style={styles.placeIcon} />
        <View style={styles.placeInfo}>
          <Text style={styles.placeTitle} numberOfLines={1}>
            {place.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.contentContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Pesquisar lugares..."
        placeholderTextColor="#9E9E9E"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B9FA5E" />
          <Text style={styles.loadingText}>Carregando lugares...</Text>
        </View>
      ) : (
        <>
          <ScrollView style={{ flex: 1, borderRadius: 15 }}>
            {filteredPlaces?.length > 0 ? (
              <>{filteredPlaces?.map(renderPlaceItem)}</>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchQuery
                    ? "Nenhum lugar encontrado para a sua busca"
                    : "Nenhum lugar encontrado próximo a você"}
                </Text>
                <TouchableOpacity style={styles.refreshButton}>
                  <Text style={styles.refreshButtonText}>Tentar novamente</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 25,
    backgroundColor: "white",
    width: "90%",
    justifyContent: "flex-end",
    paddingHorizontal: 15,
    paddingBottom: 30,
    height: "40%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10.84,
    elevation: 5,
    paddingTop: 15,
  },
  textInput: {
    backgroundColor: "#F4F4F4",
    borderRadius: 15,
    height: 40,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#686868",
    fontFamily: Platform.select({
      android: "Onest_500Medium",
      ios: "Onest_500Medium",
    }),
    marginBottom: 10,
  },
  placeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  placeIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginRight: 12,
  },
  placeInfo: {
    flex: 1,
  },
  placeTitle: {
    fontSize: 16,
    color: "#2C3035",
    fontWeight: "600",
    fontFamily: "Onest",
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#787B80",
    fontWeight: "500",
    fontFamily: "Onest",
    marginTop: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#787B80",
    fontWeight: "500",
    fontFamily: "Onest",
    textAlign: "center",
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: "#B9FA5E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  refreshButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
    fontFamily: "Onest",
  },
});
