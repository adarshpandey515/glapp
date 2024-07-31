import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRepository, CustomerCreateDatabase, LoanCreateDatabase, CustomerResponseDatabase, PaymentCreateDatabase, GoldItemCreateDatabase } from '../../database/query'; // Adjust the import path

export default function AddLoan() {
  const { insertCustomer, getAllCustomers, insertLoan, insertPayment, insertGoldItem } = useRepository();
  
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [customers, setCustomers] = useState<CustomerResponseDatabase[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerResponseDatabase[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerCreateDatabase | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | undefined>("");

  const [customerForm, setCustomerForm] = useState<CustomerCreateDatabase>({
    name: '',
    date_of_birth: '',
    gender: 'M',
    marital_status: '',
    pan_number: '',
    address: '',
    pincode: '',
    state: '',
    phone: '',
    email: '',
    account_number: '',
    ifsc: '',
    photo: '',
    shop_id: 1
  });

  const [loanForm, setLoanForm] = useState<LoanCreateDatabase>({
    customer_id: 0,
    loan_amount: 0,
    interest_rate: 0,
    end_date: '',
    start_date: new Date().toISOString().split('T')[0],
    status: 'starting',
    num_of_gold_items: 1,
    overdue_interest_rate: 0,
  });
   
  const [responseLoadId,setresponLoadId] = useState(0);

  const [goldItems, setGoldItems] = useState<GoldItemCreateDatabase[]>([]);
  const [showGoldItemForm, setShowGoldItemForm] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const customers = await getAllCustomers();
    setCustomers(customers);
  };

  const handleSearch = (text: string) => {
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleCustomerSelect = (customer: CustomerResponseDatabase) => {
    setSelectedCustomer(customer);
    setLoanForm({ ...loanForm, customer_id: customer.customer_id });
  };

  const handlePhotoPick = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      allowsEditing: true,
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    if (!result.canceled && result.assets[0].base64) {
      setPhotoBase64(result.assets[0].base64);
      setCustomerForm({ ...customerForm, photo: result.assets[0].base64 ?? '' });
    }
  };

  const handleSaveCustomer = async () => {
    if (!customerForm.name || !customerForm.pan_number || !customerForm.phone || !customerForm.email) {
      alert('Please fill out all required fields.');
      return;
    }

    const customerId = await insertCustomer({ ...customerForm, photo: photoBase64 });
    setLoanForm({ ...loanForm, customer_id: customerId });
    alert('Customer saved successfully.');
  };

  const handleSaveLoan = async () => {
    if (!loanForm.loan_amount || !loanForm.interest_rate || !loanForm.end_date) {
      alert('Please fill out all required fields.');
      return;
    }

    const loanId = await insertLoan(loanForm);
    setresponLoadId(loanId);
    // Save payment transactions for each month
    const startDate = new Date(loanForm.start_date);
    const endDate = new Date(loanForm.end_date);
    const months = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

    for (let i = 0; i < months; i++) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + i);
      const paymentForm: PaymentCreateDatabase = {
        gold_loan_id: loanId,
        transaction_id: '',
        payment_date: paymentDate.toISOString().split('T')[0],
        amount: loanForm.loan_amount / months,
        status: 'pending'
      };
      await insertPayment(paymentForm);
    }

    alert('Loan saved successfully.');

    // Show form to save gold items
    setShowGoldItemForm(true);
  };

  const handleSaveGoldItem = async (index: number, goldItemForm: GoldItemCreateDatabase) => {
    if (!goldItemForm.item_description || !goldItemForm.weight || !goldItemForm.karat || !goldItemForm.appraisal_value) {
      alert('Please fill out all required fields.');
      return;
    }

    await insertGoldItem({ ...goldItemForm, loan_id: responseLoadId ?? 0 });

    if (index === loanForm.num_of_gold_items ?? 1 - 1 ) {
      alert('All gold items saved successfully.');
      setShowGoldItemForm(false);
    }
  };

  const calculateMonthlyPayment = () => {
    const { loan_amount, interest_rate, end_date, start_date } = loanForm;
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const months = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const totalInterest = loan_amount * (interest_rate / 100) * (months / 12);
    const totalAmount = loan_amount + totalInterest;
    const monthlyPayment = totalAmount / months;

    return {
      totalAmount,
      monthlyPayment
    };
  };

  const { totalAmount, monthlyPayment } = calculateMonthlyPayment();

  return (
    <ScrollView className='flex-1 p-2 mb-2 pb-2'>
      <Text className='text-xl font-bold mb-4'>Add Loan</Text>

      <View className='mb-4'>
        <Button title={isNewCustomer ? 'Existing Customer' : 'New Customer'} onPress={() => setIsNewCustomer(!isNewCustomer)} />
      </View>

      {isNewCustomer ? (
        <View>
          <TextInput className='mb-2 border p-2' placeholder='Name' value={customerForm.name} onChangeText={text => setCustomerForm({ ...customerForm, name: text })} />
          <TextInput className='mb-2 border p-2' placeholder='Date of Birth' value={customerForm.date_of_birth} onChangeText={text => setCustomerForm({ ...customerForm, date_of_birth: text })} />
          <TextInput className='mb-2 border p-2' placeholder='Gender' value={customerForm.gender} onChangeText={text => setCustomerForm({ ...customerForm, gender: text })} />
          <TextInput className='mb-2 border p-2' placeholder='Marital Status' value={customerForm.marital_status} onChangeText={text => setCustomerForm({ ...customerForm, marital_status: text })} />
          <TextInput className='mb-2 border p-2' placeholder='PAN Number' value={customerForm.pan_number} onChangeText={text => setCustomerForm({ ...customerForm, pan_number: text })} />
          <TextInput className='mb-2 border p-2' placeholder='Address' value={customerForm.address} onChangeText={text => setCustomerForm({ ...customerForm, address: text })} />
          <TextInput className='mb-2 border p-2' placeholder='Pincode' value={customerForm.pincode} onChangeText={text => setCustomerForm({ ...customerForm, pincode: text })} />
          <TextInput className='mb-2 border p-2' placeholder='State' value={customerForm.state} onChangeText={text => setCustomerForm({ ...customerForm, state: text })} />
          <TextInput className='mb-2 border p-2' placeholder='Phone' value={customerForm.phone} onChangeText={text => setCustomerForm({ ...customerForm, phone: text })} />
          <TextInput className='mb-2 border p-2' placeholder='Email' value={customerForm.email} onChangeText={text => setCustomerForm({ ...customerForm, email: text })} />
          <TextInput className='mb-2 border p-2' placeholder='Account Number' value={customerForm.account_number} onChangeText={text => setCustomerForm({ ...customerForm, account_number: text })} />
          <TextInput className='mb-2 border p-2' placeholder='IFSC' value={customerForm.ifsc} onChangeText={text => setCustomerForm({ ...customerForm, ifsc: text })} />
          <View className='m-1 p-1'>

          <Button title="Pick Photo" onPress={handlePhotoPick} />
          {photoBase64 && <Image source={{ uri: `data:image/jpeg;base64,${photoBase64}` }} className='w-full h-40 mt-4' />}
          
          </View>
          <View className='m-1 p-1'>

          <Button title="Save Customer" onPress={handleSaveCustomer} />
          </View>
        </View>
      ) : (
        <View>
          <TextInput className='mb-2 border p-2' placeholder='Search by Name' onChangeText={handleSearch} />
          {filteredCustomers.map(customer => (
            <TouchableOpacity key={customer.customer_id} onPress={() => handleCustomerSelect(customer)}>
              <Text className='p-2 border'>{customer.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedCustomer || isNewCustomer ? (
        <View className='mb-12 p-1 pb-2'>
          <Text className='text-lg font-bold mt-4'>Loan Details</Text>
          <Text>Total Loan Amount: {totalAmount}</Text>
          <Text>Monthly Payment Amount: {monthlyPayment}</Text>
          <TextInput className='mb-2 border p-2' placeholder='Loan Amount' onChangeText={text => setLoanForm({ ...loanForm, loan_amount: parseFloat(text) })} />
          <TextInput className='mb-2 border p-2' placeholder='Interest Rate' onChangeText={text => setLoanForm({ ...loanForm, interest_rate: parseFloat(text) })} />
          <TextInput className='mb-2 border p-2' placeholder={`Start date : ${loanForm.start_date}`} onChangeText={text => setLoanForm({ ...loanForm, start_date: text })} />
          <TextInput className='mb-2 border p-2' placeholder='End Date' onChangeText={text => setLoanForm({ ...loanForm, end_date: text })} />
          <TextInput className='mb-2 border p-2' placeholder='Status' onChangeText={text => setLoanForm({ ...loanForm, status: text })} />
          <TextInput className='mb-2 border p-2' placeholder='Number of Gold Items' onChangeText={text => setLoanForm({ ...loanForm, num_of_gold_items: parseInt(text) })} />
          <TextInput className='mb-2 border p-2' placeholder='Overdue Interest Rate' onChangeText={text => setLoanForm({ ...loanForm, overdue_interest_rate: parseFloat(text) })} />
          <Button title="Save Loan" onPress={handleSaveLoan} />
        </View>
      ) : null}

      {showGoldItemForm && (
        <View>
          {Array.from({ length: loanForm.num_of_gold_items ?? 0}).map((_, index) => (
            <View key={index}>
              <Text className='text-lg font-bold mt-4'>Gold Item {index + 1}</Text>
              <TextInput className='mb-2 border p-2' placeholder='Item Description' onChangeText={text => setGoldItems(items => items.map((item, i) => i === index ? { ...item, item_description: text } : item))} />
              <TextInput className='mb-2 border p-2' placeholder='Weight' onChangeText={text => setGoldItems(items => items.map((item, i) => i === index ? { ...item, weight: parseFloat(text) } : item))} />
              <TextInput className='mb-2 border p-2' placeholder='Karat' onChangeText={text => setGoldItems(items => items.map((item, i) => i === index ? { ...item, karat: parseInt(text) } : item))} />
              <TextInput className='mb-2 border p-2' placeholder='Appraisal Value' onChangeText={text => setGoldItems(items => items.map((item, i) => i === index ? { ...item, appraisal_value: parseFloat(text) } : item))} />
              <Button title={`Save Gold Item ${index + 1}`} onPress={() => handleSaveGoldItem(index, goldItems[index])} />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
