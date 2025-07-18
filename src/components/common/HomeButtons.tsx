import { StyleSheet, View } from "react-native";
import Button from "./Button";

interface HomeButtonsProps {
  onSearchPress: () => void;
}

export default function HomeButtons({ onSearchPress }: HomeButtonsProps) {
  return (
    <View style={styles.content}>
      <Button
        onPress={onSearchPress}
        text=""
        type="Search"
        style={{ backgroundColor: "#D0D0D0" }}
      />
      <Button
        onPress={() => console.log("Checkin")}
        text="Check-in"
        type="CheckIn"
        style={{ transform: [{ translateY: -10 }] }}
      />
      <Button
        onPress={() => console.log("Checkin")}
        text=""
        type="Shuffle"
        style={{ backgroundColor: "#D0D0D0" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    position: "absolute",
    bottom: "5%",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    
    
  },
});
