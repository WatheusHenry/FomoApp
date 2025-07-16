import { Platform, StyleSheet, Text, View } from "react-native";

export default function Location() {
  return (
    <View style={styles.content}>
      <View>
        <Text style={styles.title}>Monte Castelo</Text>
        <Text style={styles.subtitle}>Rua Padre Roma</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingInline: 30,
    paddingTop: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  title: {
    fontSize: 24,
    color: "#2C3035",
    fontFamily: Platform.select({
      android: "Anton_400Regular",
      ios: "Anton_400Regular",
    }),
  },
  subtitle: {
    width: 120,
    padding: 1,
    backgroundColor: "white",
    fontSize: 14,
    color: "#000000ff",
  },
});
