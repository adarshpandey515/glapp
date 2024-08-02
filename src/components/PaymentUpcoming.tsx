import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { PaymentWithCustomerResponseDatabase,useRepository } from "../database/query"; // Adjust the import path

export function ShowPayment() {
  const [payments, setPayments] = useState<PaymentWithCustomerResponseDatabase[]>([]);
    const {getAllPaymentsDueSoon,updatePaymentStatus}=useRepository();
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentsData = await getAllPaymentsDueSoon();
        setPayments(paymentsData);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      }
    };

    fetchPayments();
  }, []);

  const handlePaymentClick = (paymentId: number) => {
    Alert.alert(
      "Payment Done?",
      "Mark this payment as completed?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            updatePaymentStatus(paymentId, 'completed');
            setPayments((prevPayments) =>
              prevPayments.filter((payment) => payment.payment_id !== paymentId)
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View className="w-full h-[50%] mt-9 pb-10 flex flex-col justify-stretch border-b-2 border-x-2 px-2 rounded-xl border-cpurple">
      <Text className="text-cpurple text-center border -top-4 rounded-full text-md font-normal p-3">
        Upcoming Payments
      </Text>
      <ScrollView className="w-full">
        <View className="w-full h-11 border-b-2 flex flex-row items-center justify-evenly">
          <Text>Name</Text>
          <Text>Date</Text>
          <Text>Amount</Text>
        </View>
        {payments.length === 0 ? (
          <View className="w-full h-11 border-b-2 flex flex-row items-center justify-evenly">
            <Text>No payments registered</Text>
          </View>
        ) : (
          payments.map((payment, index) => (
            <TouchableOpacity
              key={index}
              className="w-full h-11 border-b-2 flex flex-row items-center justify-evenly"
              onPress={() => handlePaymentClick(payment.payment_id)}
            >
                
              <Text>{payment.name}</Text>
              <Text>{payment.payment_date}</Text>
              <Text>{payment.amount}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
