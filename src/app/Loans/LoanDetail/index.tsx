import React from 'react';
import { View, Text, Button, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const LoanDetail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const loanDetails = JSON.parse(Array.isArray(params.loan) ? params.loan[0] : params.loan);
  console.log(loanDetails);

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {loanDetails.photo && (
        <Image
          source={{ uri: `data:image/png;base64,${loanDetails.photo}` }}
          className="w-full h-48 rounded-xl mb-4"
          resizeMode="cover"
        />
      )}
      <View className="p-4 border-2 border-yellow-500 rounded-xl mb-4">
        <Text className="text-2xl text-yellow-500 mb-2">{loanDetails.name}</Text>
        <Text className="text-lg text-black mb-1">Customer ID: {loanDetails.customer_id}</Text>
        <Text className="text-lg text-black mb-1">Date of Birth: {loanDetails.date_of_birth}</Text>
        <Text className="text-lg text-black mb-1">Gender: {loanDetails.gender}</Text>
        <Text className="text-lg text-black mb-1">Marital Status: {loanDetails.marital_status}</Text>
        <Text className="text-lg text-black mb-1">PAN Number: {loanDetails.pan_number}</Text>
        <Text className="text-lg text-black mb-1">Address: {loanDetails.address}</Text>
        <Text className="text-lg text-black mb-1">Pincode: {loanDetails.pincode}</Text>
        <Text className="text-lg text-black mb-1">State: {loanDetails.state}</Text>
        <Text className="text-lg text-black mb-1">Phone: {loanDetails.phone}</Text>
        <Text className="text-lg text-black mb-1">Email: {loanDetails.email}</Text>
        <Text className="text-lg text-black mb-1">Account Number: {loanDetails.account_number}</Text>
        <Text className="text-lg text-black mb-1">IFSC: {loanDetails.IFSC}</Text>
      </View>
      <View className="p-4 border-2 border-yellow-500 rounded-xl mb-4">
        <Text className="text-2xl text-yellow-500 mb-2">Loan Details</Text>
        <Text className="text-lg text-black mb-1">Loan ID: {loanDetails.loan_id}</Text>
        <Text className="text-lg text-black mb-1">Loan Amount: ₹{loanDetails.loan_amount}</Text>
        <Text className="text-lg text-black mb-1">Interest Rate: {loanDetails.interest_rate}%</Text>
        <Text className="text-lg text-black mb-1">Start Date: {loanDetails.start_date}</Text>
        <Text className="text-lg text-black mb-1">End Date: {loanDetails.end_date}</Text>
        <Text className="text-lg text-black mb-1">Status: {loanDetails.status}</Text>
        <Text className="text-lg text-black mb-1">Number of Gold Items: {loanDetails.num_of_gold_items}</Text>
        <Text className="text-lg text-black mb-1">Overdue Interest Rate: {loanDetails.overdue_interest_rate}%</Text>
        <Text className="text-lg text-black mb-1">Payment Date: {loanDetails.payment_date}</Text>
        <Text className="text-lg text-black mb-1">Total Missed Payments: {loanDetails.total_missed_payments}</Text>
      </View>
      <Button title="Back" onPress={() => router.back()} color="#F59E0B" />
    </ScrollView>
  );
};

export default LoanDetail;
