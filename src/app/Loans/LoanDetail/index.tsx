import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, ScrollView, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {useRepository} from '../../../database/query'; // Adjust the import path
import { PaymentResponseDatabase ,GoldItemResponseDatabase} from '../../../database/query';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';



import { Download, DownloadIcon, SearchCheckIcon } from 'lucide-react-native';




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


  const generatePDF = async () => {
   const htmlContent=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .container {
            margin: 4%;
            padding: 2%;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            flex-direction: column;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            border-radius: 10px;
            width: 95%;
        }

        .section {
            border: 2px solid rgb(155, 102, 4);
            border-radius: 3%;
            padding: 6px;
            margin: 5px 0;
           

          
            width: 80%; /* Allow the section to expand */
        }

        .section h2 {
            color: rgb(167, 110, 5);
            padding: 2px;
            margin: 5px 20px;
        }

        .section p {
            font-size: medium;
            padding: 1px;
        }

        .customer-photo, .gold-item-photo {
            width: 150px;
            height: 150px;
            border-width: 2px;
            border-radius: 10%;
            border: 2px solid black;
        }

        .gold-item-photo-large {
            width: 300px;
            height: 300px;
            margin: 10px;
        }

        .payment-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            font-size: small;
        }

        .gold-item-photos {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Customer Details</h1>
        <div class="section">
            <div style="display: flex; justify-content: center;">
                <img src="data:image/png;base64,${loanDetails.photo}" class="customer-photo" alt="Customer Img"/>
            </div>
            <h2>${loanDetails.name}</h2>
            <p>Customer ID: ${loanDetails.customer_id}</p>
            <p>Date of Birth: ${loanDetails.date_of_birth}</p>
            <p>Gender: ${loanDetails.gender}</p>
            <p>Marital Status: ${loanDetails.marital_status}</p>
            <p>PAN Number: ${loanDetails.pan_number}</p>
            <p>Address: ${loanDetails.address}</p>
            <p>Pincode: ${loanDetails.pincode}</p>
            <p>State: ${loanDetails.state}</p>
            <p>Phone: ${loanDetails.phone}</p>
            <p>Email: ${loanDetails.email}</p>
            <p>Account Number: ${loanDetails.account_number}</p>
            <p>IFSC: ${loanDetails.IFSC}</p>
        </div>

        <h2>Loan Details</h2>
        <div class="section">
            <p>Loan ID: ${loanDetails.loan_id}</p>
            <p>Loan Amount: ₹${loanDetails.loan_amount}</p>
            <p>Interest Rate: ${loanDetails.interest_rate}%</p>
            <p>Start Date: ${loanDetails.start_date}</p>
            <p>End Date: ${loanDetails.end_date}</p>
            <p>Status: ${loanDetails.status}</p>
            <p>Number of Gold Items: ${loanDetails.num_of_gold_items}</p>
            <p>Overdue Interest Rate: ${loanDetails.overdue_interest_rate}%</p>
            <p>Payment Date: ${loanDetails.payment_date}</p>
            <p>Total Missed Payments: ${loanDetails.total_missed_payments}</p>
        </div>

        <h2>Payments</h2>
        <div class="section">
            ${payments.map(payment => `
                <div class="payment-details">
                    <p>₹${payment.amount.toFixed(3)}</p>
                    <p> ${payment.payment_date}</p>
                    <p> ${payment.status}</p>
                </div>
            `).join('')}
        </div>

        <h2>Gold Items</h2>
        <div class="section">
            ${goldItems.map(item => `
                <div class="gold-item-details">
                    <p>Ornament no: ${item.gold_item_id}</p>
                    <p>Type: ${item.item_type}</p>
                    <p>Name: ${item.item_description}</p>
                    <p>Weight: ${item.weight} grams</p>
                    <p>Karat: ${item.karat}</p>
                    <p>No of pieces: ${item.num_pieces}</p>
                    <p>Appraisal value: ${item.appraisal_value}</p>
                </div>
                <div class="gold-item-photos">
                    <img src="data:image/png;base64,${item.weighted_photo}" class="gold-item-photo-large" alt="Weighted Item Photo"/>
                    <img src="data:image/png;base64,${item.normal_photo}" class="gold-item-photo-large" alt="Normal Item Photo"/>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
`
    try {
        const file = await printToFileAsync({
      html: htmlContent,
      base64: false,

    });

    await shareAsync(file.uri, { 
      dialogTitle: 'Share PDF',
      UTI: 'hello.pdf',
    }
    );

    } catch (error) {
      console.error('Failed to generate PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };


  return (
    <View className='flex-1 '>
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
          <Text className="text-xl p-2 ml-1 text-yellow-500 mb-2"> Payment</Text>
          {payments.map(payment => (
            <View key={payment.payment_id} className='flex flex-row justify-between px-3 py-0.5 w-full items-center'>
              {/* <Text className="text-lg text-black">Payment ID: {payment.payment_id}</Text> */}
              <Text className="text-lg  text-black"> ₹{payment.amount.toFixed(2)}</Text>
              <Text className="text-lg  text-black">{payment.payment_date}</Text>
              <Text className="text-lg   text-black"> {payment.status}</Text>
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
            <Text className='text-xl '>{`Iteam no ${item.gold_item_id}`}</Text>
            <Text className="text-lg p-1 text-black">Type: {item.item_type}</Text>
            <Text className="text-lg p-1 text-black">Name: {item.item_description}</Text>
            <Text className="text-lg p-1 text-black">Weight: {item.weight} grams</Text>
            <Text className="text-lg p-1 text-black">Karat: {item.karat}</Text>
            <Text className="text-lg p-1 text-black">No of pieces: {item.num_pieces}</Text>
            <Text className="text-lg p-1 text-black">Appraisal value : {item.appraisal_value}</Text>
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
    <View className=' w-[45%] bg-black items-center justify-evenly flex-row rounded-xl p-2' style={{
      bottom: 4,
      right: 4,
      position: 'absolute',
    }}>
       <Download  color="white" size={20}/>
      <Button title="Generate PDF" onPress={generatePDF} color="black"  />
    </View>
    </View>
  );
};

export default LoanDetail;
