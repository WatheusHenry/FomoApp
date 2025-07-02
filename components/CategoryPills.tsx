import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

type Category = {
  label: string;
  icon: any;
};

type Props = {
  onSelect: (category: string | null) => void;
  selected: string | null;
};

const categories: Category[] = [
  { icon: require("../assets/icons/Bar.png"), label: "Bares" },
  { icon: require("../assets/icons/Party.png"), label: "Festas" },
  { icon: require("../assets/icons/Restaurant.png"), label: "Restaurantes" },
];

const CategoryPills = ({ onSelect, selected }: Props) => {
  return (
    <View style={styles.container}>
      {categories.map((category, index) => {
        const isSelected = selected === category.label;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.pill, isSelected && { backgroundColor: "#B9FA5E" }]}
            onPress={() => onSelect(isSelected ? null : category.label)}
          >
            <Image source={category.icon} style={styles.icon} />
            <Text style={[styles.pillText, isSelected && { color: "#000" }]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CategoryPills;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: "15%",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3F444B",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  pillText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Onest",
  },
});
