import { StyleSheet, View } from "react-native";
import Button from "./Button";

// --- 1. Defina a interface para as props ---
interface HomeButtonsProps {
  onSearchPress: () => void;
}

export default function HomeButtons({ onSearchPress }: HomeButtonsProps) {
  return (
    <View style={styles.content}>
      <Button
        // --- 2. Use a prop no onPress ---
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
  // ... (seus estilos continuam os mesmos)
  content: {
    position: "absolute",
    bottom: "5%",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
});