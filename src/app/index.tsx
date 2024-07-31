
import React from "react";

import { Text, TouchableOpacity, View } from "react-native";
import {
  MapPin,
  PhoneCall,
  PlusCircleIcon,
  User,
} from "lucide-react-native"; // Import Lucid React icons
import GoldIteamIcon from "@/constants/Golditemicon";
import { ScrollView } from "react-native";
import { router } from "expo-router";

export default function Page() {
  return (
    
    <View className="flex mx-2 flex-1">
    
      <TopCard />
      <Statics />
      <ShowPayment />
    </View>
  );
}

export function ShowPayment() {
  return (
    <View className="w-full h-[50%] mt-9  pb-8 flex flex-col justify-stretch border-b-2 border-x-2 px-2 rounded-xl border-cpurple">
          <Text className="text-cpurple text-center  border -top-4  rounded-full text-md  font-normal p-3 ">Upcoming Payments</Text>
      <ScrollView className="w-full  ">
    
        <View className="w-full h-11 border-b-2 flex flex-row items-center justify-evenly ">
          <Text>Name</Text>
          <Text> Date</Text>
          <Text>Amount</Text>
        </View>
        <View className="w-full h-11 border-b-2 flex flex-row items-center justify-evenly ">
          <Text>Adarsh</Text>
          <Text> 2/2/2024</Text>
          <Text>1000</Text>
        </View>
        <View className="w-full h-11 border-b-2 flex flex-row items-center justify-evenly ">
          <Text>Adarsh</Text>
          <Text> 2/2/2024</Text>
          <Text>1000</Text>
        </View>
        <View className="w-full h-11 border-b-2 flex flex-row items-center justify-evenly ">
          <Text>Adarsh</Text>
          <Text> 2/2/2024</Text>
          <Text>1000</Text>
        </View>
        <View className="w-full h-11 border-b-2 flex flex-row items-center justify-evenly ">
          <Text>Adarsh</Text>
          <Text> 2/2/2024</Text>
          <Text>1000</Text>
        </View>
        <View className="w-full h-11 border-b-2 flex flex-row items-center justify-evenly ">
          <Text>Adarsh</Text>
          <Text> 2/2/2024</Text>
          <Text>1000</Text>
        </View>
        <View className="w-full h-11 border-b-2 flex flex-row items-center justify-evenly ">
          <Text>Adarsh</Text>
          <Text> 2/2/2024</Text>
          <Text>1000</Text>
        </View>
        <View className="w-full h-11 border-b-2 flex flex-row items-center justify-evenly ">
          <Text>Adarsh</Text>
          <Text> 2/2/2024</Text>
          <Text>1000</Text>
        </View>
        <View className="w-full h-11 border-b-2 flex flex-row items-center justify-evenly ">
          <Text>Adarsh</Text>
          <Text> 2/2/2024</Text>
          <Text>1000</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export function Statics() {
  return (
    <View className="flex flex-row iteam-center justify-evenly  h-[24%]">
      <View className="flex flex-col item-center justify-between h-full p-1  w-[35%]">
        <Text className="font-light text-center text-md  text-black  w-auto ">
          Total
        </Text>
        <Text className="font-light text-center text-md  text-black  w-auto ">
          Loans
        </Text>
        <Text className="font-normal text-center text-xl mb-3 text-yellow">
          +20
        </Text>
        <Text className="font-light text-center text-md  text-black w-auto ">
          Payment
        </Text>
        <Text className="font-light text-center text-md  text-black w-auto ">
          Remaining
        </Text>
        <Text className="font-normal text-center text-xl text-yellow">+0</Text>
      </View>
      <View className="flex flex-col item-center justify-center h-full w-[30%]">
          <TouchableOpacity onPress={()=>{
            // console.log("tap");
            router.push("/addloan");
          }}>
        <View className="flex flex-row items-center justify-center">

        <PlusCircleIcon
          color="orange"
          size={100}
          strokeWidth={1}
          fill={"white"}
          className="hover:fill-yellow"
        />
        </View>
        <Text className="text-center text-black text-lg font-light">
          Create Loan
        </Text>
        </TouchableOpacity>
          
      </View>
      <View className="flex flex-col item-center justify-between h-full p-1  w-[35%]">
        <Text className="font-light text-center text-md  text-black w-auto ">
          Active
        </Text>
        <Text className="font-light text-center text-md  text-black w-auto ">
          Loans
        </Text>
        <Text className="font-normal text-center text-xl mb-4 text-yellow">
          +20
        </Text>
        <Text className="font-light text-center text-md  text-black w-auto ">
          Total
        </Text>
        <Text className="font-light text-center text-md  text-black w-auto ">
          Customers
        </Text>
        <Text className="font-normal text-center text-xl text-yellow ">+10</Text>
      </View>
    </View>
  );
}

export function TopCard() {
  return (
    <View className="bg-transparent flex flex-row iteam-center justify-center w-auto h-[26%] m-2  rounded-lg ">
      <View className="p-1 flex flex-col  justify-evenly items-center  h-[100%] w-[50%]">
        <View className=" px-2 p-1 mb-4 m-1 mr-2 border-2  border-black/50 rounded-xl">
          <GoldIteamIcon />
        </View>
      </View>
      <View className="p-1 flex flex-col  justify-evenly items-start  h-[100%] w-[50%]">
        <Text className=" font-normal text-2xl  text-cpurple  text-start ">
          Shop Name
        </Text>
        <View className=" flex flex-row iteam-center justify-evenly">
          <MapPin size={20} color="black" style={{ marginTop: 3 }} />
          <View className="w-[90%] h-auto pl-2 flex">

          <Text className="text-[12px] text-justify font-normal flex ">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </Text>
          </View>
        </View>
        <View className=" flex flex-row iteam-center justify-evenly">
          <PhoneCall size={20} color="black" style={{ top:4}} />
          <Text className="text-md font-normal px-2 py-1">+91 9004353415</Text>
        </View>
      </View>
    </View>
  );
}
