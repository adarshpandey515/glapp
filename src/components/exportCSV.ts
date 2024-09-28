import * as FileSystem from 'expo-file-system';

import { CustomerResponseDatabase,LoanResponseDatabase,PaymentResponseDatabase,GoldItemResponseDatabase } from '@/database/query';
// Function to export data to a CSV file
export async function exportToCSV(customers:CustomerResponseDatabase[], loans:LoanResponseDatabase[], goldItems:GoldItemResponseDatabase[], payments:PaymentResponseDatabase[]) {
  // Create maps to group related records
  const loanMap = new Map();
  const paymentMap = new Map();
  const goldItemMap = new Map();

  loans.forEach(loan => {
    if (!loanMap.has(loan.customer_id)) {
      loanMap.set(loan.customer_id, []);
    }
    loanMap.get(loan.customer_id).push(loan);
  });

  payments.forEach(payment => {
    if (!paymentMap.has(payment.gold_loan_id)) {
      paymentMap.set(payment.gold_loan_id, []);
    }
    paymentMap.get(payment.gold_loan_id).push(payment);
  });

  goldItems.forEach(goldItem => {
    if (!goldItemMap.has(goldItem.loan_id)) {
      goldItemMap.set(goldItem.loan_id, []);
    }
    goldItemMap.get(goldItem.loan_id).push(goldItem);
  });

  // Create a CSV string for each customer with their related records
  // console.log("Loan map",loanMap);
  // console.log("Payments map",paymentMap);
  // console.log("GoldItems",goldItemMap)
  let csvContent = '';
  
  for (const customer of customers) {
    console.log(customer.IFSC)
    // Customer data
// Helper function to safely wrap a value in quotes if it contains a comma or double quote
const escapeCsvValue = (value: string) => {
  if (value.includes(',') || value.includes('"')) {
    // Escape double quotes by replacing " with ""
    value = value.replace(/"/g, '""');
    // Wrap the value in double quotes
    return `"${value}"`;
  }
  return value;
};

// Build the CSV content with escaped values
csvContent += `Customer,${customer.customer_id},${escapeCsvValue(customer.name)},${escapeCsvValue(customer.date_of_birth)},${escapeCsvValue(customer.gender)},${escapeCsvValue(customer.marital_status)},${escapeCsvValue(customer.pan_number)},${escapeCsvValue(customer.address)},${escapeCsvValue(customer.pincode)},${escapeCsvValue(customer.state)},${escapeCsvValue(customer.phone)},${escapeCsvValue(customer.email)},${escapeCsvValue(customer.account_number)},${(customer.IFSC)},${escapeCsvValue(customer.photo)},${(customer.shop_id)}\n`;
  
    // Loans related to the customer
    if (loanMap.has(customer.customer_id)) {
      loanMap.get(customer.customer_id).forEach(loan => {
        // console.log(loan);
        csvContent += `Loan,${loan.loan_id},${loan.customer_id},${loan.loan_amount},${loan.interest_rate},${loan.start_date},${loan.end_date},${loan.status},${loan.num_of_gold_items},${loan.overdue_interest_rate},${(loan.payment_date)},${loan.total_missed_payments}\n`;
  
        // Payments related to the loan
        if (paymentMap.has(loan.loan_id)) {
          paymentMap.get(loan.loan_id).forEach(payment => {
            csvContent += `Payment,${payment.payment_id},${payment.gold_loan_id},${payment.transaction_id},${payment.payment_date},${payment.amount},${payment.status}\n`;
          });
        }
  
        // Gold items related to the loan
        if (goldItemMap.has(loan.loan_id)) {
          goldItemMap.get(loan.loan_id).forEach(goldItem => {
            csvContent += `GoldItem,${goldItem.gold_item_id},${goldItem.loan_id},${goldItem.item_description},${goldItem.item_type},${goldItem.weight},${goldItem.karat},${goldItem.appraisal_value},${goldItem.normal_photo},${goldItem.weighted_photo},${goldItem.num_pieces}\n`;
          });
        }
      });
    }
  
    csvContent += '\n'; // Separate customers by a blank line
  }
  

  const dir = FileSystem.documentDirectory + 'exports/';
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

  const filePath = dir + 'MJdata.csv';
  await FileSystem.writeAsStringAsync(filePath, csvContent);
  csvContent='';
  return filePath;
}
