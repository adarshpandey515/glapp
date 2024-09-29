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
import * as Animatable from "react-native-animatable";
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
import { SaveAllIcon, SearchIcon } from "lucide-react-native";

export default function AddLoan() {
  let monthlyPaymentnumbers = 0;
  const [CustomerView, setCustomerView] = useState(true);
  const [LoanView, setLoanView] = useState(false);
const [showGoldItemForm, setShowGoldItemForm] = useState(false);

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
    if(!isNewCustomer){
      if(!selectedCustomer){
        Alert.alert("Please select a customer.");
        return;
      }
      setLoanView(true);
      setCustomerView(false);
      return;
    }else{
      
      
          if (!photoBase64) {
            Alert.alert("Please upload a photo.");
            return;
          }else if (!customerForm.date_of_birth || customerForm.date_of_birth === "Select Date" || customerForm.date_of_birth === "" || customerForm.date_of_birth === null || parseDate(customerForm.date_of_birth) > new Date()) {
            Alert.alert("Date of Birth is invalid.");
            return;
          }else if (!customerForm.name ) {
            Alert.alert("Please enter a name.");
            return;
          }else if (!customerForm.pan_number || customerForm.pan_number.length < 10 || customerForm.pan_number.length > 10) {
            Alert.alert("Pan number is invalid.");
            return;
          }else if (!customerForm.phone || customerForm.phone.length >10 || customerForm.phone.length < 10) {
            Alert.alert("Please enter a Valid phone no.");
            return;
          }else if (!customerForm.email || !customerForm.email.includes("@") || !customerForm.email.includes(".") || customerForm.email.length < 5 || customerForm.email.length > 50) {
            Alert.alert("Please enter an Valid email.");
            return;
          }else if (!customerForm.address || customerForm.address.length < 5 || customerForm.address.length > 1000) {
            Alert.alert("Please enter an Valid address.");
            return;
          }else if (!customerForm.pincode || customerForm.pincode.length < 6 || customerForm.pincode.length > 6) {
            Alert.alert("Please enter an Valid pincode.");
            return;
          }else if (!customerForm.state || customerForm.state.length < 12 || customerForm.state.length > 12 ){
            Alert.alert("Please enter an Valid Addhar Number.");
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
          setLoanView(true);
          setCustomerView(false);
    }


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


    // console.log(startDate,endDate,months);
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
    setLoanView(false);
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
    
    
    if (
      !goldItemForm.item_description ||
      !goldItemForm.weight ||
      !goldItemForm.karat 
    
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
      Alert.alert("Gold item saved successfully NO."+(index+1).toLocaleString());
    }
    setCurrentGoldItemIndex((prevIndex) => prevIndex + 1);

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
    monthlyPaymentnumbers = months;
    if(isNaN(monthlyPaymentnumbers)) monthlyPaymentnumbers=0;
    // const totalInterest = loan_amount * (interest_rate / 100) * (months / 12);
    let totalAmount = loan_amount ;
    let monthlyPayment = (Number)((totalAmount *interest_rate)/100);
    if(isNaN(monthlyPayment)) monthlyPayment=0;
    if(isNaN(totalAmount)) totalAmount=0
    return {
      totalAmount,
      monthlyPayment,
    };
  };

  let { totalAmount, monthlyPayment } = calculateMonthlyPayment();
  if(monthlyPayment == Infinity) monthlyPayment=totalAmount;

  const handleDateChange = (
    date: any,
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


  const [currentGoldItemIndex, setCurrentGoldItemIndex] = useState(0);
  const router = useRouter();

  return (
    <ScrollView className="flex-1 pb-4 px-4">
      <Text className="text-xl font-medium text-center text-balance mb-4 ">
        Add Loan
      </Text>
      
      
      
        {CustomerView && (

          <View>
           <View className="flex-row">
      <Text
        className={`text-lg p-1 w-1/2 text-center rounded-t-3xl ${
          isNewCustomer ? 'bg-[#121212] text-white' : 'bg-transparent text-black'
        }`}
        onPress={() => setIsNewCustomer(true)}
      >
        New Customer
      </Text>
      <Text
        className={`text-lg p-1 w-1/2 text-center rounded-t-3xl ${
          !isNewCustomer ? 'bg-[#121212] text-white' : 'bg-transparent text-black'
        }`}
        onPress={() => setIsNewCustomer(false)}
      >
        Existing Customer
      </Text>
    </View>

    <View className={`bg-[#121212] mb-5 rounded-b-3xl ${isNewCustomer ? 'rounded-r-3xl' : 'rounded-l-3xl'}`}>
    {isNewCustomer ? (
          <View className="p-1 px-5 text-white">
            <Text className="text text-lg text-yellow  p-3">
              --{">"} Customer Details
            </Text>
            <Text className="text-black p-1 bg-yellow  w-1/4 text-center rounded-t-xl  ">Name</Text>
            <TextInput
              className="mb-2  text-black bg-white px-3 p-1  rounded-b-xl rounded-r-xl"
          
              placeholder="Adarsh Pandey "
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
              <View className="flex flex-row justify-start  my-3 items-center ">
                <Text className="  text-black bg-yellow rounded-l-xl border border-yellow px-2 py-2">Date of Birth:</Text>
                <TextInput
                  className="  bg-white rounded-r-xl w-[30%] px-2 py-1 text-black text-center"
                  value={customerForm.date_of_birth}
                  editable={false}
                />
              </View>
            </TouchableOpacity>
            {showDatePicker.customerDOB && (
              <View className="bg-white rounded-3xl">

                <DateTimePicker
                  mode="single"
                
                  date={new Date()}
                  onChange={(params) =>
                  handleDateChange(params.date, "customerDOB")
                  }
                />
              </View>
            )}
  
            <View className="flex-row my-3 bg-white  flex items-center  rounded-xl">
              <Text className=" rounded-l-xl text-start bg-yellow border border-yellow text-black p-3  mr-5">Gender</Text>
              <View className="flex flex-row justify-evenly p-1">
              <TouchableOpacity
                onPress={() => setCustomerForm({ ...customerForm, gender: "M" })}
              >
                <Text
                  className={`p-1 border rounded-xl mr-5 ${
                    customerForm.gender === "M"
                      ? "bg-yellow  "
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
                  className={`p-1 border rounded-xl mr-4 ${
                    customerForm.gender === "F"
                      ? "bg-yellow"
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
                  className={`p-1 border rounded-xl  ${
                    customerForm.gender === "O"
                      ? "bg-yellow"
                      : "border-gray-300"
                  }`}
                >
                  Other
                </Text>
              </TouchableOpacity>
              </View>

            </View>
  
            <View className="flex-row my-3 bg-white items-center  justify-between pr-5 rounded-xl">
              <Text className=" px-3 mr-1 bg-yellow   p-2 border border-yellow rounded-l-xl">Marital Status</Text>
              <View className="flex flex-row  justify-start items-center">
              <TouchableOpacity
                onPress={() =>
                  setCustomerForm({ ...customerForm, marital_status: "married" })
                }
              >
                <Text
                  className={`p-1 mr-2 border rounded-xl ${
                    customerForm.marital_status === "married"
                      ? "bg-yellow"
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
                  className={`p-1 border rounded-xl ml-2 ${
                    customerForm.marital_status === "unmarried"
                      ? "bg-yellow"
                      : "border-gray-300"
                  }`}
                >
                  Unmarried
                </Text>
              </TouchableOpacity>
              </View>
            </View>
            <Text className="text-black p-1 mt-3 bg-yellow  w-1/3 text-center rounded-t-xl  ">Pan Number</Text>
            <TextInput
              className="mb-3  bg-white border-yellow p-1 font-normal  rounded-r-xl rounded-b-xl"
              placeholder="MGXTY12345"
               value={customerForm.pan_number}
              onChangeText={(text) =>
                setCustomerForm({ ...customerForm, pan_number: text })
              }
            />
            <Text className="text-black p-1 mt-3 bg-yellow  w-1/3 text-center rounded-t-xl  ">Address</Text>
            <TextInput
              className="mb-3  bg-white border-yellow p-1 item-start rounded-b-xl rounded-r-xl"
              placeholder="Address"
              multiline
              numberOfLines={3}
              value={customerForm.address}
              onChangeText={(text) =>
                setCustomerForm({ ...customerForm, address: text })
              }
            />
            <View className="flex flex-row items-center justify-between">
              <View  className="w-1/3">
            <Text className="text-black p-1 mt-3 bg-yellow   text-center rounded-t-xl  ">Pincode</Text>
            <TextInput
              className="mb-2  bg-white p-1 font-normal rounded-b-xl "
              placeholder="400004"
              inputMode="numeric"
              keyboardType="numeric"
              value={customerForm.pincode}
              onChangeText={(text) =>
                setCustomerForm({ ...customerForm, pincode: text })
              }
            />
            </View>
            <View className="w-[50%]">
            <Text className="text-black p-1 mt-3 bg-yellow   text-center rounded-t-xl  ">Phone</Text>
            <TextInput
              className="mb-2   p-1 font-normal rounded-b-xl bg-white "
              placeholder="9004353415"
              inputMode="tel"
              keyboardType="number-pad"
              value={customerForm.phone}
              onChangeText={(text) =>
                setCustomerForm({ ...customerForm, phone: text })
              }
            />
            </View>
            </View>
            <Text className="text-black w-1/3 p-1 mt-3 bg-yellow   text-center rounded-t-xl  ">Email</Text>

            <TextInput
              className="mb-2  bg-white p-1 font-normal rounded-b-xl rounded-r-xl"
              placeholder="addcd@gmail.com"
              inputMode="email"
              keyboardType="email-address"
              value={customerForm.email}
              onChangeText={(text) =>
                setCustomerForm({ ...customerForm, email: text })
              }
            />
             <Text className="text-black p-1 mt-3 bg-yellow  w-[43%] text-center rounded-t-xl  ">Accound Number</Text>

            <TextInput
              className="mb-2  bg-white p-1 font-normal rounded-b-xl  rounded-r-xl"
              placeholder="43343535353"
              inputMode="numeric"
              keyboardType="numeric"
              value={customerForm.account_number}
              onChangeText={(text) =>
                setCustomerForm({ ...customerForm, account_number: text })
              }
            />
             <Text className="text-black p-1 mt-3 bg-yellow  w-[43%] text-center rounded-t-xl  ">IFSC CODE</Text>
             <TextInput
              className="mb-2  bg-white p-1  rounded-b-xl rounded-r-xl"
              placeholder="SBIN0043"
              value={customerForm.ifsc}
              inputMode="text"
              onChangeText={(text) =>
                setCustomerForm({ ...customerForm, ifsc: text })
              }
            />
             <Text className="text-black p-1 mt-3 bg-yellow  w-[43%] text-center rounded-t-xl  "> Aadhar  Number</Text>
             <TextInput
             keyboardType="numeric"
            inputMode="numeric"
              className="mb-2  bg-white p-1  rounded-b-xl rounded-r-xl"
              placeholder="455443217574"
              value={customerForm.state}
              onChangeText={(text) =>
                setCustomerForm({ ...customerForm, state: text })
              }
            />
              <Text className="text-yellow text-lg p-3">--{">"} Customer Photo</Text>
            <View className=" flex flex-row items-center justify-evenly p-2 m-2 mb-2 ">
              <View className="flex felx-row iteam-center justify-evenly p-1 m-1 gap-1">
                <Button
                  title="Upload "
                  color="orange"
                  
                  
                  onPress={handlePhotoPick}
                />
                <Text className="text-center text-white">OR</Text>
                <Button
                  title="Click "
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
            <View className="my-2 pb-2 w-full  flex items-center ">
            <Animatable.View animation="pulse" iterationCount="infinite" duration={1000} easing="ease-out" style={{ width: "100%", alignItems: "center" }}>

              <TouchableOpacity
              className="bg-yellow p-2 w-1/2 flex flex-row justify-evenly rounded-xl"
                onPress={handleSaveCustomer}
              
              ><SaveAllIcon color="black"  size={20}></SaveAllIcon>
              <Text className="text-center"> Save Customer</Text></TouchableOpacity>
              </Animatable.View>
            </View>
          </View>
        ) : (
          <View className=" p-1 px-4" style={{height:460}}>
            <Text className="text-yellow">Search Customer</Text>
            <View className="flex   flex-row items-center mb-5 justify-between p-2 px-5 m-2 rounded-xl border-2 border-yellow">
              <TextInput
                className="w-[80%] text-lg bg-transparent text-white outline-none"
                placeholder="Search By Loan ID"
                placeholderTextColor="#787878"
                onChangeText={handleSearch}
              />
              <SearchIcon size={18} color="white" />
            </View>
            {filteredCustomers.map((customer) => (
              <TouchableOpacity
                key={customer.customer_id}
                onPress={() => handleCustomerSelect(customer)}
                className="mx-2 rounded-lg p-1 flex-row justify-between items-center border-yellow border-2 "
              >
                <Text className=" p-1 text-xl  text-white ">
                  {customer.name}
                </Text>
                <Image
                  source={{ uri: `data:image/png;base64,${customer.photo}` }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 3,
                  }}
                />
              </TouchableOpacity>
            ))}
            {selectedCustomer && (
              <View className="flex flex-col mt-9 items-center justify-evenly">
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
                <Text className="text-xl  text-white font-bold mt-4">
               {selectedCustomer.name}
                </Text>
                <View>
                  <Text className="text-white">DOB: {selectedCustomer.date_of_birth}</Text>
                </View>
                <View className="my-2 pb-2 w-full  flex items-center ">
            </View>

            <Animatable.View animation="pulse" iterationCount="infinite" duration={1000} easing="ease-out" style={{ width: "100%", alignItems: "center" }}>

            <TouchableOpacity
            className="bg-yellow p-2 w-1/2 flex flex-row justify-evenly rounded-xl"
              onPress={handleSaveCustomer}
            
            >
            <Text className="text-center"> Next </Text></TouchableOpacity>
            </Animatable.View>

            </View>
  
            )}
          </View>
        )}
        </View>
          </View>
       
        )
        }

        {LoanView && (

      <View className="mt-4 flex-1 items-center  px-5 z-0 rounded-3xl"> 
    
   <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent:"space-between" }}>
      <Text className="z-50 bg-black h-full  flex-grow rounded-t-3xl"></Text>
      <Text className="p-3 px-5  rounded-t-3xl text-lg font-bold text-black bg-yellow text-center ">
        Loan Details
      </Text>
      <Text className="z-100 bg-black h-full  rounded-t-3xl text-end flex-grow"></Text>
    </View>
        <View className="bg-black pt-7 rounded-b-3xl flex-grow w-full p-4">

        
        <View className="flex flex-row flex-1 gap-12   justify-between">
          <View className="w-auto ">

        <Text className="text-white p-1 rounded-t-xl bg-yellow">Loan Amount</Text>
          <TextInput
            className="mb-3 w-full  border  border-white bg-white flex-grow rounded-b-xl p-1"
            inputMode="numeric"
            placeholder="10000"
            
            onChangeText={(text) =>
              setLoanForm({ ...loanForm, loan_amount: parseFloat(text) || 0 })
            }
            keyboardType="numeric"
          />
          </View>
          <View>
          <Text className="text-white p-1 rounded-t-xl bg-yellow">Interest Rate(%)</Text>
          <TextInput
            className="mb-3   border border-white bg-white rounded-b-xl p-1"
            inputMode="numeric"
            placeholder="0"
            onChangeText={(text) =>
              setLoanForm({ ...loanForm, interest_rate: parseFloat(text) || 0 })
            }
            keyboardType="numeric"
          />
            </View>
        </View>
        <TouchableOpacity
          className="flex items-center  flex-row text-white  justify-between"
          onPress={() =>
            setShowDatePicker({ ...showDatePicker, loanStartDate: true })
          }
        >
          <Text className="text-black p-2 text-end rounded-xl bg-yellow">Start Date</Text>
          <TextInput
            className="mb-3  border border-yellow w-32 text-black bg-white rounded-xl p-2"
            placeholder="Start Date"
            value={loanForm.start_date}
            editable={false}
          />
        </TouchableOpacity>
        <View className="bg-white rounded-xl">
          
        {showDatePicker.loanStartDate && (
          <DateTimePicker
            mode="single"
            date={new Date()}
            onChange={(params) =>
              handleDateChange(params.date, "loanStartDate")
            }
          />
        )}
        </View>

        <TouchableOpacity
          className="flex flex-row justify-between text-white items-center"
          onPress={() =>
            setShowDatePicker({ ...showDatePicker, loanEndDate: true })
          }
        >
          <Text className="bg-yellow rounded-xl p-2">End Date</Text>
          <TextInput
            className="mb-3 border bg-white w-32 text-black  rounded-xl p-2"
            placeholder="End Date"
            value={loanForm.end_date}
            editable={false}
          />
        </TouchableOpacity>
        <View className="bg-white rounded-xl">
        {showDatePicker.loanEndDate && (
          <DateTimePicker
            mode="single"
            date={new Date()}
            onChange={(params) => handleDateChange(params.date, "loanEndDate")}
          />
        )}
</View>
        <View className="flex flex-row items-start justify-between gap-2 p-1">
          <View>

          <Text className="text-white p-1 rounded-t-xl bg-yellow">Overdue Interest</Text>
          <TextInput
            className="mb-3 border border-white bg-white  rounded-b-xl p-1"
            placeholder="0     "
            onChangeText={(text) =>
              setLoanForm({
                ...loanForm,
                overdue_interest_rate: parseFloat(text) || 0,
              })
            }
            keyboardType="numeric"
          />
          </View>
          <View>

          <Text className="text-white p-1 rounded-t-xl bg-yellow">No. of Gold Items</Text>
          <TextInput
            className="mb-3 border border-white bg-white  rounded-b-xl p-1"
            placeholder="0"
            onChangeText={(text) =>
              setLoanForm({
                ...loanForm,
                num_of_gold_items: parseInt(text) || 1,
              })
            }
            keyboardType="numeric"
          />
            </View>
        </View>
        {/* <Text className="text-lg font-normal text-yellow mt-3">--{">"} Loan Calculation</Text> */}
        <Text className="mb-3 text-xl font-light text-center text-yellow mt-3">
          Monthly Payment: {monthlyPayment.toFixed(2) || 0}
        </Text>
        <Text className="mb-3 text-xl font-light text-yellow text-center">
          Number of Months: {monthlyPaymentnumbers}
         
        </Text>
        <Animatable.View animation="pulse" iterationCount="infinite" duration={1000} easing="ease-out" style={{ width: "100%", alignItems: "center" }}>

        <View className=" rounded-b-xl items-center ">
          <Text  className="text-black border-yellow borderr-2  text-center w-1/3 bg-white p-3 items-center rounded-xl" onPress={handleSaveLoan} >Save Loan</Text>
        </View>
        </Animatable.View>
      </View>
      </View>
        )}

    

{showGoldItemForm && (
  <View >
    <Text className="text text-lg font text mb-4">• Gold Ornaments</Text>
    {Array.from({ length: loanForm.num_of_gold_items ?? 0 }).map(
      (_, index) => (
        currentGoldItemIndex === index && (
          <View key={index} className="mb-14 px-4 p-1 bg-black mx-3 rounded-3xl">
            <Text className="mb-3   text-lg text-black bg-white rounded-xl px-2 p-1  absolute left-0 ">{index + 1}</Text>


            <Text className="text-white p-1  mt-10 rounded-t-xl w-1/2 bg-yellow">Name / Model No.</Text>
            <TextInput
              className="mb-2 border border-white bg-white rounded-r-xl rounded-b-xl p-2"
              placeholder="Name"
              value={goldItems[index]?.item_description || ""}
              onChangeText={(text) => {
                const updatedGoldItems = [...goldItems];
                updatedGoldItems[index] = {
                  ...updatedGoldItems[index],
                  item_description: text,
                };
                setGoldItems(updatedGoldItems);
              }}
            />
           <Text className="mt-5 mb-1 p-1 text-yellow">Select Category</Text>
            <View className="flex-row text-black flex-wrap mb-2">
              {['Necklace', 'Earrings', 'Bracelet', 'Ring', 'Bangle', 'Pendant','Brooch','Other '].map((category) => (
                <TouchableOpacity
                  key={category}
                  className={`border border-yellow text-black rounded-xl p-2 m-1 ${
                    goldItems[index]?.item_type === category ? 'bg-yellow' : 'bg-white'
                  }`}
                  onPress={() => {
                    const updatedGoldItems = [...goldItems];
                    updatedGoldItems[index] = {
                      ...updatedGoldItems[index],
                      item_type: category,
                    };
                    setGoldItems(updatedGoldItems);
                  }}
                >
                  <Text
                    className={`${
                      goldItems[index]?.item_type === category ? 'text-black' : 'text-black'
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="flex flex-row justify-evenly items-center my-4">
              <View className="w-[40%]">

            <Text             className="mt-3   bg-yellow  rounded-t-xl p-1" >Weight (grams)</Text>
            <TextInput
              className=" border border-white w-[100%] bg-white rounded-b-xl  p-2 text-center"
              placeholder="Weight (grams)"
              inputMode="numeric"
              value={goldItems[index]?.weight?.toString() || ""}
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
              </View>
              <View className="w-[40%]">
              <Text className="text-black mt-4 p-1 rounded-t-xl text-center bg-yellow">Karat</Text>
              <TextInput
              className="mb-2 border border-white  bg-white w-[100%] rounded-b-xl p-2 text-center"
              placeholder="Karat"
              inputMode="numeric"
              keyboardType="numeric"
              value={goldItems[index]?.karat?.toString() || ""}
              onChangeText={(text) => {
                const updatedGoldItems = [...goldItems];
                updatedGoldItems[index] = {
                  ...updatedGoldItems[index],
                  karat: Number(text) || 0,
                };
                setGoldItems(updatedGoldItems);
              }}
            />
            </View>
              </View>
              
       
            <Text className="text-normal text-white mt-3">Photo 1</Text>
            <View className="flex-row items-center justify-evenly p-2 mb-5">
              <View className="flex-col w-40 justify-between mb-2 gap-1">
                <Button
                  title="photo select"
                  color="orange"
                  onPress={() => handleGoldItemPhotoPick(index, "normal")}
                />
                <Text className="text-center text-white">OR</Text>
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
            <Text className="text-normal text-white">Photo 2</Text>
            <View className="flex-row items-center justify-evenly p-2 mb-5">
              <View className="flex-col w-40 justify-between mb-2 gap-1">
                <Button
                  title="Photo Select"
                  color="orange"
                  onPress={() => handleGoldItemPhotoPick(index, "weighted")}
                />
                <Text className="text-center text-white">OR</Text>
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
            <View className="items-center">
            <Animatable.View animation="pulse" iterationCount="infinite" duration={1000} easing="ease-out" style={{ width: "100%", alignItems: "center" }}>

            <Text
              className="bg-white text-black p-2  border-yellow border-2 rounded-xl w-1/2 text-center"
              onPress={() => handleSaveGoldItem(index, goldItems[index])}
            >Save Ornament</Text>
            </Animatable.View>
            </View>
          </View>
        )
      )
    )}
  </View>
)}

    </ScrollView>
  );
}
