import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import {
  PaymentWithCustomerResponseDatabase,
  useRepository,
} from "../database/query"; // Adjust the import path
import { sendTestEmail } from "./mailer";
import { MailCheck, MailCheckIcon, MailXIcon } from "lucide-react-native";
export function ShowPayment() {
  const [payments, setPayments] = useState<
    PaymentWithCustomerResponseDatabase[]
  >([]);
  const { getAllPaymentsDueSoon, updatePaymentStatus } = useRepository();
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentsData = getAllPaymentsDueSoon();
        setPayments(paymentsData);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
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
            updatePaymentStatus(paymentId, "completed");
            setPayments((prevPayments) =>
              prevPayments.filter((payment) => payment.payment_id !== paymentId)
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const sendPendingEmails = async () => {
      for (const payment of payments) {
        if (payment.status === "pending") {
          const subject = `Payment Reminder from Your Shop`;
          const text = `Dear ${payment.name},\n\nThis is a reminder that your payment of $${payment.amount} is due on ${payment.payment_date}. Please make the payment at your earliest convenience.\n\nThank you,\nYour Shop`;
          const html = `<p>Dear ${payment.name},</p><p>This is a reminder that your payment of <b>$${payment.amount}</b> is due on <b>${payment.payment_date}</b>. Please make the payment at your earliest convenience.</p><p>Thank you,<br>Your Shop</p>`;

          try {
            await sendTestEmail(payment.email, subject, text, html);
            await updatePaymentStatus(payment.payment_id, "mail-sent");
            console.log(
              `Email sent successfully to ${payment.email} and status updated.`
            );
          } catch (error) {
            console.error(`Error sending email to ${payment.email}:`, error);
          }
        }
      }
    };

    if (payments.length > 0) {
      sendPendingEmails();
    }
  }, [payments]);

  return (
    <View className="w-full h-[45%] mt-12 pb-10 mb-2 flex flex-col justify-stretch border-b-2 border-x-2 px-2 rounded-xl border-cpurple">
      <Text className=" text-center border -top-4 rounded-full text-md font-normal p-3 bg-black text-white">
        Upcoming Payments
      </Text>
      <ScrollView className="w-full">
        <View className="w-full h-8 border-b-2 flex flex-row items-center justify-around">
          <Text>Mail</Text>
          <Text>Name</Text>
          <Text>Date</Text>
          <Text>Amount</Text>
        </View>
        {payments.length === 0 ? (
          <View className="w-full h-11 border-b-2 flex flex-row items-center justify-around">
            <Text>No payments registered</Text>
          </View>
        ) : (
          payments.map((payment, index) => (
            <TouchableOpacity
              key={index}
              className="w-full h-11 border-b-2 flex flex-row items-center justify-around"
              onPress={() => handlePaymentClick(payment.payment_id)}
            >
              {/* <Text>{payment.email}</Text> */}
              {payment.status === "mail-sent" ? (
                <MailCheckIcon color="black" size={17} />
              ) : (
                <MailXIcon color="black" size={17} />
              )}
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
