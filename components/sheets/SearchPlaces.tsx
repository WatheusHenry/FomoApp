import { Place } from "@/interfaces/Place";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchPlacesProps {
  places: Place[];
  loading: boolean;
  onRefresh: () => void;
}

const TYPE_ICON_MAP: { [key: string]: any } = {
  // Alimentação
  restaurant: require("../../assets/icons/Restaurant.png"),
  meal_takeaway: require("../../assets/icons/Restaurant.png"),
  food: require("../../assets/icons/Restaurant.png"),
  bakery: require("../../assets/icons/Restaurant.png"),
  cafe: require("../../assets/icons/Restaurant.png"),
  bar: require("../../assets/icons/Bar.png"),
  movie_theater: require("../../assets/icons/Party.png"),
  night_club: require("../../assets/icons/Party.png"),
};

const getPlaceIcon = (placeTypes: string[]) => {
  for (const type of placeTypes) {
    if (TYPE_ICON_MAP[type]) {
      return TYPE_ICON_MAP[type];
    }
  }
  return require("../../assets/icons/Restaurant.png");
};

const SearchPlaces = forwardRef<BottomSheet, SearchPlacesProps>(
  ({ places, loading, onRefresh }, ref) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPlaces = places.filter(
      (place) =>
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
            <Text style={styles.placeSubtitle} numberOfLines={2}>
              {place.address}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={["70%", "70%"]}
        backgroundStyle={{ backgroundColor: "#2C3035" }}
        enablePanDownToClose
        enableBlurKeyboardOnGesture
        enableDynamicSizing={false}
        keyboardBehavior="interactive"
      >
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Image
              source={require("../../assets/icons/Search.png")}
              style={styles.headerIcon}
            />
            <Text style={styles.headerText}>Locais Próximos</Text>
          </View>

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
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {searchQuery ? "Resultados da busca" : "Próximos de você"}
                </Text>
                <Text style={styles.sectionCount}>
                  {filteredPlaces.length}{" "}
                  {filteredPlaces.length === 1 ? "lugar" : "lugares"}
                </Text>
              </View>
              <BottomSheetScrollView
                contentContainerStyle={styles.scrollContentContainer}
              >
                {filteredPlaces.length > 0 ? (
                  <>{filteredPlaces.map(renderPlaceItem)}</>
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                      {searchQuery
                        ? "Nenhum lugar encontrado para a sua busca"
                        : "Nenhum lugar encontrado próximo a você"}
                    </Text>
                    <TouchableOpacity
                      style={styles.refreshButton}
                      onPress={onRefresh}
                    >
                      <Text style={styles.refreshButtonText}>
                        Tentar novamente
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </BottomSheetScrollView>
            </>
          )}
        </View>
      </BottomSheet>
    );
  }
);

export default SearchPlaces;
SearchPlaces.displayName = "SearchPlaces";

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  headerIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  headerText: {
    fontSize: 26,
    color: "#fff",
    fontFamily: Platform.select({
      android: "Roboto_900Black_Italic",
      ios: "Roboto_900Black_Italic",
    }),
  },
  textInput: {
    backgroundColor: "#35393E",
    borderColor: "#3F444B",
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: Platform.select({
      android: "Onest_600SemiBold",
      ios: "Onest_600SemiBold",
    }),
    marginBottom: 20,
  },
  scrollContentContainer: {
    paddingBottom: 150,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Onest",
  },
  sectionCount: {
    fontSize: 14,
    color: "#787B80",
    fontWeight: "500",
    fontFamily: "Onest",
  },
  placeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  placeIcon: {
    width: 38,
    height: 41,
    resizeMode: "contain",
    marginRight: 12,
  },
  placeInfo: {
    flex: 1,
  },
  placeTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Onest",
    marginBottom: 4,
  },
  placeSubtitle: {
    fontSize: 14,
    color: "#787B80",
    fontWeight: "400",
    fontFamily: "Onest",
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
