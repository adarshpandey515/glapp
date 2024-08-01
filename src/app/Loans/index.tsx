import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SearchIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useRepository } from '../../database/query'; // Adjust the import path
import { LoanResponseDatabaseWithCustomer } from '../../database/query';

const LoanList = () => {
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState<'loan_id' | 'customer_name'>('customer_name');
  const [loans, setLoans] = useState<LoanResponseDatabaseWithCustomer[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<LoanResponseDatabaseWithCustomer[]>([]);
  const { getAllLoansWithCustomer } = useRepository();
  const router = useRouter();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const loansData = getAllLoansWithCustomer();
        console.log(loansData);
        setLoans(loansData);
        setFilteredLoans(loansData);
      } catch (error) {
        console.error('Failed to fetch loans:', error);
      }
    };

    fetchLoans();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredLoans(
        loans.filter(loan => {
          if (searchBy === 'loan_id') {
            return loan.loan_id.toString().includes(search.toLowerCase());
          } else if (searchBy === 'customer_name' && loan.name) {
            return loan.name.toLowerCase().includes(search.toLowerCase()) ;
          }
          return false;
        })
      );
    } else {
      setFilteredLoans(loans);
    }
  }, [search, loans, searchBy]);

  return (
    <View className="flex-1 p-2 bg-white">
      <View className='flex flex-row items-center justify-between p-2 px-5 m-2 rounded-full border-2 border-yellow'>
        <TextInput
          className="w-[70%] text-lg bg-transparent text-black outline-none"
          placeholder={`Search By ${searchBy === 'loan_id' ? 'Loan ID' : 'Customer Name'}`}
          placeholderTextColor="#787878"
          value={search}
          onChangeText={setSearch}
        />
        <SearchIcon size={18} color="black" />
        {/* <Picker
          selectedValue={searchBy}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue:any) => setSearchBy(itemValue)}
        >
          <Picker.Item label="Loan ID" value="loan_id" />
          <Picker.Item label="Customer Name" value="customer_name" />
        </Picker> */}
      </View>
      <ScrollView>
        {filteredLoans.map((loan, index) => (
          <TouchableOpacity
            key={index}
            className="border border-black/50 p-2 m-2 rounded-2xl"
            onPress={() => router.push({ pathname: `/Loans/LoanDetail`, params: { loan: JSON.stringify(loan) } })}
          >
            <View className="flex-row justify-between">
              <View >

                <Text className="text-lg text-black">{loan.name}</Text>
              <Text className="text-sm text-black">Loan ID: {loan.loan_id}</Text>
              </View>
              <View>
                <Text className="text-lg text-right text-black">₹{loan.loan_amount}</Text>
                <Text className="text-sm text-black">{loan.start_date} - {loan.end_date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default LoanList;
