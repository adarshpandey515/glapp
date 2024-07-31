import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SearchIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useRepository } from '../../database/query'; // Adjust the import path
import { LoanResponseDatabase } from '../../database/query';

const LoanList = () => {
  const [search, setSearch] = useState('');
  const [loans, setLoans] = useState<LoanResponseDatabase[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<LoanResponseDatabase[]>([]);
  const { getAllLoans } = useRepository();
  const router = useRouter();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const loansData =  getAllLoans();
        console.log(loansData);
        setLoans(loansData);
        setFilteredLoans(loansData);
      } catch (error) {
        console.error('Failed to fetch loans:', error);
      }
    };

    fetchLoans();
  }, [search]);

  useEffect(() => {
    if (search) {
      setFilteredLoans(
        loans.filter(loan =>
          loan.loan_id.toString().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredLoans(loans);
    }
  }, [search, loans]);

  return (
    <View className="flex-1 p-2 bg-white">
      <View className='flex flex-row items-center justify-between p-2 px-5 m-2 rounded-full border-2 border-yellow'>
        <TextInput
          className="w-[80%] text-lg bg-transparent text-black outline-none"
          placeholder="Search By Loan ID"
          placeholderTextColor="#787878"
          value={search}
          onChangeText={setSearch}
        />
        <SearchIcon size={18} color="black" />
      </View>
      <ScrollView>
        {filteredLoans.map((loan, index) => (
          <TouchableOpacity
            key={index}
            className="border border-black/50 p-2 m-2 rounded-2xl"
            onPress={() => router.push({ pathname: `/Loans/LoanDetail`, params: { loan: JSON.stringify(loan) } })}
          >
            <View className="flex-row justify-between">
              <Text className="text-lg text-black">Loan ID: {loan.loan_id}</Text>
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
