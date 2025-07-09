import React, { forwardRef, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

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
  photos?: Array<{
    photo_reference: string;
    width: number;
    height: number;
  }>;
}

interface PlaceDetailsProps {
  place: Place | null;
  onClose: () => void;
}

const PlaceDetails = forwardRef<BottomSheet, PlaceDetailsProps>(
  ({ place, onClose }, ref) => {
    const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

    if (!place) return null;

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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.state}></TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeAddress}>{place.address}</Text>
              </View>
            </View>
          </View>
          <ScrollView horizontal={true}>
            <TouchableOpacity style={styles.infoPills}>
              <Text>Fechado</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoPills}>
              <Text>Fechado</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoPills}>
              <Text>Fechado</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoPills}>
              <Text>Fechado</Text>
            </TouchableOpacity>
          </ScrollView>
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
    verticalAlign: "top",
    marginBottom: 16,
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
    marginRight: 10,
  },
});

PlaceDetails.displayName = "PlaceDetails";

export default PlaceDetails;
