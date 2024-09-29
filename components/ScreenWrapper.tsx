import React, { ReactNode } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

interface ScreenWrapperProps {
  children: ReactNode;
}

const ScreenWrapper = ({ children }: ScreenWrapperProps) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ScreenWrapper;
