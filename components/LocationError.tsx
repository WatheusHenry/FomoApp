import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  message: string;
  onRetry: () => void;
}

export default function LocationError({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Tentar Novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { fontSize: 16, color: "red", textAlign: "center", marginBottom: 20 },
  retryButton: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8 },
  retryButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
