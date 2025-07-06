import { StyleSheet, View } from "react-native";
import Button from "./Button";

export default function HomeButtons() {
  return (
    <View style={styles.content}>
      <Button
        onPress={() => console.log("Checkin")}
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
  },
});
