import { Place } from "@/interfaces/Place";
import { fetchPlaceDetails } from "@/utils/fetchPlaceDetails";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PlaceDetailsProps {
  place: Place | null;
  onClose: () => void;
}

const PlaceDetails = forwardRef<BottomSheet, PlaceDetailsProps>(
  ({ place, onClose }, ref) => {
    const snapPoints = useMemo(() => ["25%", "50%"], []);
    const [details, setDetails] = useState<Place | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!place) return;
      const loadDetails = async () => {
        try {
          setLoading(true);
          const data = await fetchPlaceDetails(place.id);
          setDetails(data);
        } catch (err) {
          console.error("❌ Erro ao buscar detalhes do local:", err);
        } finally {
          setLoading(false);
        }
      };

      loadDetails();
    }, [place]);
    if (!place) return null;

    const shownPlace = details || place;

    const pills = [
      "Cheio",
      "Cover",
      "Barato",
      "Ar livre",
      "Teste",
      "Teste Grande",
      "Teste Grande",
      "Teste Grande",
    ];

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={onClose}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetScrollView style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerText}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeAddress}>{shownPlace.address}</Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity style={styles.WorkingHours}>
              <Image
                source={require("../../assets/icons/GreenDot.png")}
              ></Image>
              <Text style={styles.TextPills}>Aberto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.InfoPills}>
              <Image
                source={require("../../assets/icons/Acessibility.png")}
              ></Image>
              <Text style={styles.TextPills}>Acessivel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.InfoPills}>
              <Image source={require("../../assets/icons/Loc.png")}></Image>
              <Text style={styles.TextPills}>0,7 km de você</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pillsContiner}>
            <Text style={{ color: "#989898", fontWeight: "600" }}>
              Falaram sobre o lugar:
            </Text>
            <View style={styles.infoPills}>
              {pills.map((pill, index) => (
                <Text key={index} style={styles.pill}>
                  {pill}
                </Text>
              ))}
            </View>
          </View>
          <Text
            style={{
              color: "#3F444B",
              fontWeight: "600",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Ultima atualização há 00 minutos
          </Text>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10.84,
    elevation: 5,
  },
  handleIndicator: {
    backgroundColor: "#DDD",
    width: 40,
    height: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
    paddingTop: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerText: {
    flex: 1,
    width: "50%",
  },
  placeName: {
    fontSize: 20,
    fontFamily: Platform.select({
      android: "Onest_900Black",
      ios: "Onest_900Black",
    }),
    color: "#3676FF",
  },
  placeAddress: {
    fontSize: 12,
    width: "70%",
    fontFamily: Platform.select({
      android: "Onest_500Medium",
      ios: "Onest_500Medium",
    }),
    color: "#808080",
  },
  state: {
    borderColor: "#5D6265",
    borderWidth: 3,
    width: 75,
    height: 75,
    borderRadius: 100,
    borderStyle: "dashed",
  },
  infoPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
  pillsContiner: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "#F4F4F4",
    padding: 10,
    borderRadius: 10,
    borderStyle: "dashed",
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: Platform.select({
      android: "Onest_500Medium",
      ios: "Onest_500Medium",
    }),
    backgroundColor: "#FFFFFF",
    color: "#2C3035",
    fontWeight: "600",
  },
  WorkingHours: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    color: "#44aa32ff",
    gap: 5,
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#95EF17",
  },
  InfoPills: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    alignContent: "center",
    gap: 5,
    alignItems: "center",
    backgroundColor: "#F4F4F4",
  },
  TextPills: {
    fontFamily: Platform.select({
      android: "Onest_500Medium",
      ios: "Onest_500Medium",
    }),
    color: "#7A7A7A",
  },
});

PlaceDetails.displayName = "PlaceDetails";

export default PlaceDetails;
