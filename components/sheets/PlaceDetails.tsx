import React, { forwardRef, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { fetchPlaceDetails } from "@/utils/fetchPlaceDetails"; // <- importar aqui

interface Place {
  id: string;
  name: string;
  address: string;
  types: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  formatted_phone_number?: string;
  website?: string;
  // eslint-disable-next-line @typescript-eslint/array-type
  photos?: Array<{
    url: string;
    reference: string;
  }>;
}

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
              <TouchableOpacity style={styles.state}></TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeAddress}>{shownPlace.address}</Text>
              </View>
            </View>
          </View>

          {details?.photos && details.photos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {details.photos.slice(0, 5).map((photo, index) => (
                <View key={index} style={{ marginRight: 10 }}>
                  <Image
                    source={{ uri: photo.url }}
                    style={{
                      width: 200,
                      height: 120,
                      borderRadius: 12,
                      backgroundColor: "#444",
                    }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#2C3035",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    marginLeft: 12,
    flex: 1,
  },
  placeName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#B5B5B5",
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
    backgroundColor: "#35393E",
    width: "auto",
    padding: 10,
    borderRadius: 10,
    marginRight: 6,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
});

PlaceDetails.displayName = "PlaceDetails";

export default PlaceDetails;
