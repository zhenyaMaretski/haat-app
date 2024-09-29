import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface DropdownProps {
  locations: string[];
  onSelect: (location: string) => void;
  selectedLocation: string;
}

const Dropdown = ({ locations, onSelect, selectedLocation }: DropdownProps) => {
  return (
    <View style={styles.dropdown}>
      {locations.map((location) => (
        <TouchableOpacity
          key={location}
          onPress={() => onSelect(location)}
          style={[
            styles.dropdownItem,
            location === selectedLocation && styles.selectedItem,
          ]}
        >
          <Text style={styles.dropdownItemText}>{location}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    top: "25%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: -50 }],
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    width: 200,
  },
  dropdownItem: {
    paddingVertical: 10,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownItemText: {
    fontSize: 16,
  },
  selectedItem: {
    backgroundColor: "#f0f0f0",
  },
});

export default Dropdown;
