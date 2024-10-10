import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ScreenWrapper from "./../components/ScreenWrapper";

const MarketDetails = ({ route }) => {
  const { storeId } = route.params;
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoriesData, setCategoriesData] = useState([]);
  const [categoryRefs, setCategoryRefs] = useState({});
  const [subcategoryRefs, setSubcategoryRefs] = useState({});
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          `https://user-app-staging.haat-apis.com/api/markets/${storeId}`
        );
        const data = await response.json();
        setMarketData(data);
        await fetchAllCategories(data.marketCategories);
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllCategories = async (categories) => {
      try {
        const promises = categories.map((category) =>
          fetch(
            `https://user-app-staging.haat-apis.com/api/markets/${storeId}/categories/${category.id}`
          ).then((response) => response.json())
        );
        const allCategoriesData = await Promise.all(promises);
        setCategoriesData(allCategoriesData);

        const catRefs = {};
        const subcatRefs = {};
        allCategoriesData.forEach((category) => {
          catRefs[category.id] = React.createRef();
          category.marketSubcategories.forEach((subcategory) => {
            subcatRefs[subcategory.id] = React.createRef();
          });
        });
        setCategoryRefs(catRefs);
        setSubcategoryRefs(subcatRefs);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };

    fetchMarketData();
  }, [storeId]);

  const scrollToSubcategory = (subcategoryId) => {
    const ref = subcategoryRefs[subcategoryId];
    if (ref && ref.current) {
      ref.current.measureLayout(
        flatListRef.current.getNativeScrollRef(),
        (x, y) => {
          flatListRef.current.scrollToOffset({ offset: y, animated: true });
          setActiveSubcategory(subcategoryId);
        }
      );
    }
  };

  const scrollToCategory = (categoryId) => {
    const ref = categoryRefs[categoryId];
    if (ref && ref.current) {
      ref.current.measureLayout(
        flatListRef.current.getNativeScrollRef(),
        (x, y) => {
          flatListRef.current.scrollToOffset({ offset: y, animated: true });
          setActiveCategory(categoryId);
        }
      );
    }
  };

  // Функция, которая меняет активную сабкатегорию на основе видимых элементов
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      if (viewableItems && viewableItems.length > 0) {
        const visibleItem = viewableItems.find(
          (item) => item.index !== null && item.section !== undefined
        );
        if (visibleItem && visibleItem.item.id !== activeSubcategory) {
          setActiveSubcategory(visibleItem.item.id);
        }
      }
    },
    [activeSubcategory]
  );

  // Увеличиваем процент видимости, чтобы правильно детектить длинные сабкатегории
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 0, // Сабкатегория должна быть видима на 80%, чтобы быть активной
  };

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

  const {
    name,
    address,
    workingHours,
    deliveryFee,
    deliveryTime,
    marketCategories,
  } = marketData;

  const renderSubcategories = (subcategories) => (
    <>
      {subcategories.map((subcategory, subIndex) => (
        <View
          key={subcategory.id || subIndex}
          ref={subcategoryRefs[subcategory.id]}
        >
          <Text style={styles.subcategoryTitle}>
            {subcategory.name["en-US"] || "Subcategory Name"}
          </Text>
          <FlatList
            data={subcategory.products || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                <Image
                  source={{
                    uri:
                      item.productImages?.[0]?.url ||
                      "https://path-to-placeholder.png",
                  }}
                  style={styles.productImage}
                />
                <Text style={styles.productName}>
                  {item.name["en-US"] || "Product Name"}
                </Text>
                <Text style={styles.productPrice}>
                  ₪{item.basePrice || item.discountPrice}
                </Text>
                <Text style={styles.productWeight}>
                  {item.weightToPresent || "Weight not available"}
                </Text>
              </View>
            )}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      ))}
    </>
  );

  const renderMarketHeader = () => (
    <>
      <View style={styles.header}>
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <View style={styles.iconWrapper}>
            <TouchableOpacity style={styles.icon}>
              <Text style={styles.iconText}>♥</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Text style={styles.iconText}>🛒</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.marketCard}>
        <View style={styles.marketHeader}>
          <Text style={styles.marketName}>
            {name["en-US"] || "Market Name"}
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>OPEN</Text>
          </View>
        </View>

        <Text style={styles.address}>
          {address["en-US"] || "Address not available"}
        </Text>
        <Text style={styles.workingHours}>
          Working Hours: {workingHours || "Not available"}
        </Text>

        <Text style={styles.deliveryInfo}>
          Delivery Cost: ${deliveryFee || "0.00"} | Delivery Time:{" "}
          {deliveryTime || "N/A"} minutes
        </Text>

        <View style={styles.orderOptions}>
          <Text style={styles.optionText}>Take Away</Text>
          <Text style={styles.optionText}>Delivery</Text>
        </View>
      </View>
    </>
  );

  return (
    <ScreenWrapper>
      <View style={styles.fixedMenu}>
        <FlatList
          horizontal
          data={categoriesData.flatMap((category) =>
            category.marketSubcategories.map((subcat) => ({
              id: subcat.id,
              name: subcat.name["en-US"] || "Subcategory",
            }))
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => scrollToSubcategory(item.id)}
              style={[
                styles.menuItem,
                item.id === activeSubcategory && styles.activeMenuItem,
              ]}
            >
              <Text
                style={[
                  styles.menuText,
                  item.id === activeSubcategory && styles.activeMenuText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        ref={flatListRef}
        data={categoriesData}
        keyExtractor={(item, index) => item.id.toString() || index.toString()}
        ListHeaderComponent={
          <>
            {renderMarketHeader()}
            <View style={styles.categoryContainer}>
              {marketCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    category.id === activeCategory && styles.activeCategoryItem,
                  ]}
                  onPress={() => scrollToCategory(category.id)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category.id === activeCategory &&
                        styles.activeCategoryText,
                    ]}
                  >
                    {category.name["en-US"] || "Category Name"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        renderItem={({ item: category }) => (
          <View style={styles.categorySection} ref={categoryRefs[category.id]}>
            <Text style={styles.sectionTitle}>
              {category.name["en-US"] || "Category Name"}
            </Text>
            {renderSubcategories(category.marketSubcategories || [])}
          </View>
        )}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 200,
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 20,
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  backText: {
    fontSize: 24,
    color: "#fff",
  },
  iconWrapper: {
    flexDirection: "row",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    marginLeft: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  iconText: {
    fontSize: 24,
    color: "#fff",
  },
  marketCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  marketHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  marketName: {
    fontSize: 18,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: "green",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
  },
  address: {
    fontSize: 16,
    color: "gray",
    marginBottom: 3,
  },
  workingHours: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 3,
  },
  deliveryInfo: {
    fontSize: 14,
    marginBottom: 10,
  },
  orderOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 5,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -5,
  },
  categoryItem: {
    flexBasis: "30%",
    marginHorizontal: 5,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  dealsContainer: {
    paddingTop: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  productCard: {
    backgroundColor: "#fff",
    padding: 5,
    margin: 5,
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productWeight: {
    fontSize: 12,
    color: "gray",
  },
  noMargin: {
    margin: 0,
  },
  noPadding: {
    padding: 0,
  },
  fixedMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "#fff",
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  menuItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  menuText: {
    fontSize: 14,
  },
  activeMenuItem: {
    backgroundColor: "#007BFF",
  },
  activeMenuText: {
    color: "#fff",
    fontWeight: "bold",
  },
  activeCategoryItem: {
    backgroundColor: "#007BFF",
  },
  activeCategoryText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MarketDetails;
