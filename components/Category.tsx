import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export interface Store {
  storeId: number;
  name: string;
  address: string;
  icon: {
    serverImage: string | null;
    smallServerImage: string | null;
  };
  rating: {
    value: number;
    numberOfRatings: string;
  };
  is24Hours: boolean;
}

interface MarketDetailsNavigationProp {
  navigate: (screen: "MarketDetails", params: { storeId: number }) => void;
}

interface HorizontalCategoryProps {
  businesses: Store[];
  elementType: string;
  layoutType: "horizontal" | "vertical";
}

const HorizontalCategory = ({
  businesses,
  elementType,
  layoutType,
}: HorizontalCategoryProps) => {
  const navigation = useNavigation<MarketDetailsNavigationProp>();

  function generateUniqueKey(business: Store, index: number) {
    return `${business.storeId}-${business.name}-${index}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{elementType}</Text>
        <Text style={styles.viewAll}>View all</Text>
      </View>

      <ScrollView
        horizontal={layoutType === "horizontal"}
        showsHorizontalScrollIndicator={layoutType === "horizontal"}
        contentContainerStyle={
          layoutType === "vertical" && styles.verticalScrollContent
        }
      >
        {businesses.map((business, index) => (
          <TouchableOpacity
            key={generateUniqueKey(business, index)}
            onPress={() =>
              navigation.navigate("MarketDetails", {
                storeId: business.storeId,
              })
            }
          >
            <View
              style={[
                styles.card,
                layoutType === "vertical" && styles.verticalCard,
              ]}
            >
              <View style={styles.imageContainer}>
                <Ionicons name="image-outline" size={40} color="gray" />
              </View>
              <Text style={styles.businessTitle}>{business.name}</Text>
              <Text style={styles.businessLocation}>{business.address}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAll: {
    fontSize: 14,
  },
  card: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  verticalCard: {
    width: "100%",
    marginBottom: 15,
  },
  imageContainer: {
    width: 85,
    height: 85,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  businessTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  businessLocation: {
    fontSize: 12,
    color: "gray",
    marginBottom: 10,
  },
  verticalScrollContent: {
    flexDirection: "column",
  },
});

export default HorizontalCategory;
