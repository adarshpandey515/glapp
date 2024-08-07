
import React from "react";
import { ShowPayment } from "@/components/PaymentUpcoming";
import { Text, TouchableOpacity, View } from "react-native";
import {
  MapPin,
  PhoneCall,
  PlusCircleIcon,
  User,
} from "lucide-react-native"; // Import Lucid React icons
import GoldIteamIcon from "@/constants/Golditemicon";
import { router } from "expo-router";
import { useRepository } from "@/database/query";
import MJphoto from "@/constants/MjPhoto";

export default function Page() {
  return (

    <View className="flex mx-2 flex-1">
      <TopCard />
      <Statics />
      <ShowPayment />
    </View>
  );
}

export function Statics() {
  const { countTotalLoans,
    countActiveLoans,
    countTotalCustomers,
    countPendingPayments,
  } = useRepository();

 const totalLoans =   countTotalLoans();
  const activeLoans = countActiveLoans();
  const totalCustomers = countTotalCustomers();
  const pendingPayments = countPendingPayments();
  console.log("totalLoans", totalLoans.lastInsertRowId.toLocaleString());
  console.log("activeLoans", activeLoans.lastInsertRowId.toLocaleString());
  console.log("totalCustomers", totalCustomers);
  console.log("pendingPayments", pendingPayments);


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
         +{totalLoans.lastInsertRowId.toLocaleString()}
        </Text>
        <Text className="font-light text-center text-md  text-black w-auto ">
          Payment
        </Text>
        <Text className="font-light text-center text-md  text-black w-auto ">
          Remaining
        </Text>
        <Text className="font-normal text-center text-xl text-yellow">+{pendingPayments.lastInsertRowId.toLocaleString()}</Text>
      </View>
      <View className="flex flex-col item-center justify-center h-full w-[30%]">
        <TouchableOpacity onPress={() => {
          // console.log("tap");
          router.push(`/addloan/`);
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
          +{activeLoans.lastInsertRowId.toLocaleString()}
        </Text>
        <Text className="font-light text-center text-md  text-black w-auto ">
          Total
        </Text>
        <Text className="font-light text-center text-md  text-black w-auto ">
          Customers
        </Text>
        <Text className="font-normal text-center text-xl text-yellow ">+{totalCustomers.lastInsertRowId.toLocaleString()}</Text>
      </View>
    </View>
  );
}

export function TopCard() {
  return (
    <View className="bg-[#151515]  flex flex-row iteam-center justify-center w-auto h-[26%] m-2  rounded-3xl ">
      <View className="p-1 flex flex-col  justify-evenly items-center  h-[100%] w-[50%]">
        <View className="  border p-1  border-yellow bg-[#151515] rounded-2xl">
          <MJphoto/>
        </View>
      </View>
      <View className="p-1 flex flex-col  justify-evenly items-start  h-[100%] w-[50%]">
        <Text className=" font-light text-xl  text-yellow  text-start ">
          Milan Jewellers
        </Text>
        <View className=" flex flex-row iteam-center justify-evenly">
          <MapPin size={20} color="white"  style={{ marginTop: 3 }} />
          <View className="w-[100%] px-2 h-auto  flex">

            <Text className="text-sm text-[#fffeee]  
            text-justify px-1  font-light flex ">
            kajupada Borivali East
            </Text>
          </View>
        </View>
        <View className=" flex flex-row text-[#fffeee] iteam-center justify-evenly">
          <PhoneCall size={20} color="white" style={{ top: 4 }} />
          <Text className="text-light font-light text-white px-2 py-1">+91 9892562381</Text>
        </View>
      </View>
    </View>
  );
}
