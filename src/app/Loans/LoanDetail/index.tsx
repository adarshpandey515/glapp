import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const LoanDetail = () => {
  const router = useRouter();
  const params= useLocalSearchParams();
//   console.log({loan});
    const loanDetails = JSON.parse(Array.isArray(params.loan) ? params.loan[0] : params.loan);
    console.log(loanDetails);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl text-black">{loanDetails.name}</Text>
      <Text className="text-lg text-black">Total Amount: {loanDetails.amount}</Text>
      <Text className="text-lg text-black">Amount Remaining: {loanDetails.amountRemaining}</Text>
      <Text className="text-md text-black">Start Date: {loanDetails.startDate}</Text>
      <Text className="text-md text-black">End Date: {loanDetails.endDate}</Text>
      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
};

export default LoanDetail;
