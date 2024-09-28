import React from "react";
import { Button, Alert, View, Text, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useRepository } from "../../database/query"; // adjust the path
import { exportToCSV } from "../../components/exportCSV"; // adjust the path
import * as Animatable from "react-native-animatable";
import * as DocumentPicker from 'expo-document-picker';
import Nloading from "../../components/loader";
import { CustomerResponseDatabase,LoanResponseDatabase,PaymentResponseDatabase,GoldItemResponseDatabase } from "../../database/query";
const ExportImportComponent = () => {
  const [loading, setLoading] = React.useState(false);
  const { insertCustomer, insertLoan, insertGoldItem, insertPayment } = useRepository();
  const { getAllCustomers, getAllLoans, getAllGoldItems, getAllPayments } = useRepository();

  const handleExport = async () => {
    try {
      const customers : CustomerResponseDatabase[] =  getAllCustomers();
      const loans:LoanResponseDatabase[] =  getAllLoans();
      const goldItems:GoldItemResponseDatabase[] =  getAllGoldItems();
      const payments:PaymentResponseDatabase[] =  getAllPayments();
      setLoading(true);
      const filePath = await exportToCSV(customers, loans, goldItems, payments);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          dialogTitle: "Share your file",
          mimeType: "text/csv",
        });
        setLoading(false);
      } else {
        setLoading(false);
        Alert.alert("Sharing Not Available", "Sharing is not available on this device.");
      }
      setLoading(false);

    } catch (error) {
      Alert.alert("Export Error", "An error occurred while exporting the CSV file.");
      console.error("Export Error:", error);
    }
  };

  // Function to parse CSV data manually
  const parseCSV = (csvContent: string) => {
    const rows = csvContent.split('\n').filter(row => row.trim() !== '');
    
    return rows.map(row => {
      const values = [];
      let current = '';
      let inQuotes = false;
  
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"' && inQuotes && row[i + 1] === '"') {
          // Handle escaped double quote
          current += '"';
          i++; // Skip the next character (the second quote)
        } else if (char === '"') {
          // Toggle the inQuotes flag
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          // If we reach a comma and we are not inside quotes, finalize the value
          values.push(current.trim());
          current = '';
        } else {
          // Add the character to the current value
          current += char;
        }
      }
      
      // Add the last value
      values.push(current.trim());
  
      return values;
    });
  };
  
    
 
  async function handleImport() {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (!result.canceled) {
        const fileUri = result.assets[0].uri;
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        
        // Parsing CSV content
        const parsedData = parseCSV(fileContent);
        if(parsedData) console.log("date ")
        let currentCustomerId = null;
        let currentLoanId = null;
       
        for (let i = 0; i < parsedData.length; i++) {
          // console.log("endtered looop",parsedData[i])
          const rowData = parsedData[i];
    

          if (rowData[0] === 'Customer') {
            // Insert customer
            currentCustomerId = await insertCustomer({
              name: rowData[2],
              date_of_birth: rowData[3],
              gender: rowData[4] || "M",
              marital_status: rowData[5] || "",
              pan_number: rowData[6] || "",
              address: rowData[7] || "",
              pincode: rowData[8] || "",
              state: rowData[9] || "",
              phone: rowData[10],
              email: rowData[11],
              account_number: rowData[12] || "",
              ifsc: rowData[13] || "",
              photo: rowData[14],
              shop_id: Number(rowData[15]) || 1,
            });
            
            console.log('New Customer ID:', currentCustomerId);
          } else if (rowData[0] === 'Loan' && currentCustomerId) {
            // Insert loan
            console.log("laon aya adding")
            currentLoanId = await insertLoan({
              customer_id: currentCustomerId,
              loan_amount: parseInt(rowData[3]),                // Assuming loan_amount is at index 2
              interest_rate: parseInt(rowData[4]),              // Assuming interest_rate is at index 3
              start_date: rowData[5],                           // Assuming start_date is at index 4
              end_date: rowData[6],                             // Assuming end_date is at index 5
              status: rowData[7] || "pending",                 // Assuming status is at index 6
              num_of_gold_items: parseInt(rowData[8]) || 0,     // Assuming num_of_gold_items is at index 7
              overdue_interest_rate: parseInt(rowData[9]) || 0, // Assuming overdue_interest_rate is at index 8
              payment_date: rowData[10] || new Date().toISOString().split("T")[0], // Assuming payment_date is at index 9
              total_missed_payments: parseInt(rowData[11]) || 0 // Assuming total_missed_payments is at index 10
            });
          
            console.log('New Loan ID:', currentLoanId);
          } else if (rowData[0] === 'Payment' && currentLoanId) {
            // Insert payment
            await insertPayment({
              gold_loan_id: currentLoanId,
              transaction_id: rowData[3] || "",                // Assuming transaction_id is at index 2
              payment_date: rowData[4],                        // Assuming payment_date is at index 3
              amount: parseInt(rowData[5]),                    // Assuming amount is at index 4
              status: rowData[6] || "pending"                  // Assuming status is at index 5
            });
          
            console.log('Payment Inserted for Loan ID:', currentLoanId);
          } else if (rowData[0] === 'GoldItem' && currentLoanId) {
            // Insert gold item
            await insertGoldItem({
              loan_id: currentLoanId,
              item_description: rowData[3],                   // Assuming item_description is at index 2
              item_type: rowData[4] || "other",               // Assuming item_type is at index 3
              weight: parseInt(rowData[5]),                   // Assuming weight is at index 4
              karat: parseInt(rowData[6]),                    // Assuming karat is at index 5
              appraisal_value: parseInt(rowData[7]) || -1,    // Assuming appraisal_value is at index 6
              normal_photo: rowData[8],                       // Assuming normal_photo is at index 7
              weighted_photo: rowData[9],                     // Assuming weighted_photo is at index 8
              num_pieces: parseInt(rowData[10]) || 0           // Assuming num_pieces is at index 9
            });
          
            console.log('Gold Item Inserted for Loan ID:', currentLoanId);
          }
          
          // Handle empty line or end of customer block
          if (!rowData[0] && i < parsedData.length - 1) {
            // Reset for the next customer
            console.log("empty line")
            currentCustomerId = null;
            currentLoanId = null;
          }
        }
  
      }
    } catch (error) {
      Alert.alert('Import Error', 'An error occurred while importing the CSV file.');
      console.error('Import Error:', error);
    }
  }

  if(loading) {
    return <Nloading />
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        Export and Import Your Data
      </Text>
      <Animatable.View animation="pulse" iterationCount="infinite" duration={1000} easing="ease-out" style={{ width: "100%", alignItems: "center" }}>
        <TouchableOpacity onPress={handleExport}>
          <Text
            style={{
              backgroundColor: "white",
              padding: 16,
              borderRadius: 24,
              borderWidth: 2,
              fontSize: 18,
              margin: 30,
            }}
          >
            Export Data
          </Text>
        </TouchableOpacity>
      </Animatable.View>
      <View><Text className="text-black text-xl p-8">OR</Text></View>
      <Animatable.View animation="pulse" iterationCount="infinite" duration={1000} easing="ease-out" style={{ width: "100%", alignItems: "center" }}>
        <TouchableOpacity onPress={handleImport}>
          <Text
            style={{
              backgroundColor: "black",
              padding: 16,
              borderRadius: 24,
              fontSize: 18,
              margin: 30,
            }}
            className="text-white"
          >
            Import Data
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default ExportImportComponent;
