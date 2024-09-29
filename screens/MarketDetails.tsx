import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ScreenWrapper from "./../components/ScreenWrapper";

const MarketDetails = ({ route }) => {
  const { storeId } = route.params;
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          `https://user-app-staging.haat-apis.com/api/markets/${storeId}`
        );
        const data = await response.json();
        setMarketData(data);
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [storeId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!marketData) {
    return (
      <View style={styles.container}>
        <Text>No data available for this market.</Text>
      </View>
    );
  }

  const { name, address, marketCategories } = marketData;

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{name["en-US"] || "Market Name"}</Text>
        <Text style={styles.address}>
          {address["en-US"] || "Address not available"}
        </Text>

        {/* Available Categories */}
        <Text style={styles.sectionTitle}>Available Categories:</Text>
        <View style={styles.grid}>
          {marketCategories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryItem}>
              <Text style={styles.categoryText}>
                {category.name["en-US"] || "Category Name"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "30%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MarketDetails;
