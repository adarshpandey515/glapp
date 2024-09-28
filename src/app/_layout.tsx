
import { SQLiteProvider } from "expo-sqlite/next";
import * as database from "@/database/init";
import "../styles/global.css";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  HandCoinsIcon,
  ShoppingBagIcon,
  Import,
  Expand,
  FolderUpIcon
} from "lucide-react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex flex-1 items-stretch bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex flex-1 items-stretch bg-white">
      <SQLiteProvider databaseName="gla.db" onInit={database.init}>
        <Slot />     
        </SQLiteProvider>
        <Footer />
      </View>
    </View>
  );
}

function Footer() {
  const router = useRouter();
  const segments = useSegments();
  const { bottom } = useSafeAreaInsets();
  
  const currentSegment = segments[segments.length - 1];
  const [activeMenu, setActiveMenu] = useState("Home");

  useEffect(() => {
    if (currentSegment === "" || currentSegment === "Home"  || currentSegment == undefined) {
      setActiveMenu("Home");
    } else if (currentSegment === "Loans") {
      setActiveMenu("Loans");
    } else if (currentSegment === "Store") {
      setActiveMenu("Store");
    }else if(currentSegment=== "Export"){
      setActiveMenu("Export");
    }

  }, [currentSegment]);

  const getMenuClass = (menu: string) => {
    return activeMenu === menu ? "bg-black" : "bg-transparent";
  };

  const getIconColor = (menu: string) => {
    return activeMenu === menu ? "orange" : "black";
  };


  const getFillColor = (menu: string) => {
    return activeMenu === menu ? "none" : "none";
  }
  const getTextClass = (menu: string) => {
    return activeMenu === menu ? "text-yellow" : "text-[black]";
  };

  const navigateTo = (path:any) => {
    router.push(path);
  };

  return (
    <View
      className="flex flex-row items-center bg-white  mb-1 rounded-full mx-2 justify-evenly"
      style={{
        height: 60 + bottom,
        alignItems: "center",
        padding: 2,
        borderColor: "black",
        borderWidth: 2,
        justifyContent: "space-evenly",
      }}
      
    >
      {/* Home */}
      <TouchableOpacity
        onPress={function () {
          navigateTo("/");
          // setActiveMenu("Home");
        }}
        className="flex flex-col items-center justify-evenly"
      >
        <View className={`px-5 py-1 rounded-full ${getMenuClass("Home")}`}>
          <View className="flex items-center justify-center rounded-full" style={{ width: 50, height: 40 }}>
            <HomeIcon size={20} color={getIconColor("Home")} fill={getFillColor("Home")}  />
            <Text className={`text-[10px] ${getTextClass("Home")}`}>Home</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Loans */}
      <TouchableOpacity
        onPress={() => navigateTo("/Loans")}
        className="flex flex-col items-center justify-evenly"
      >
        <View className={`px-5 py-1 rounded-full ${getMenuClass("Loans")}`}>
          <View className="flex items-center justify-center rounded-full" style={{ width: 50, height: 40 }}>
            <HandCoinsIcon size={20} color={getIconColor("Loans")} fill={getFillColor("Loans")}  />
            <Text className={`text-[10px] ${getTextClass("Loans")}`}>Loans</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Store */}
      <TouchableOpacity
        onPress={() => navigateTo("/Store")}
        className="flex flex-col items-center justify-center px-0"
      >
        <View className={`px-5 py-1 rounded-full ${getMenuClass("Store")}`}>
          <View className="flex items-center justify-center rounded-full" style={{ width: 50, height: 40 }}>
            <ShoppingBagIcon size={20} color={getIconColor("Store")} fill={getFillColor("Store")} />
            <Text className={`text-[10px] ${getTextClass("Store")}`}>Store</Text>
          </View>
        </View>
      </TouchableOpacity>
      {/* export */}
      <TouchableOpacity
        onPress={() => navigateTo("/Export")}
        className="flex flex-col items-center justify-center px-0"
      >
        <View className={`px-5 py-1 rounded-full ${getMenuClass("Export")}`}>
          <View className="flex items-center justify-center rounded-full" style={{ width: 50, height: 40 }}>
            <FolderUpIcon size={20} color={getIconColor("Export")} fill={getFillColor("Export")} />
            <Text className={`text-[10px] ${getTextClass("Export")}`}>Export</Text>
          </View>
        </View>
      </TouchableOpacity>

    </View>
  );
}

