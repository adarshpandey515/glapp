import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {useRepository} from '../../../database/query'; // Adjust the import path
import { PaymentResponseDatabase ,GoldItemResponseDatabase} from '../../../database/query';
const LoanDetail = () => {
  const router = useRouter();
  const {getAllPaymentsByLoanId} = useRepository();
  const {getAllGoldItemsByLoanId} = useRepository();
  const params = useLocalSearchParams();
  const loanDetails = JSON.parse(Array.isArray(params.loan) ? params.loan[0] : params.loan);
  // console.log(loanDetails);
  const [payments, setPayments] = useState<PaymentResponseDatabase[]>([]);
  const [goldItems, setGoldItems] = useState<GoldItemResponseDatabase[]>([]);

  useEffect(() => {
    const fetchGoldItems = async () => {
      try {
        const items = getAllGoldItemsByLoanId(loanDetails.loan_id);
        setGoldItems(items);
        console.log(" gold item came");
      } catch (error) {
        console.error('Failed to fetch gold items:', error);
      }
    };

    fetchGoldItems();
  }, [loanDetails.loan_id]);

  useEffect(( ) => {
    const fetchPayments = async () => {
      try {
        const loanPayments = getAllPaymentsByLoanId(loanDetails.loan_id);
        setPayments(loanPayments);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      }
    };

    fetchPayments();
  }, [loanDetails.loan_id]);

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="  mb-4">
      <View className="p-4 border-2 border-yellow rounded-xl mb-4">
      {loanDetails.photo && (
        <View className='flex flex-row justify-between items-center'>
          <View>

          <Text className="text-2xl text-yellow mb-2">{loanDetails.name}</Text>
          <Text className="text-lg text-black mb-1">Customer ID: {loanDetails.customer_id}</Text>
        <Text className="text-lg text-black mb-1">Date of Birth: {loanDetails.date_of_birth}</Text>
        <Text className="text-lg text-black mb-1">Gender: {loanDetails.gender}</Text>
          </View>
          <Image
            source={{ uri: `data:image/png;base64,${loanDetails.photo}` }}
            className="h-[100px]  w-[100px] rounded-xl mb-4"
            resizeMode="cover"
          />
        </View>
      )}

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
      <View className="p-4 border-2 border-yellow rounded-xl mb-4">
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

      <View className='border-yellow mb-4 rounded-xl p-1 border-2 '>
      {payments.length > 0 ? (
        <View className="mt-4 ">
          <Text className="text-2xl p-2 ml-1 text-yellow-500 mb-2"> Payment</Text>
          {payments.map(payment => (
            <View key={payment.payment_id} className='flex flex-row justify-evenly w-full items-center'>
              {/* <Text className="text-lg text-black">Payment ID: {payment.payment_id}</Text> */}
              <Text className="text-md w-30 text-black"> ₹{payment.amount.toPrecision(10)}</Text>
              <Text className="text-md w-30 text-black">{payment.payment_date}</Text>
              <Text className="text-md w-30 pb-2 text-black"> {payment.status}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text className="text-center text-red-500 mt-4">No payments registered for this loan.</Text>
      )}
      </View>
      <View  >
      {goldItems.length > 0 ? (
        goldItems.map(item => (
          <View key={item.loan_id} className="border-2 border-yellow p-2 mb-2 rounded-lg">
            {/* <Text className="text-lg text-black">Item ID: {item.loan_id}</Text> */}
            <Text>{`Iteam no ${item.gold_item_id}`}</Text>
            <Text className="text-md p-1 text-black">Type: {item.item_type}</Text>
            <Text className="text-md p-1 text-black">Name: {item.item_description}</Text>
            <Text className="text-md p-1 text-black">Weight: {item.weight} grams</Text>
            <Text className="text-md p-1 text-black">Karat: {item.karat}</Text>
            <Text className="text-md p-1 text-black">No of pieces: {item.num_pieces}</Text>
            <Text className="text-md p-1 text-black">Appraisal value : {item.appraisal_value}</Text>
            <View className='flex flex-row items-center justify-evenly pt-3'>
            <View >
              <Text className="text-md text-black">Weighted Photo</Text>
            <Image
            source={{ uri: `data:image/png;base64,${item.weighted_photo}` }}
            className="h-[100px]  w-[100px] rounded-xl mb-4"
            resizeMode="cover"
          />
            </View>
            <View>
              <Text className="text-md text-black">Normal Photo</Text>
            <Image
            source={{ uri: `data:image/png;base64,${item.normal_photo}` }}
            className="h-[100px]  w-[100px] rounded-xl mb-4"
            resizeMode="cover"
          />
          </View>
            </View>

          </View>
        ))
      ) : (
        <Text className="text-center text-red-500">No gold items registered for this loan.</Text>
      )}
        </View>


      <View className='mb-10'>

      <Button title="Back" onPress={() => router.back()} color="#F59E0B" />
      </View>
      </View>
    </ScrollView>
  );
};

export default LoanDetail;
