import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRepository } from "../../database/query"; // Adjust the import path
import GoldIteamIcon from "@/constants/Golditemicon";
import { GoldItemResponseDatabase } from "../../database/query";

// Define the type for gold items

const GoldCategoryGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [goldItems, setGoldItems] = useState<GoldItemResponseDatabase[]>([]);
  const { getAllGoldItems } = useRepository();

  useEffect(() => {
    const fetchGoldItems = async () => {
      try {
        const itemsData = await getAllGoldItems();
        setGoldItems(itemsData);
      } catch (error) {
        console.error("Failed to fetch gold items:", error);
      }
    };

    fetchGoldItems();
  }, []);

  const categories = Array.from(
    new Set(goldItems.map((item) => item.item_type))
  );

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredItems = selectedCategory
    ? goldItems.filter((item) => item.item_type === selectedCategory)
    : [];

  return (
    <View className="flex-1 bg-white p-5 ">
      {!selectedCategory ? (
        <ScrollView>
          <View
            style={{ alignContent: "flex-start" }}
            className="flex flex-row flex-wrap max-w-full max-h-full justify-evenly algin-center"
          >
            {categories.map((category, index) => {
              const categoryItems = goldItems.filter(
                (item) => item.item_type === category
              );
              const categoryImage =
                categoryItems.length > 0 && categoryItems[0].normal_photo
                  ? { uri: categoryItems[0].normal_photo }
                  : undefined;
              return (
                <TouchableOpacity
                  key={index}
                  className="w-[45%] max-w-[400px] m-1 rounded-2xl border-2 border-black p-[0px] bg-yellow -z-10 "
                  onPress={() => handleCategoryClick(category)}
                >
                  <View className="w-auto items-center justify-evenly h-36">
                    <View className="items-center justify-center bg-white w-full h-full rounded-2xl">
                      {categoryImage ? (
                        <Image
                          source={{ uri: `data:image/png;base64,${categoryItems[0].normal_photo}` }}
                          className="w-full h-full rounded-2xl"
                          resizeMode="stretch"
                          onError={() => <GoldIteamIcon />}
                        />
                      ) : (
                        <GoldIteamIcon />
                      )}
                    </View>
                  </View>
                  <Text className="text-lg text-light text-center">
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <ScrollView>
          <TouchableOpacity onPress={() => setSelectedCategory(null)}>
            <Text className="text-lg text-yellow">Back to Categories</Text>
          </TouchableOpacity>
          <View className="flex flex-wrap flex-row justify-evenly">
            {filteredItems.map((item, index) => (
              <View
                key={index}
                className="w-[45%] bg-yellow border-black m-2 rounded-2xl border-2"
              >
                <View className="items-center justify-center bg-white rounded-2xl w-full">
                  {item.normal_photo ? (
                    <Image
                    source={{ uri: `data:image/png;base64,${item.normal_photo}` }}
                      className="w-full h-40 rounded-2xl"
                      resizeMode="stretch"
                      onError={() => <GoldIteamIcon />}
                    />
                  ) : (
                    <GoldIteamIcon />
                  )}
                </View>
                <Text className="text-lg w-full text-center text-wrap font-medium text-black mt-1">
                  {item.item_description}
                </Text>
                <View className="flex flex-row items-center justify-evenly">
                  <Text className="text-sm m-1 font-normal text-black">
                    Weight: {item.weight}g
                  </Text>
                  <Text className="text-sm m-1 font-normal text-black">
                    Karat: {item.karat}K
                  </Text>
                </View>
                <View className="flex flex-row items-center justify-around">
                  <Text className="text-sm m-1 font-normal text-black">
                    Value: ${item.appraisal_value}
                  </Text>
                  <Text className="text-sm m-1 font-normal text-black">
                    Pieces: {item.num_pieces}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default GoldCategoryGrid;
