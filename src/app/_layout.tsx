// import "@/libs/dayjs";
// import "@/styles/global.css";

// import { Slot } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import * as SplashScreen from "expo-splash-screen";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// import { SQLiteProvider } from "expo-sqlite/next";
// import * as database from "@/database/init";

// import {
//   useFonts,
//   OpenSans_700Bold,
//   OpenSans_400Regular,
//   OpenSans_600SemiBold,
// } from "@expo-google-fonts/open-sans";

// import { colors } from "@/styles/colors";

// SplashScreen.preventAutoHideAsync();

// export default function Layout() {
//   const [fontsLoaded] = useFonts({
//     OpenSans_600SemiBold,
//     OpenSans_400Regular,
//     OpenSans_700Bold,
//   });

//   if (fontsLoaded) {
//     SplashScreen.hideAsync();
//   } else {
//     return;
//   }

//   return (
//     <GestureHandlerRootView
//       style={{ flex: 1, backgroundColor: colors.gray[600] }}
//     >
//       <StatusBar style="light" />
//       <SQLiteProvider databaseName="mygols.db" onInit={database.init}>
//         <Slot />
//       </SQLiteProvider>
//     </GestureHandlerRootView>
//   );
// }
import { SQLiteProvider } from "expo-sqlite/next";
import * as database from "@/database/init";
import "../styles/global.css";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  HandCoinsIcon,
  ShoppingBagIcon
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
    }

  }, [currentSegment]);

  const getMenuClass = (menu: string) => {
    return activeMenu === menu ? "bg-black/70" : "bg-transparent";
  };

  const getIconColor = (menu: string) => {
    return activeMenu === menu ? "orange" : "black";
  };

  const getTextClass = (menu: string) => {
    return activeMenu === menu ? "text-yellow" : "text-[black]";
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <View
      className="flex flex-row items-center bg-white rounded-full my-1 mx-2 justify-evenly"
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
            <HomeIcon size={20} color={getIconColor("Home")} />
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
            <HandCoinsIcon size={20} color={getIconColor("Loans")} />
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
            <ShoppingBagIcon size={20} color={getIconColor("Store")} />
            <Text className={`text-[10px] ${getTextClass("Store")}`}>Store</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

