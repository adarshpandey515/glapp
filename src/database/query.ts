import { useSQLiteContext } from "expo-sqlite/next";

// Types
export type CustomerCreateDatabase = {
  name: string;
  date_of_birth: string;
  gender?: string;
  marital_status?: string;
  pan_number: string;
  address?: string;
  pincode?: string;
  state?: string;
  phone: string;
  email: string;
  account_number?: string;
  ifsc?: string;
  photo?: string;
  shop_id: number;
};

export type LoanCreateDatabase = {
  customer_id: number;
  loan_amount: number;
  interest_rate: number;
  start_date: string;
  end_date: string;
  status?: string;
  num_of_gold_items?: number;
  overdue_interest_rate?: number;
  payment_date?: string;
  total_missed_payments?: number;
};

export type GoldItemCreateDatabase = {
  loan_id: number;
  item_description: string;
  item_type?: string;
  weight: number;
  karat: number;
  appraisal_value?: number;
  normal_photo?: string;
  weighted_photo?: string;
  num_pieces?: number;
};

export type PaymentCreateDatabase = {
  gold_loan_id: number;
  transaction_id?: string;
  payment_date: string;
  amount: number;
  status?: string;
};

export type CustomerResponseDatabase = {
  customer_id: number;
  name: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  pan_number: string;
  address: string;
  pincode: string;
  state: string;
  phone: string;
  email: string;
  account_number: string;
  IFSC: string;
  photo: string;
  shop_id: number;
};

export type LoanResponseDatabase = {
  loan_id: number;
  customer_id: number;
  loan_amount: number;
  interest_rate: number;
  start_date: string;
  end_date: string;
  status: string;
  num_of_gold_items: number;
  overdue_interest_rate: number;
  payment_date: string;
  total_missed_payments: number;
};

export type LoanResponseDatabaseWithCustomer = {
  loan_id: number;
  customer_id: number;
  loan_amount: number;
  interest_rate: number;
  start_date: string;
  end_date: string;
  status: string;
  num_of_gold_items: number;
  overdue_interest_rate: number;
  payment_date: string;
  total_missed_payments: number;
  name: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  pan_number: string;
  address: string;
  pincode: string;
  state: string;
  phone: string;
  email: string;
  account_number: string;
  IFSC: string;
  photo: string;
  shop_id: number;
};

export type GoldItemResponseDatabase = {
  gold_item_id: number;
  loan_id: number;
  item_description: string;
  item_type: string;
  weight: number;
  karat: number;
  appraisal_value: number;
  normal_photo: Blob;
  weighted_photo: Blob;
  num_pieces: number;
};

export type PaymentWithCustomerResponseDatabase = PaymentResponseDatabase & {
  name: string;
  email: string;
};

export type PaymentResponseDatabase = {
  payment_id: number;
  gold_loan_id: number;
  transaction_id?: string;
  payment_date: string;
  amount: number;
  status: string;
};

export function useRepository() {
  const database = useSQLiteContext();

  async function insertCustomer(customer: CustomerCreateDatabase) {
    try {
      const statement = database.prepareSync(
        `INSERT INTO Customer (
          name, date_of_birth, gender, marital_status,
          pan_number, address, pincode, state, phone, email,
          account_number, IFSC, photo, shop_id
        ) VALUES (
          $name, $date_of_birth, $gender, $marital_status,
          $pan_number, $address, $pincode, $state, $phone, $email,
          $account_number, $IFSC, $photo, $shop_id
        )`
      );

      const result = statement.executeSync({
        $name: customer.name,
        $date_of_birth: customer.date_of_birth,
        $gender: customer.gender || "M",
        $marital_status: customer.marital_status || "",
        $pan_number: customer.pan_number,
        $address: customer.address || "",
        $pincode: customer.pincode || "",
        $state: customer.state || "",
        $phone: customer.phone,
        $email: customer.email,
        $account_number: customer.account_number || "",
        $IFSC: customer.ifsc || "",
        $photo: customer.photo || null, // Ensure photo is handled as null if undefined
        $shop_id: customer.shop_id,
      });

      const customerId = result.lastInsertRowId;
      return customerId;
    } catch (error) {
      throw error;
    }
  }

  async function insertLoan(loan: LoanCreateDatabase) {
    try {
      const statement = database.prepareSync(
        `INSERT INTO Loan (
          customer_id, loan_amount, interest_rate, start_date, end_date,
          status, num_of_gold_items, overdue_interest_rate, payment_date, total_missed_payments
        ) VALUES (
          $customer_id, $loan_amount, $interest_rate, $start_date, $end_date,
          $status, $num_of_gold_items, $overdue_interest_rate, $payment_date, $total_missed_payments
        )`
      );

      const result = statement.executeSync({
        $customer_id: loan.customer_id,
        $loan_amount: loan.loan_amount,
        $interest_rate: loan.interest_rate,
        $start_date: loan.start_date || new Date().toISOString().split("T")[0],
        $end_date: loan.end_date,
        $status: loan.status || "starting",
        $num_of_gold_items: loan.num_of_gold_items || 1,
        $overdue_interest_rate: loan.overdue_interest_rate || 0,
        $payment_date:
          loan.payment_date || new Date().toISOString().split("T")[0],
        $total_missed_payments: loan.total_missed_payments || 0,
      });

      const loanId = result.lastInsertRowId;
      return loanId;
    } catch (error) {
      throw error;
    }
  }

  async function insertGoldItem(goldItem: GoldItemCreateDatabase) {
    try {
      const statement = database.prepareSync(
        `INSERT INTO GoldItem (
          loan_id, item_description, item_type, weight, karat,
          appraisal_value, normal_photo, weighted_photo, num_pieces
        ) VALUES (
          $loan_id, $item_description, $item_type, $weight, $karat,
          $appraisal_value, $normal_photo, $weighted_photo, $num_pieces
        )`
      );

      const result = statement.executeSync({
        $loan_id: goldItem.loan_id,
        $item_description: goldItem.item_description,
        $item_type: goldItem.item_type || "Other",
        $weight: goldItem.weight,
        $karat: goldItem.karat,
        $appraisal_value: goldItem.appraisal_value || -1,
        $normal_photo: goldItem.normal_photo || null,
        $weighted_photo: goldItem.weighted_photo || null,
        $num_pieces: goldItem.num_pieces || 1,
      });

      const goldItemId = result.lastInsertRowId;
      return goldItemId;
    } catch (error) {
      throw error;
    }
  }

  async function insertPayment(payment: PaymentCreateDatabase) {
    try {
      const statement = database.prepareSync(
        `INSERT INTO Payment (
          gold_loan_id, transaction_id, payment_date, amount, status
        ) VALUES (
          $gold_loan_id, $transaction_id, $payment_date, $amount, $status
        )`
      );

      const result = statement.executeSync({
        $gold_loan_id: payment.gold_loan_id,
        $transaction_id: payment.transaction_id ?? "",
        $payment_date: payment.payment_date,
        $amount: payment.amount,
        $status: payment.status || "pending",
      });

      const paymentId = result.lastInsertRowId;
      return paymentId;
    } catch (error) {
      throw error;
    }
  }

  function getAllCustomers() {
    try {
      return database.getAllSync<CustomerResponseDatabase>(`
        SELECT * FROM Customer
      `);
    } catch (error) {
      throw error;
    }
  }

  function getAllLoans() {
    try {
      return database.getAllSync<LoanResponseDatabase>(`
        SELECT * FROM Loan
      `);
    } catch (error) {
      throw error;
    }
  }
  function getAllLoansWithCustomer() {
    try {
      return database.getAllSync<LoanResponseDatabaseWithCustomer>(`
        SELECT 
          Loan.loan_id, Loan.customer_id, Loan.loan_amount, Loan.interest_rate, 
          Loan.start_date, Loan.end_date, Loan.status, Loan.num_of_gold_items, 
          Loan.overdue_interest_rate, Loan.payment_date, Loan.total_missed_payments,
          Customer.name, Customer.date_of_birth, Customer.gender, Customer.marital_status, 
          Customer.pan_number, Customer.address, Customer.pincode, Customer.state, 
          Customer.phone, Customer.email, Customer.account_number, Customer.IFSC, 
          Customer.photo, Customer.shop_id
        FROM Loan 
        LEFT JOIN Customer ON Loan.customer_id = Customer.customer_id
      `);
    } catch (error) {
      throw error;
    }
  }

  function getAllGoldItems() {
    try {
      return database.getAllSync<GoldItemResponseDatabase>(`
        SELECT * FROM GoldItem
      `);
    } catch (error) {
      throw error;
    }
  }

  function getAllPayments(){
    try {
      return database.getAllSync<PaymentResponseDatabase>(`
        SELECT * FROM Payment
      `);
    } catch (error) {
      throw error;
    }
  }

  function getAllPaymentsDueSoon() {
    try {
      return database.getAllSync<PaymentWithCustomerResponseDatabase>(`
        SELECT Payment.*, Customer.name ,Customer.email
        FROM Payment
        INNER JOIN Loan ON Payment.gold_loan_id = Loan.loan_id
        INNER JOIN Customer ON Loan.customer_id = Customer.customer_id
        WHERE Payment.status != 'completed'
        AND (
          strftime('%Y-%m-%d', substr(Payment.payment_date, 7, 4) || '-' || substr(Payment.payment_date, 4, 2) || '-' || substr(Payment.payment_date, 1, 2)) < DATE('now')
          OR strftime('%Y-%m-%d', substr(Payment.payment_date, 7, 4) || '-' || substr(Payment.payment_date, 4, 2) || '-' || substr(Payment.payment_date, 1, 2)) BETWEEN DATE('now') AND DATE('now', '+10 days')
        )
        ORDER BY strftime('%Y-%m-%d', substr(Payment.payment_date, 7, 4) || '-' || substr(Payment.payment_date, 4, 2) || '-' || substr(Payment.payment_date, 1, 2)) ASC
      `);
    } catch (error) {
      throw error;
    }
  }

  function updatePaymentStatus(paymentId: number, newStatus: string,newtransaction_id:string) {
    try {
      const statement = database.prepareSync(`
        UPDATE Payment
        SET status = $newStatus,
            transaction_id = $newtransaction_id
        WHERE payment_id = $paymentId
      `);

      statement.executeSync({
        $newStatus: newStatus,
        $paymentId: paymentId,
      });

      console.log(`Payment ID ${paymentId} status updated to ${newStatus}`);
    } catch (error) {
      console.error(
        `Failed to update status for payment ID ${paymentId}:`,
        error
      );
      throw error;
    }
  }

  function getAllPaymentsByLoanId(loanId: number) {
    try {
      const statement = database.prepareSync(`
        SELECT * FROM Payment WHERE gold_loan_id = $gold_loan_id
      `);

      const result = statement.executeSync<PaymentResponseDatabase>({
        $gold_loan_id: loanId,
      });

      return result.getAllSync();
    } catch (error) {
      throw error;
    }
  }

  function getAllGoldItemsByLoanId(loanId: number): GoldItemResponseDatabase[] {
    try {
      // Prepare the SQL statement
      const statement = database.prepareSync(`
        SELECT * FROM GoldItem WHERE loan_id = $gold_loan_id
      `);

      // Execute the statement with the loanId parameter
      const result = statement.executeSync<GoldItemResponseDatabase>({
        $gold_loan_id: loanId,
      });

      // Return the results
      return result.getAllSync();
    } catch (error) {
      throw error;
    }

  }
  function countTotalLoans() {
    try {
      const statement = database.prepareSync(`
      SELECT COUNT(*) AS totalLoans FROM Loan
    `);

      const result = statement.executeSync();
      // console.log("totalloans", result);
      return result;
    } catch (error) {
      throw error;
    }
  }

  function countActiveLoans() {
    try {
      const statement = database.prepareSync(`
      SELECT COUNT(*) AS activeLoans FROM Loan WHERE status = 'active'
    `);

      const result = statement.executeSync();
      // console.log("activeLoans", result);

      return result;
    } catch (error) {
      throw error;
    }
  }

  function countTotalCustomers() {
    try {
      const statement = database.prepareSync(`
      SELECT COUNT(*) AS totalCustomers FROM Customer
    `);

      const result = statement.executeSync();
      // console.log("totalCustomers", result);
      return result;
    } catch (error) {
      throw error;
    }
  }

  function countPendingPayments() {
    try {
      const statement = database.prepareSync(`
      SELECT COUNT(*) AS pendingPayments FROM Payment WHERE status != 'completed'
    `);

      const result = statement.executeSync();
      // console.log("pendingPayments", result);
      return result;
    } catch (error) {
      throw error;
    }
  }


   function deleteLoanAndRelatedData(loanId: number) {
    try {
      try {
        const deletePaymentsStatement = database.prepareSync(`
          DELETE FROM Payment WHERE gold_loan_id = $loanId
        `);
        deletePaymentsStatement.executeSync({ $loanId: loanId });
        }catch (error) {
          console.error(`Failed to delete payments for loan ID ${loanId}:`, error);
          throw error;
        }
        // Delete related gold items
        try {
        const deleteGoldItemsStatement = database.prepareSync(`
          DELETE FROM GoldItem WHERE loan_id = $loanId
        `);
        deleteGoldItemsStatement.executeSync({ $loanId: loanId });
        }catch (error) {
          console.error(`Failed to delete gold items for loan ID ${loanId}:`, error);
          throw error;
        }
        // Delete the loan itself
        try {
        const deleteLoanStatement = database.prepareSync(`
          DELETE FROM Loan WHERE loan_id = $loanId
        `);
        deleteLoanStatement.executeSync({ $loanId: loanId });
        }catch (error) {
          console.error(`Failed to delete loan ID ${loanId}:`, error);
          throw error;
        }

      console.log(`Loan ID ${loanId} and its related data deleted successfully.`);
    } catch (error) {
      console.error(`Failed to delete loan ID ${loanId} and related data:`, error);
      throw error;
    }
  }


  return {
    insertCustomer,
    insertLoan,
    insertGoldItem,
    insertPayment,
    getAllCustomers,
    getAllLoans,
    getAllPayments,
    getAllGoldItems,
    getAllPaymentsDueSoon,
    getAllPaymentsByLoanId,
    getAllLoansWithCustomer,
    getAllGoldItemsByLoanId,
    updatePaymentStatus,
    countTotalLoans,
    countActiveLoans,
    countTotalCustomers,
    countPendingPayments,
    deleteLoanAndRelatedData
  };
}
