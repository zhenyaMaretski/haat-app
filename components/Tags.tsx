import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

interface TagsProps {
  tags: string[];
}

const Tags = ({ tags }: TagsProps): JSX.Element => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagContainer}
      >
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginTop: 20,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  tag: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  tagText: {
    color: "#333",
    fontSize: 14,
  },
});

export default Tags;
