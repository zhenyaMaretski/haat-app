import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MainPageBanner from "../components/MainPageBanner";
import Dropdown from "../components/Dropdown";
import Tags from "../components/Tags";
import Category from "../components/Category";

const LOCATIONS = ["Umm al-fahem", "Haifa", "Tel Aviv"];
const TAGS = ["Fast Food", "Pizza", "Sushi", "Burgers", "Vegan", "Desserts"];

const RestaurantsScreen = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://user-app-staging.haat-apis.com/api/user/main-page/by-area/1?type=Market",
          {
            method: "GET",
            headers: {
              "Accept-Language": "en-US",
            },
          }
        );
        const jsonData = await response.json();
        setCategoriesData(jsonData.categories as any);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setDropdownVisible(false);
  };

  const handleSearch = () => {
    Alert.alert("Search Clicked", "This will open a search input or screen.");
  };

  const handleMenu = () => {
    Alert.alert("Menu Clicked", "This will open a side drawer menu.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenu}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.locationContainer}
          onPress={toggleDropdown}
        >
          <Ionicons name="location-sharp" size={16} color="#b71c1c" />
          <Text style={styles.locationText}>{selectedLocation}</Text>
          <Ionicons name="chevron-down" size={16} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {isDropdownVisible && (
        <Dropdown
          locations={LOCATIONS}
          onSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
        />
      )}

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <MainPageBanner />
        <Tags tags={TAGS} />

        {categoriesData.map((category, index) => (
          <Category
            key={`${category.id}-${index}`}
            businesses={category.stores}
            layoutType={
              category.elementType === "MarketHorizontalCategory"
                ? "horizontal"
                : "vertical"
            }
            elementType={category.name || "Market Category"}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
});

export default RestaurantsScreen;
