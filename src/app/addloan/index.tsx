import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from "expo-image-picker";
import {
  useRepository,
  CustomerCreateDatabase,
  LoanCreateDatabase,
  CustomerResponseDatabase,
  PaymentCreateDatabase,
  GoldItemCreateDatabase,
} from "../../database/query"; // Adjust the import path
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { Badge } from "react-native-paper";
import { SearchIcon } from "lucide-react-native";

export default function AddLoan() {
  const {
    insertCustomer,
    getAllCustomers,
    insertLoan,
    insertPayment,
    insertGoldItem,
  } = useRepository();

  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [customers, setCustomers] = useState<CustomerResponseDatabase[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<
    CustomerResponseDatabase[]
  >([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerCreateDatabase | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | undefined>("");

  const [customerForm, setCustomerForm] = useState<CustomerCreateDatabase>({
    name: "",
    date_of_birth: "Select Date",
    gender: "M",
    marital_status: "married",
    pan_number: "",
    address: "",
    pincode: "",
    state: "",
    phone: "",
    email: "",
    account_number: "",
    ifsc: "",
    photo: "",
    shop_id: 1,
  });

  const [loanForm, setLoanForm] = useState<LoanCreateDatabase>({
    customer_id: 0,
    loan_amount: 0,
    interest_rate: 0,
    end_date: "",
    start_date: dayjs(new Date()).format('DD-MM-YYYY'),
    status: "pending",
    num_of_gold_items: 1,
    overdue_interest_rate: 0,
  });

  const [responseLoadId, setResponseLoadId] = useState(0);

  const [goldItems, setGoldItems] = useState<GoldItemCreateDatabase[]>([]);
  const [showGoldItemForm, setShowGoldItemForm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState({
    customerDOB: false,
    loanStartDate: false,
    loanEndDate: false,
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const customers = await getAllCustomers();
    setFilteredCustomers(customers)
    setCustomers(customers);
  };

  const handleSearch = (text: string) => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCustomers(filtered);
    console.log(filtered);
  };

  const handleCustomerSelect = (customer: CustomerResponseDatabase) => {
    setSelectedCustomer(customer);
    setLoanForm({ ...loanForm, customer_id: customer.customer_id });
    setFilteredCustomers([]);
  };

  const handlePhotoPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      // use ImagePicker.launchCameraAsync for camera opening
      quality: 0.5,
      allowsEditing: true,
      base64: true,
      aspect:[1,1],
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    if (!result.canceled && result.assets[0].base64) {
      setPhotoBase64(result.assets[0].base64);
      setCustomerForm({
        ...customerForm,
        photo: result.assets[0].base64 ?? "",
      });
    }
  };

  const handleClickPhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      // use ImagePicker.launchCameraAsync for camera opening
      quality: 0.5,
      allowsEditing: true,
      aspect:[1,1],
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    if (!result.canceled && result.assets[0].base64) {
      setPhotoBase64(result.assets[0].base64);
      setCustomerForm({
        ...customerForm,
        photo: result.assets[0].base64 ?? "",
      });
    }
  };

  const handleSaveCustomer = async () => {
    if (!photoBase64) {
      Alert.alert("Please upload a photo.");
      return;
    }else if (!customerForm.date_of_birth || customerForm.date_of_birth === "Select Date" || customerForm.date_of_birth === "" || customerForm.date_of_birth === null || parseDate(customerForm.date_of_birth) > new Date()) {
      Alert.alert("Date of Birth invalid.");
      return;
    }else if (!customerForm.name ) {
      Alert.alert("Please enter a name.");
      return;
    }else if (!customerForm.pan_number ) {
      Alert.alert("Please enter a PAN number.");
      return;
    }else if (!customerForm.phone || customerForm.phone.length >=15) {
      Alert.alert("Please enter a Valid phone no.");
      return;
    }else if (!customerForm.email || !customerForm.email.includes("@") || !customerForm.email.includes(".") || customerForm.email.length < 5) {
      Alert.alert("Please enter an Valid email.");
      return;
    }


    if (
      !customerForm.name ||
      !customerForm.pan_number ||
      !customerForm.phone ||
      !customerForm.email
    ) {
      Alert.alert("Please fill out all required fields.");
      return;
    }

    const customerId = await insertCustomer({
      ...customerForm,
      photo: photoBase64,
    });
    setLoanForm({ ...loanForm, customer_id: customerId });
    Alert.alert("Customer saved successfully.");
  };

  const handleSaveLoan = async () => {
    if(!loanForm.customer_id){
      Alert.alert("Please select a customer.");
      return;
    }else if( loanForm.loan_amount < 0 || loanForm.loan_amount == null){
      Alert.alert("Loan amount must be greater equal to 0.");
      return;
    }else if(!loanForm.interest_rate 
      || loanForm.interest_rate < 0 || loanForm.interest_rate == null){
      Alert.alert("Interest rate must be greater than 0.");
      return;
    }else if(!loanForm.num_of_gold_items || loanForm.num_of_gold_items <= 0 || loanForm.num_of_gold_items == null){
      Alert.alert("Number of gold items must be greater than 0.");
      return;
    }else if(!loanForm.overdue_interest_rate || loanForm.overdue_interest_rate <0 || loanForm.overdue_interest_rate == null){
      Alert.alert("Overdue interest rate must be greater equal to   0.");
      return;
    }else if(!loanForm.end_date || !loanForm.start_date ||  parseDate(loanForm.start_date) > parseDate(loanForm.end_date)){
      Alert.alert("End date must be greater than start date.");
      return;
    }
    // Save loan
    const loanId = await insertLoan(loanForm);
    setResponseLoadId(loanId);
    // Save payment transactions for each month
    const startDate = parseDate(loanForm.start_date)
    const endDate = parseDate(loanForm.end_date)
    const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth();
    
    console.log(startDate,endDate,months);
    if(months <= 0){
      let paymentDate = new Date(endDate);
      const paymentForm: PaymentCreateDatabase = {
        gold_loan_id: loanId,
        transaction_id: "",
        payment_date: convertDateString(paymentDate.toISOString().split("T")[0]),
        amount: Number(totalAmount.toFixed(3)),
        status: "pending",
      };
      await insertPayment(paymentForm);
      console.log("payment form  ",paymentForm);
    }
    for (let i = 1; i <=months; i++) {
      let paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + i);
      if(paymentDate > endDate){
        paymentDate = new Date(endDate);
      } 
      const paymentForm: PaymentCreateDatabase = {
        gold_loan_id: loanId,
        transaction_id: "",
        payment_date: convertDateString(paymentDate.toISOString().split("T")[0]),
        amount: Number(monthlyPayment.toFixed(3)),
        status: "pending",
      };
      await insertPayment(paymentForm);
      console.log("payment form ",i," ",paymentForm);
    }

    Alert.alert("Loan saved successfully.");

    // Show form to save gold items
    setShowGoldItemForm(true);
  };

  const handleSaveGoldItem = async (
    index: number,
    goldItemForm: GoldItemCreateDatabase
  ) => {
    if (!goldItemForm.item_description) {
      Alert.alert("Please enter a name.");
      return;
    }else if (!goldItemForm.weight || goldItemForm.weight <= 0) {
      Alert.alert("Weight must be greater than 0.");
      return;
    }else if (!goldItemForm.karat || goldItemForm.karat <= 0) {
      Alert.alert("Karat must be greater than 0.");
      return;
    }
    else if (!goldItemForm.appraisal_value || goldItemForm.appraisal_value <= 0) {
      Alert.alert("Appraisal value must be greater than 0.");
      return;
    }

    if (
      !goldItemForm.item_description ||
      !goldItemForm.weight ||
      !goldItemForm.karat ||
      !goldItemForm.appraisal_value
    ) {
      Alert.alert("Please fill out all required fields.");
      return;
    }

    await insertGoldItem({ ...goldItemForm, loan_id: responseLoadId ?? 0 });

    if (index === (loanForm.num_of_gold_items ?? 1) - 1) {
      Alert.alert("All gold items saved successfully.");
      setShowGoldItemForm(false);
      router.back();
    }else{
      Alert.alert("Gold item saved successfully NO."+index.toLocaleString());
    }
  };

  function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-based in JavaScript Date
  }

  const calculateMonthlyPayment = () => {
    const { loan_amount, interest_rate, end_date, start_date } = loanForm;
  
  const startDate = parseDate(start_date);
  const endDate = parseDate(end_date);


  const months =
  (endDate.getFullYear() - startDate.getFullYear()) * 12 +
  endDate.getMonth() -
  startDate.getMonth();

    console.log("month one s ",startDate,endDate,months)
    const totalInterest = loan_amount * (interest_rate / 100) * (months / 12);
    let totalAmount = loan_amount + totalInterest;
    let monthlyPayment = totalAmount / months;

    return {
      totalAmount,
      monthlyPayment,
    };
  };

  let { totalAmount, monthlyPayment } = calculateMonthlyPayment();
  if(monthlyPayment == Infinity) monthlyPayment=totalAmount;

  const handleDateChange = (
    date: Date,
    type: "customerDOB" | "loanStartDate" | "loanEndDate"
  ) => {
    const formattedDate = dayjs(date).format("DD-MM-YYYY");
    setShowDatePicker({ ...showDatePicker, [type]: false });
    if (type === "customerDOB") {
      setCustomerForm({ ...customerForm, date_of_birth: formattedDate });
    } else if (type === "loanStartDate") {
      setLoanForm({ ...loanForm, start_date: formattedDate });
    } else if (type === "loanEndDate") {
      setLoanForm({ ...loanForm, end_date: formattedDate });
    }
  };

  const handleGoldItemPhotoPick = async (
    index: number,
    type: "normal" | "weighted"
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      allowsEditing: true,
      aspect:[1,1],
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    if (!result.canceled && result.assets[0].base64) {
      const updatedGoldItems = [...goldItems];
      if (type === "normal") {
        updatedGoldItems[index] = {
          ...updatedGoldItems[index],
          normal_photo: result.assets[0].base64 ?? "",
        };
      } else if (type === "weighted") {
        updatedGoldItems[index] = {
          ...updatedGoldItems[index],
          weighted_photo: result.assets[0].base64 ?? "",
        };
      }
      setGoldItems(updatedGoldItems);
    }
  };

  const handleGoldItemPhotoClick = async (
    index: number,
    type: "normal" | "weighted"
  ) => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      allowsEditing: true,
      base64: true,
      aspect:[1,1],
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    if (!result.canceled && result.assets[0].base64) {
      const updatedGoldItems = [...goldItems];
      if (type === "normal") {
        updatedGoldItems[index] = {
          ...updatedGoldItems[index],
          normal_photo: result.assets[0].base64 ?? "",
        };
      } else if (type === "weighted") {
        updatedGoldItems[index] = {
          ...updatedGoldItems[index],
          weighted_photo: result.assets[0].base64 ?? "",
        };
      }
      setGoldItems(updatedGoldItems);
    }
  };

  function convertDateString(dateString:string) {
    // Split the input date string by the hyphen
    const [year, month, day] = dateString.split('-');
    
    // Return the formatted date string
    return `${day}-${month}-${year}`;
  }


  const router = useRouter();

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-xl font-medium text-center text-balance mb-4">
        Add Loan
      </Text>

      <View className="mb-4">
        <Button
          title={isNewCustomer ? "Existing Customer" : "New Customer"}
          color="orange"
          onPress={() => setIsNewCustomer(!isNewCustomer)}
        />
      </View>

      {isNewCustomer ? (
        <View>
          <Text className="text text-lg font text mb-4">
            • Customer Details
          </Text>
          <TextInput
            className="mb-2 border border-yellow p-3 font-normal rounded-2xl"
            placeholder="Name"
            value={customerForm.name}
            autoComplete="name"
            inputMode="text"
            onChangeText={(text) =>
              setCustomerForm({ ...customerForm, name: text })
            }
          />

          <TouchableOpacity
            onPress={() =>
              setShowDatePicker({ ...showDatePicker, customerDOB: true })
            }
          >
            <View className="flex flex-row justify-start mb-3 items-center ">
              <Text className="text-lg font-medium mr-3  ">Date of Birth:</Text>
              <TextInput
                className=" border border-yellow rounded-2xl w-[30%] p-3 text-black text-center"
                value={customerForm.date_of_birth}
                editable={false}
              />
            </View>
          </TouchableOpacity>
          {showDatePicker.customerDOB && (
            <DateTimePicker
              mode="single"
              date={new Date()}
              onChange={(params) =>
                handleDateChange(params.date, "customerDOB")
              }
            />
          )}

          <View className="flex-row mb-3 flex items-center justify-start">
            <Text className="text-lg font-medium mr-3">Gender:</Text>
            <TouchableOpacity
              onPress={() => setCustomerForm({ ...customerForm, gender: "M" })}
            >
              <Text
                className={`p-3 border rounded-2xl ${
                  customerForm.gender === "M"
                    ? "border-yellow "
                    : "border-gray-300"
                }`}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCustomerForm({ ...customerForm, gender: "F" })}
            >
              <Text
                className={`p-3 border rounded-2xl ml-2 ${
                  customerForm.gender === "F"
                    ? "border-yellow"
                    : "border-gray-300"
                }`}
              >
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCustomerForm({ ...customerForm, gender: "O" })}
            >
              <Text
                className={`p-3 border rounded-2xl ml-2 ${
                  customerForm.gender === "O"
                    ? "border-yellow"
                    : "border-gray-300"
                }`}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row mb-3 items-center">
            <Text className="text-lg font-medium mr-3">Marital Status:</Text>
            <TouchableOpacity
              onPress={() =>
                setCustomerForm({ ...customerForm, marital_status: "married" })
              }
            >
              <Text
                className={`p-3 border rounded-2xl ${
                  customerForm.marital_status === "married"
                    ? "border-yellow"
                    : "border-gray-300"
                }`}
              >
                Married
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setCustomerForm({
                  ...customerForm,
                  marital_status: "unmarried",
                })
              }
            >
              <Text
                className={`p-3 border rounded-2xl ml-2 ${
                  customerForm.marital_status === "unmarried"
                    ? "border-yellow"
                    : "border-gray-300"
                }`}
              >
                Unmarried
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            className="mb-2 border border-yellow p-3 font-normal  rounded-2xl"
            placeholder="PAN Number"
            value={customerForm.pan_number}
            onChangeText={(text) =>
              setCustomerForm({ ...customerForm, pan_number: text })
            }
          />
          <TextInput
            className="mb-2 border border-yellow p-3 text-justify font-normal rounded-xl"
            placeholder="Address"
            multiline
            numberOfLines={4}
            value={customerForm.address}
            onChangeText={(text) =>
              setCustomerForm({ ...customerForm, address: text })
            }
          />
          <TextInput
            className="mb-2 border border-yellow p-3 font-normal rounded-2xl"
            placeholder="Pincode"
            inputMode="numeric"
            keyboardType="numeric"
            value={customerForm.pincode}
            onChangeText={(text) =>
              setCustomerForm({ ...customerForm, pincode: text })
            }
          />
          <TextInput
            className="mb-2 border border-yellow p-3 font-normal rounded-2xl"
            placeholder="Phone"
            inputMode="tel"
            keyboardType="number-pad"
            value={customerForm.phone}
            onChangeText={(text) =>
              setCustomerForm({ ...customerForm, phone: text })
            }
          />
          <TextInput
            className="mb-2 border border-yellow p-3 font-normal rounded-2xl"
            placeholder="Email"
            inputMode="email"
            keyboardType="email-address"
            value={customerForm.email}
            onChangeText={(text) =>
              setCustomerForm({ ...customerForm, email: text })
            }
          />
          <TextInput
            className="mb-2 border border-yellow p-3 font-normal rounded-2xl"
            placeholder="Account Number"
            inputMode="numeric"
            keyboardType="numeric"
            value={customerForm.account_number}
            onChangeText={(text) =>
              setCustomerForm({ ...customerForm, account_number: text })
            }
          />
          <TextInput
            className="mb-2 border border-yellow p-3 font-normal rounded-2xl"
            placeholder="IFSC"
            value={customerForm.ifsc}
            onChangeText={(text) =>
              setCustomerForm({ ...customerForm, ifsc: text })
            }
          />
          <View className=" flex flex-row items-center justify-evenly p-2 m-2 mb-2 ">
            <View className="flex felx-col iteam-center justify-evenly p-1 m-1 gap-1">
              <Button
                title="Upload Photo"
                color="orange"
                onPress={handlePhotoPick}
              />
              <Text className="text-center">OR</Text>
              <Button
                title="Click Photo"
                color="orange"
                onPress={handleClickPhoto}
              />
            </View>
            {photoBase64 ? (
              <Image
                source={{ uri: `data:image/png;base64,${photoBase64}` }}
                style={{
                  width: 100,
                  height: 100,
                  marginTop: 10,
                  borderRadius: 10,
                  right: 0,
                }}
              />
            ) : null}
          </View>
          <View className="my-2 pb-2 w-full   ">
            <Button
              title="Save Customer"
              color="orange"
              onPress={handleSaveCustomer}
            />
          </View>
        </View>
      ) : (
        <View>
          <View className="flex flex-row items-center justify-between p-2 px-5 m-2 rounded-2xl border-2 border-yellow">
            <TextInput
              className="w-[80%] text-lg bg-transparent text-black outline-none"
              placeholder="Search By Loan ID"
              placeholderTextColor="#787878"
              onChangeText={handleSearch}
            />
            <SearchIcon size={18} color="black" />
          </View>
          {filteredCustomers.map((customer) => (
            <TouchableOpacity
              key={customer.customer_id}
              onPress={() => handleCustomerSelect(customer)}
            >
              <Text className="mb-3 p-3 border border-yellow rounded-2xl">
                {customer.name}
              </Text>
            </TouchableOpacity>
          ))}
          {selectedCustomer && (
            <View className="flex flex-col items-center justify-evenly">
              <Image
                source={{ uri: `data:image/png;base64,${selectedCustomer.photo}` }}
                style={{
                  width: 100,
                  height: 100,
                  marginTop: 10,
                  borderRadius: 10,
                  right: 0,
                }}
              />
              <Text className="text-xl font-bold mt-4">
             {selectedCustomer.name}
              </Text>
            </View>
          )}
        </View>
      )}

      <View className="mt-4">
        <Text className="text text-lg font text mb-4">• Loan Details</Text>
        <View className="flex flex-row  justify-evenly">
          <TextInput
            className="mb-3   border border-yellow   rounded-2xl p-1"
            inputMode="numeric"
            placeholder="Loan Amount"
            onChangeText={(text) =>
              setLoanForm({ ...loanForm, loan_amount: parseFloat(text) || 0 })
            }
            keyboardType="numeric"
          />
          <TextInput
            className="mb-3  border border-yellow  rounded-2xl p-1"
            inputMode="numeric"
            placeholder="Interest Rate (%)"
            onChangeText={(text) =>
              setLoanForm({ ...loanForm, interest_rate: parseFloat(text) || 0 })
            }
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity
          className="flex items-center flex-row text-black justify-evenly"
          onPress={() =>
            setShowDatePicker({ ...showDatePicker, loanStartDate: true })
          }
        >
          <Text>Start Date:</Text>
          <TextInput
            className="mb-3  border border-yellow w-32 text-black  rounded-2xl p-3"
            placeholder="Start Date"
            value={loanForm.start_date}
            editable={false}
          />
        </TouchableOpacity>
        {showDatePicker.loanStartDate && (
          <DateTimePicker
            mode="single"
            date={new Date()}
            onChange={(params) =>
              handleDateChange(params.date, "loanStartDate")
            }
          />
        )}

        <TouchableOpacity
          className="flex flex-row justify-evenly text-black items-center"
          onPress={() =>
            setShowDatePicker({ ...showDatePicker, loanEndDate: true })
          }
        >
          <Text>End Date:</Text>
          <TextInput
            className="mb-3 border border-yellow w-32 text-black  rounded-2xl p-3"
            placeholder="End Date"
            value={loanForm.end_date}
            editable={false}
          />
        </TouchableOpacity>
        {showDatePicker.loanEndDate && (
          <DateTimePicker
            mode="single"
            date={new Date()}
            onChange={(params) => handleDateChange(params.date, "loanEndDate")}
          />
        )}
        <View className="flex flex-row items-center justify-evenly gap-2 p-1">
          <TextInput
            className="mb-3 border border-yellow rounded-2xl p-1"
            placeholder="Overdue Interest Rate (%)"
            onChangeText={(text) =>
              setLoanForm({
                ...loanForm,
                overdue_interest_rate: parseFloat(text) || 0,
              })
            }
            keyboardType="numeric"
          />
          <TextInput
            className="mb-3 border border-yellow rounded-2xl p-1"
            placeholder="Number of Gold Items"
            onChangeText={(text) =>
              setLoanForm({
                ...loanForm,
                num_of_gold_items: parseInt(text) || 1,
              })
            }
            keyboardType="numeric"
          />
        </View>
        <Text className="text-lg font-medium mt-3">• Loan Calculation</Text>
        <Text className="mb-3 text-xl font-medium text-center mt-3">
          Monthly Payment: {monthlyPayment.toFixed(2)}
        </Text>
        <Text className="mb-3 text-xl font-medium text-center">
          Total Amount: {totalAmount.toFixed(2)}
        </Text>
        <View className="mb-4 pb-2 ">
          <Button title="Save Loan" color="orange" onPress={handleSaveLoan} />
        </View>
      </View>

      {showGoldItemForm && (
        <View>
          <Text className="text text-lg font text mb-4">• Gold Items</Text>
          {Array.from({ length: loanForm.num_of_gold_items ?? 0 }).map(
            (_, index) => (
              <View key={index} className="mb-14">
                <Text className="mb-2">• Gold Item {index + 1}</Text>
                <TextInput
                  className="mb-2 border border-yellow rounded-2xl p-3"
                  placeholder="Name"
                
                  // value={goldItems[index]?.item_description || ""}
                  onChangeText={(text) => {
                    const updatedGoldItems = [...goldItems];
                    updatedGoldItems[index] = {
                      ...updatedGoldItems[index],
                      item_description: text,
                    };
                    setGoldItems(updatedGoldItems);
                  }}
                />
                   <TextInput
                  className="mb-2 border border-yellow rounded-2xl p-3"
                  placeholder="Gold Category"
                
                  // value={goldItems[index]?.item_description || ""}
                  onChangeText={(text) => {
                    const updatedGoldItems = [...goldItems];
                    updatedGoldItems[index] = {
                      ...updatedGoldItems[index],
                      item_type: text,
                    };
                    setGoldItems(updatedGoldItems);
                  }}
                />
                <TextInput
                  className="mb-2 border border-yellow rounded-2xl p-3 text-center"
                  placeholder="Weight (grams)"
                  inputMode="numeric"
                  // value={goldItems[index]?.weight?.toString() || ""}
                  onChangeText={(text) => {
                    const updatedGoldItems = [...goldItems];
                    updatedGoldItems[index] = {
                      ...updatedGoldItems[index],
                      weight: parseFloat(text) || 0,
                    };
                    setGoldItems(updatedGoldItems);
                  }}
                  keyboardType="numeric"
                />
                <TextInput
                  className="mb-2 border border-yellow rounded-2xl p-3 text-center"
                  placeholder="Karat"
                  inputMode="numeric"
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const updatedGoldItems = [...goldItems];
                    updatedGoldItems[index] = {
                      ...updatedGoldItems[index],
                      karat: Number(text) || 0,
                    };
                    setGoldItems(updatedGoldItems);
                  }}
                />
                <TextInput
                  className="mb-2 border border-yellow rounded-2xl p-3 text-center"
                  placeholder="Appraisal Value"
                  inputMode="numeric"
                  // value={goldItems[index]?.appraisal_value?.toString() || ""}
                  onChangeText={(text) => {
                    const updatedGoldItems = [...goldItems];
                    updatedGoldItems[index] = {
                      ...updatedGoldItems[index],
                      appraisal_value: parseFloat(text) || 0,
                    };
                    setGoldItems(updatedGoldItems);
                  }}
                  keyboardType="numeric"
                />
                <Text className="text-normal">• Gold Item Photo</Text>
                <View className="flex-row items-center justify-evenly p-3 mb-5">
                <View className="flex-col w-40 justify-between mb-2 gap-1">
                  <Button
                    title="photo select "
                    color="orange"
                    onPress={() => handleGoldItemPhotoPick(index, "normal")}
                  />
                  <Text className="text-center">OR</Text>
                  <Button
                    title="Click Photo"
                    color="orange"
                    onPress={() => handleGoldItemPhotoClick(index, "normal")}
                  />
                </View>
                {goldItems[index]?.normal_photo ? (
                  <Image
                    source={{
                      uri: `data:image/png;base64,${goldItems[index].normal_photo}`,
                    }}
                    style={{
                      width: 100,
                      height: 100,
                      marginTop: 10,
                      borderRadius: 10,
                    }}
                  />
                ) : null}
                </View>
                <Text  className="text-normal">• Gold Iteam Weighted Photo</Text>
                <View className="flex-row items-center justify-evenly p-3 mb-5">
                <View className="flex-col w-40 justify-between mb-2 gap-1">
                  <Button
                    title="Photo Select"
                    color="orange"
                    onPress={() => handleGoldItemPhotoPick(index, "weighted")}
                  />
                  <Text className="text-center">OR</Text>
                  <Button
                    title="Click Photo"
                    color="orange"
                    onPress={() => handleGoldItemPhotoClick(index, "weighted")}
                  />
                </View>
                {goldItems[index]?.weighted_photo ? (
                  <Image
                    source={{
                      uri: `data:image/png;base64,${goldItems[index].weighted_photo}`,
                    }}
                    style={{
                      width: 100,
                      height: 100,
                      marginTop: 10,
                      borderRadius: 10,
                    }}
                  />
                ) : null}
                </View>
                <Button
                  title="Save Gold Item"
                  color="orange"
                  onPress={() => handleSaveGoldItem(index, goldItems[index])}
                />
              </View>
            )
          )}
        </View>
      )}
    </ScrollView>
  );
}
