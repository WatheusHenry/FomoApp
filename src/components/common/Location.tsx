import { Platform, StyleSheet, Text, View } from "react-native";

export default function Location() {
  return (
    <View style={styles.content}>
      <View style={styles.row}>
        <Text style={styles.title}>Marília</Text>
        <Text style={styles.subtitle}>SP</Text>
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
    color: "#fff",
    fontFamily: Platform.select({
      android: "Roboto_900Black_Italic",
      ios: "Roboto_900Black_Italic",
    }),
  },
  subtitle: {
    fontSize: 16,
    color: "#787B80",
    fontFamily: Platform.select({
      android: "Roboto_900Black_Italic",
      ios: "Roboto_900Black_Italic",
    }),
    marginLeft: 4,
  },
});
