import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenProps } from "../types/NavigationTypes";

const ProfileScreen = ({}: ScreenProps<"Profile">) => {
  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default ProfileScreen;
