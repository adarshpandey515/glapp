import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import {
  PaymentWithCustomerResponseDatabase,
  useRepository,
} from "../database/query"; // Adjust the import path
import * as FileSystem from 'expo-file-system';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';




import { sendTestEmail } from "./mailer";
import { MailCheck, MailCheckIcon, MailXIcon } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { base64Image } from "./ImgString";
export function ShowPayment() {
 


  // const convertAssetToBase64 = async () => {
  //   try {
  //     const imagePath = FileSystem.bundleDirectory + '/assests/images/mj.jpeg';

  //     console.log(FileSystem.bundleDirectory+'')
  //     const base64String = await FileSystem.readAsStringAsync(imagePath, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });
  //     if(base64String){

  //       setBase64Image(`data:image/jpeg;base64,${base64String}`);
  //       console.log(base64Image)
  //     }
  //   } catch (error) {
  //     console.error('Error converting image to base64:', error);
  //   }
  // };

  const [loading, setLoading] = useState(false);


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

  const handlePaymentClick = (paymentId: number, amount: number, email: string, name: string) => {
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
      
                    const finalTransactionId =  "By Cash";
                    updatePaymentStatus(paymentId, "completed", finalTransactionId);
                    SendReceiptGeneratePDF(paymentId, amount, email, name, finalTransactionId);

                    // Update payments list or any other required action
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
          const subject = `Payment Reminder from Milan Jewellers`;
          const text = `Milan Jewellers`;
          const html =`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Reminder</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f9f9f9;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .email-container {
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 20px;
            max-width: 600px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .email-container p {
            margin: 0 0 15px;
            color: #333;
        }
        .email-container b {
            color: #d9534f;
        }
        .email-footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
        }
        .email-footer img {
            border: 1px solid #ccc;
            border-radius: 8px;
            width: 100px;
            height: auto;
            margin-top: 10px;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <p>Dear <b>${payment.name}</b>,</p>
        <p>This is a reminder that your payment of <b>$${payment.amount}</b> is due on <b>${payment.payment_date}</b>. Please make the payment at your earliest convenience.</p>
        <p>Thank you,<br><br>
        <span style="color: #333; font-weight: bold;">Milan Jewellers</span>
        </p>
        <div class="email-footer">
            <img src="data:image/png;base64,${base64Image}" alt="Milan Jewellers">
        </div>
    </div>

</body>
</html>
`;

          try {
            await updatePaymentStatus(payment.payment_id, "mail-sent","");
            await sendTestEmail(payment.email, subject, text, html);
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



  const SendReceiptGeneratePDF = async (
    PaymentId: number,
    amount: number,
    email: string,
    name: string,
    transaction_id: string | undefined
  ) => {
    // HTML content for the email and PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f9f9f9;
                padding: 20px;
            }
            .container {
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 10px;
                padding: 20px;
                max-width: 600px;
                margin: auto;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h1 {
                text-align: center;
                color: #333;
            }
            p {
                color: #333;
            }
            b {
                color: #d9534f;
            }
            .img-container {
                text-align: center;
                margin-top: 20px;
            }
            .img-container img {
                border: 1px solid #ccc;
                border-radius: 8px;
                width: 150px;
                height: auto;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Payment Receipt</h1>
            <p>Dear <b>${name}</b>,</p>
            <p>Thank you for your payment of <b>${amount} rupees</b>.</p>
            <p>Your payment has been successfully received and recorded.</p>
            <p>We appreciate your business!</p>
            <p>Thank you,<br><b>Milan Jewellers</b></p>
            <div class="img-container">
                <img src="data:image/png;base64,${base64Image}" alt="Company Logo">
            </div>
        </div>
    </body>
    </html>
    `;
  
    // Generate PDF from the HTML content
    const generatePDF = async () => {
      try {
        const file = await printToFileAsync({
          html: htmlContent,
          base64: false,
        });
        setLoading(true)
        // You can share the PDF or save it, depending on your use case
        await shareAsync(file.uri, {
          dialogTitle: 'Share PDF',
          UTI: 'application/pdf',
        });
        console.log("shared")
        setLoading(false)
        return file.uri; // Returning the URI of the generated PDF file
      } catch (error) {
        console.error('Failed to generate PDF:', error);
        throw error;
      }
    };
  
    try {
      // Generate the PDF
      const pdfUri = await generatePDF();
  
      // Send the email with the generated PDF and the HTML content
      const subject = 'Your Payment Receipt';
      const text = 'Milan Jewellers'; // Simple text for the email
      await sendTestEmail(email, subject, text, htmlContent);
  
      console.log('Receipt sent successfully.');
    } catch (error) {
      console.error('Error sending receipt:', error);
    }
  };
  
  const styles = StyleSheet.create({
    loadingContainer: {
      position: 'absolute', // Overlay on top of everything
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center', // Center the content vertically
      alignItems: 'center', // Center the content horizontally
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
  });

  return (
    <View className="w-full h-[45%] mt-12 pb-10 mb-2 flex flex-col justify-stretch border-b-2 border-x-2 px-2 rounded-xl border-cpurple">
       {loading && (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Generating and sharing the PDF...</Text>
      </View>
    )}
      <Text className=" text-center border -top-4 rounded-full text-md font-normal p-3  text-black">
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
              onPress={() => handlePaymentClick(payment.payment_id,payment.amount,payment.email,payment.name)}
            >
              {/* <Text>{payment.email}</Text> */}
              {payment.status === "mail-sent" ? (
                <MailCheckIcon color="black" size={17} />
              ) : (
                <MailXIcon color="#323232" size={17} />
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
