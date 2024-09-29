import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MainPageBanner = () => {
  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerImageContainer}>
        <Ionicons name="image-outline" size={100} color="gray" />
        <Text style={styles.bannerText}>Banner size</Text>
        <Text style={styles.bannerSize}>375×328px</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImageContainer: {
    width: 375,
    height: 328,

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  bannerText: {
    fontSize: 18,
    color: "gray",
    marginTop: 10,
  },
  bannerSize: {
    fontSize: 14,
    color: "gray",
  },
});

export default MainPageBanner;
