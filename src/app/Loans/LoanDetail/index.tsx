import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, ScrollView, Alert} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {useRepository} from '../../../database/query'; // Adjust the import path
import { PaymentResponseDatabase ,GoldItemResponseDatabase} from '../../../database/query';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import Nloader from '../../../components/loader';


import { DeleteIcon, Download, Trash, Trash2Icon } from 'lucide-react-native';

import { base64Image } from '@/components/ImgString';
import { qrbase64Image } from '@/components/QrcodeString';

const LoanDetail = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {getAllPaymentsByLoanId} = useRepository();
  const {getAllGoldItemsByLoanId , deleteLoanAndRelatedData} = useRepository();
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
      setLoading(true)
      try {
        const loanPayments = getAllPaymentsByLoanId(loanDetails.loan_id);
        setPayments(loanPayments);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      }
      setLoading(false)
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
                // margin: 5px;
                padding: 0;
                background-color: #f4f4f4;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
    
            .container {
              
                display: flex;
                align-items: center;
                justify-content: space-evenly;
                flex-direction: column;
                background-color: #fff;
            
               padding:3px;
               width: 100%;
            }
    
            .section {
                
                padding: 4px;
                // padding-top: 10px;
                // padding-bottom: 60px;
                // padding-top: 60px;
                // margin-bottom: 10px;
                // margin-top: 15px;
                // margin-bottom: 10px;
       
                width: 800px;
                height:1030px;

            }
    
            .section h2 {
                padding: 2px;
                margin: 5px 20px;
                color:rgb(4, 42, 53);
                text-align: center;
            }
    
        
            .section p {
                font-size: medium;
                padding-left: 50px;
                padding-right: 50px;
                color:black;    
            }
    
            .customer-photo, .gold-item-photo {
                width: 150px;
                height: 150px;
                border-width: 2px;
                border-radius: 10%;
                border: 2px solid black;
            }
    
            .gold-item-photo-large {
                width: 200px;
                height: 200px;
                margin: 10px;
                border-radius: 10px;
            }
    
            .payment-details {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;

                font-size: x-small;
            }
    
            .gold-item-photos {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
            
            }
        </style>
    </head>
    <body>
        <div class="container">
    
            <div class="section">
                <h2>Customer Details</h2>
                <div style="display: flex; justify-content: center;">
                    <img src="data:image/png;base64,${loanDetails.photo}" class="customer-photo" alt="Customer Img"/>
                </div>
                <h2 style="text-align: center;">${loanDetails.name}</h2>
                <div >
                    <div style="display: flex; justify-content:space-between;">
                        <p>Customer ID: ${loanDetails.customer_id}</p>
                        <p>Date of Birth: ${loanDetails.date_of_birth}</p>
                    </div>
                    <div style="display: flex; justify-content:space-between;">
    
                <p>Gender: ${loanDetails.gender}</p>
                <p>Marital Status: ${loanDetails.marital_status}</p>
                </div>
                <div style="display: flex; justify-content:space-between;">
    
                <p>PAN Number: ${loanDetails.pan_number}</p>
                <p> Aadhar card Number: ${loanDetails.state}</p>
                </div>
                <div style="display: flex; justify-content:space-between;">
    
    
                    <p>Address: ${loanDetails.address}</p>
                    <p>Pincode: ${loanDetails.pincode}</p>
                </div>
                <div style="display: flex; justify-content:space-between;">
                <p>State: ${loanDetails.state}</p>
                <p>Phone: ${loanDetails.phone}</p>
                </div>
                <div style="display: flex; justify-content:space-between;">
    
                <p>Email: ${loanDetails.email}</p>
                
                <p>Account Number: ${loanDetails.account_number}</p>
                </div>
                <p>IFSC: ${loanDetails.IFSC}</p>
                </div>
            </div>
    
            <div class="section">
                <h2>Loan Details</h2>
                <div>
    
                    <div style="display: flex; justify-content:space-between;">
    
                <p>Loan ID: ${loanDetails.loan_id}</p>
                <p>Loan Amount: ₹${loanDetails.loan_amount}</p>
                </div>
                <div style="display: flex; justify-content:space-between;">
    
                <p>Interest Rate: ${loanDetails.interest_rate}%</p>
                <p>Start Date: ${loanDetails.start_date}</p>
                </div>
                <div style="display: flex; justify-content:space-between;">
    
                <p>End Date: ${loanDetails.end_date}</p>
                <p>Status: ${loanDetails.status}</p>
                </div>
                <div style="display: flex; justify-content:space-between;">
                <p>Number of Gold Items: ${loanDetails.num_of_gold_items}</p>
                <p>Overdue Interest Rate: ${loanDetails.overdue_interest_rate}%</p>
                </div>
                <div style="display: flex; justify-content:space-between;">
                <p>Payment Date: ${loanDetails.payment_date}</p>
                <p>Total Missed Payments: ${loanDetails.total_missed_payments}</p>
                </div>
            </div>
                <div>
                    ${payments.map(payment => `
                        <div class="payment-details">
                            <p>₹${payment.amount.toFixed(3)}</p>
                            <p> ${payment.payment_date}</p>
                            <p> ${payment.status}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
    
         
    
            ${goldItems.map(item => `
                <div class="section">
                    <h2>Gold Items</h2>
    
                    <div class="gold-item-details " style="padding-bottom: 50px;" >
                        <div style="display: flex; justify-content:space-between;">
    
                            <p>Ornament no: ${item.gold_item_id}</p>
                            <p>Type: ${item.item_type}</p>
                        </div>
                        <div style="display: flex; justify-content:space-between;">
    
                        <p>Name: ${item.item_description}</p>
                        <p>Weight: ${item.weight} grams</p>
                        </div>
                        <div style="display: flex; justify-content:space-between;">
    
                        <p>Karat: ${item.karat}</p>
                        <p>No of pieces: ${item.num_pieces}</p>
                        </div>
                      
                    </div>
                     <div style="display: flex; justify-content:space-evenly; margin-top: 50px;">
    
                        <img src="data:image/png;base64,${item.weighted_photo}" class="gold-item-photo-large" alt=" Photo 1"/>
                        <img src="data:image/png;base64,${item.normal_photo}" class="gold-item-photo-large" alt=" Photo 2"/>
                    </div>
                </div>
                `).join('')}
                    <div class="section">
                        <div class="gold-item-photos" >
                            <img src="data:image/png;base64,${base64Image}" class="gold-item-photo-large" alt=" Photo 1"/>
                        </div>
                        <h2 style="padding-bottom: 30px;">Milan Jewellers</h2>
                        <p>
                            Email:milan@gmail.com
                        <p> 
                            Phone no:
                            <contact>
                                +91 9892562381
                            </contact>
                        </p>
                        <p style="font-style: italic;">
    
                            Address:
                          
                kajupada,Borivali (East)
    
                            
                        </p>
                        <div class="gold-item-photos" style="padding-top: 20px;" >
                            <img src="${qrbase64Image}" class="gold-item-photo-large" alt=" Photo 1"/>
                        </div>
                        <h2 style="padding-bottom: 50px;">Scan for Payment</h2>
                    </div>
        </div>
    </body>
    </html>
    `
    setLoading(true);
    try {
        const file = await printToFileAsync({
      html: htmlContent,
      base64: false,
   

    });

    await shareAsync(file.uri, { 
      dialogTitle: 'Share PDF',
      UTI: 'LoanDetail.pdf',
    }
    );
    setLoading(false);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  async function handleLoanDelete() {
    Alert.alert(
      'Delete Loan',
      'Are you sure you want to delete this loan?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              // await deleteLoan(loanDetails.loan_id);
              await deleteLoanAndRelatedData(loanDetails.loan_id);


              Alert.alert('Success', 'Loan deleted successfully');
              router.back();
            } catch (error) {
              console.error('Failed to delete loan:', error);
              Alert.alert('Error', 'Failed to delete loan');
            }
          },
        },
      ],
    );
  }

    if(loading){
      return(
  
        <Nloader/>
  
      )
    }

  
  return (
    <View className='flex-1 '>
    <ScrollView className="flex-1 bg-white p-4">
    <View className='flex flex-row items-center justify-evenly '>
      <View className='w-20'>

    <Button title="Back"  onPress={() => router.back()}  color="#F59E0B" />
      </View>
      <View className='flex flex-row items-center '>
      <Text className="text-2xl text-right text-red-600 p-3 rounded-2xl" onPress={handleLoanDelete}> Delete Loan </Text>
      <Trash2Icon size={20}  color="red" /></View>
      </View>
      <View className="  mb-4">
      <View className="p-4 border-2 border-yellow rounded-xl mb-4">
      {loanDetails.photo && (
        
        <View className='flex flex-col  '>
          
          <Image
            source={{ uri: `data:image/png;base64,${loanDetails.photo}` }}
            className="h-[100px]  w-[100px] rounded-xl mb-4 "
            resizeMode="cover"
          />
          <View>
          <Text className="text-2xl text-[#121212] mb-2">{loanDetails.name.toUpperCase()}</Text>
          <Text className="text-lg text-black mb-1">Customer ID: {loanDetails.customer_id}</Text>
        <Text className="text-lg text-black mb-1">Date of Birth: {loanDetails.date_of_birth}</Text>
        <Text className="text-lg text-black mb-1">Gender: {loanDetails.gender}</Text>
          </View>
        </View>
      )}

        <Text className="text-lg text-black mb-1">Marital Status: {loanDetails.marital_status}</Text>
        <Text className="text-lg text-black mb-1">PAN Number: {loanDetails.pan_number}</Text>
        <Text className="text-lg text-black mb-1">Address: {loanDetails.address}</Text>
        <Text className="text-lg text-black mb-1">Pincode: {loanDetails.pincode}</Text>
        <Text className="text-lg text-black mb-1">State: {loanDetails.state}</Text>
        <Text className="text-lg text-black mb-1">Phone: {loanDetails.phone}</Text>
        <Text className="text-lg text-black mb-1">Email: {loanDetails.email}</Text>
        <Text className="text-lg text-black mb-1">Addhar Card: {loanDetails.state}</Text>
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
          <View key={item.gold_item_id} className="border-2 border-yellow p-2 mb-2 rounded-lg">
            {/* <Text className="text-lg text-black">Item ID: {item.loan_id}</Text> */}
            <Text className='text-xl '>{`Ornament no ${item.gold_item_id}`}</Text>
            <Text className="text-lg p-1 text-black">Type: {item.item_type}</Text>
            <Text className="text-lg p-1 text-black">Name: {item.item_description}</Text>
            <Text className="text-lg p-1 text-black">Weight: {item.weight} grams</Text>
            <Text className="text-lg p-1 text-black">Karat: {item.karat}</Text>
            <Text className="text-lg p-1 text-black">No of pieces: {item.num_pieces}</Text>
            {/* <Text className="text-lg p-1 text-black">Appraisal value : {item.appraisal_value}</Text> */}
            <View className='flex flex-row items-center justify-evenly pt-3'>
            <View >
              <Text className="text-md text-black"> Photo 1</Text>
            <Image
            source={{ uri: `data:image/png;base64,${item.weighted_photo}` }}
            className="h-[100px]  w-[100px] rounded-xl mb-4"
            resizeMode="cover"
          />
            </View>
            <View>
              <Text className="text-md text-black" >Photo 2</Text>
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
