import { SQLiteDatabase } from "expo-sqlite/next";
import { Platform } from "react-native";

export async function init(database: SQLiteDatabase) {
    if (Platform.OS == 'web') {
        console.warn("WebSQL is not supported on web. Please use SQLite.");
        return ;
      }
  await database.execAsync(`
    PRAGMA journal_mode = 'wal';

    CREATE TABLE IF NOT EXISTS Shop (
        shop_id INTEGER PRIMARY KEY NOT NULL,
        shop_name TEXT NOT NULL,
        shop_address TEXT NOT NULL,
        shop_phone TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Customer (
        customer_id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        date_of_birth DATE,
        gender TEXT DEFAULT 'M',
        marital_status TEXT,
        pan_number TEXT NOT NULL,
        address TEXT,
        pincode TEXT,
        state TEXT,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        account_number TEXT,
        IFSC TEXT,
        photo TEXT,
        shop_id INTEGER,
        FOREIGN KEY (shop_id) REFERENCES Shop(shop_id)
    );

    CREATE TABLE IF NOT EXISTS Loan (
        loan_id INTEGER PRIMARY KEY NOT NULL,
        customer_id INTEGER,
        loan_amount REAL NOT NULL,
        interest_rate REAL NOT NULL,
        start_date DATE NOT NULL DEFAULT (date('now')),
        end_date DATE NOT NULL,
        status TEXT DEFAULT 'starting',
        num_of_gold_items INTEGER DEFAULT 1,
        overdue_interest_rate REAL,
        payment_date DATE,
        total_missed_payments INTEGER,
        FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
    );

    CREATE TABLE IF NOT EXISTS GoldItem (
        gold_item_id INTEGER PRIMARY KEY NOT NULL,
        loan_id INTEGER,
        item_description TEXT,
        item_type TEXT DEFAULT 'other',
        weight REAL,
        karat INTEGER,
        appraisal_value REAL,
        normal_photo TEXT,
        weighted_photo TEXT,
        num_pieces INTEGER,
        FOREIGN KEY (loan_id) REFERENCES Loan(loan_id)
    );

    CREATE TABLE IF NOT EXISTS Payment (
        payment_id INTEGER PRIMARY KEY NOT NULL,
        gold_loan_id INTEGER,
        transaction_id TEXT,
        payment_date DATE,
        amount REAL,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY (gold_loan_id) REFERENCES Loan(loan_id)
    );

    INSERT INTO Shop (shop_id, shop_name, shop_address, shop_phone)
    SELECT 1, 'Adarsh', 'Vasai (E), VCET', '9004353415'
    WHERE NOT EXISTS (SELECT 1 FROM Shop WHERE shop_id = 1);

    INSERT INTO Customer (customer_id, name, date_of_birth, gender, marital_status, pan_number, address, pincode, state, phone, email, account_number, IFSC, photo, shop_id)
    SELECT customer_id, name, date_of_birth, gender, marital_status, pan_number, address, pincode, state, phone, email, account_number, IFSC, photo, shop_id
    FROM (
        SELECT 1 AS customer_id, 'Customer 1' AS name, '1990-01-01' AS date_of_birth, 'M' AS gender, 'married' AS marital_status, 'ABCDE1234F' AS pan_number, 'Address 1' AS address, '400001' AS pincode, 'State 1' AS state, '9000000001' AS phone, 'customer1@example.com' AS email, '1234567890' AS account_number, 'IFSC001' AS IFSC, '' AS photo, 1 AS shop_id
        UNION ALL SELECT 2, 'Customer 2', '1991-02-02', 'F', 'unmarried', 'ABCDE1234G', 'Address 2', '400002', 'State 2', '9000000002', 'customer2@example.com', '1234567891', 'IFSC002', '', 1
        UNION ALL SELECT 3, 'Customer 3', '1992-03-03', 'M', 'married', 'ABCDE1234H', 'Address 3', '400003', 'State 3', '9000000003', 'customer3@example.com', '1234567892', 'IFSC003', '', 1
        UNION ALL SELECT 4, 'Customer 4', '1993-04-04', 'F', 'unmarried', 'ABCDE1234I', 'Address 4', '400004', 'State 4', '9000000004', 'customer4@example.com', '1234567893', 'IFSC004', '', 1
        UNION ALL SELECT 5, 'Customer 5', '1994-05-05', 'M', 'married', 'ABCDE1234J', 'Address 5', '400005', 'State 5', '9000000005', 'customer5@example.com', '1234567894', 'IFSC005', '', 1
        UNION ALL SELECT 6, 'Customer 6', '1995-06-06', 'F', 'unmarried', 'ABCDE1234K', 'Address 6', '400006', 'State 6', '9000000006', 'customer6@example.com', '1234567895', 'IFSC006', '', 1
        UNION ALL SELECT 7, 'Customer 7', '1996-07-07', 'M', 'married', 'ABCDE1234L', 'Address 7', '400007', 'State 7', '9000000007', 'customer7@example.com', '1234567896', 'IFSC007', '', 1
        UNION ALL SELECT 8, 'Customer 8', '1997-08-08', 'F', 'unmarried', 'ABCDE1234M', 'Address 8', '400008', 'State 8', '9000000008', 'customer8@example.com', '1234567897', 'IFSC008', '', 1
        UNION ALL SELECT 9, 'Customer 9', '1998-09-09', 'M', 'married', 'ABCDE1234N', 'Address 9', '400009', 'State 9', '9000000009', 'customer9@example.com', '1234567898', 'IFSC009', '', 1
        UNION ALL SELECT 10, 'Customer 10', '1999-10-10', 'F', 'unmarried', 'ABCDE1234O', 'Address 10', '400010', 'State 10', '9000000010', 'customer10@example.com', '1234567899', 'IFSC010', '', 1
    ) AS temp
    WHERE NOT EXISTS (SELECT 1 FROM Customer WHERE customer_id = temp.customer_id);

    `);
}



    
    // INSERT INTO Loan (loan_id, customer_id, loan_amount, interest_rate, start_date, end_date, status, num_of_gold_items, overdue_interest_rate, payment_date, total_missed_payments)
    // SELECT loan_id, customer_id, loan_amount, interest_rate, start_date, end_date, status, num_of_gold_items, overdue_interest_rate, payment_date, total_missed_payments
    // FROM (
    //     SELECT 1 AS loan_id, 1 AS customer_id, 10000.0 AS loan_amount, 10.0 AS interest_rate, '2023-01-01' AS start_date, '2024-01-01' AS end_date, 'starting' AS status, 1 AS num_of_gold_items, 12.0 AS overdue_interest_rate, NULL AS payment_date, 0 AS total_missed_payments
    //     UNION ALL SELECT 2, 2, 20000.0, 9.5, '2023-02-01', '2024-02-01', 'starting', 2, 11.0, NULL, 0
    //     UNION ALL SELECT 3, 3, 15000.0, 11.0, '2023-03-01', '2024-03-01', 'starting', 3, 12.5, NULL, 0
    //     UNION ALL SELECT 4, 4, 12000.0, 10.5, '2023-04-01', '2024-04-01', 'starting', 1, 10.0, NULL, 0
    //     UNION ALL SELECT 5, 5, 17000.0, 9.0, '2023-05-01', '2024-05-01', 'starting', 2, 13.0, NULL, 0
    //     UNION ALL SELECT 6, 6, 18000.0, 8.5, '2023-06-01', '2024-06-01', 'starting', 3, 14.0, NULL, 0
    //     UNION ALL SELECT 7, 7, 19000.0, 7.5, '2023-07-01', '2024-07-01', 'starting', 1, 15.0, NULL, 0
    //     UNION ALL SELECT 8, 8, 25000.0, 7.0, '2023-08-01', '2024-08-01', 'starting', 2, 16.0, NULL, 0
    //     UNION ALL SELECT 9, 9, 30000.0, 8.0, '2023-09-01', '2024-09-01', 'starting', 3, 17.0, NULL, 0
    //     UNION ALL SELECT 10, 10, 22000.0, 9.0, '2023-10-01', '2024-10-01', 'starting', 1, 18.0, NULL, 0
    //     UNION ALL SELECT 11, 1, 23000.0, 10.0, '2023-11-01', '2024-11-01', 'starting', 2, 19.0, NULL, 0
    //     UNION ALL SELECT 12, 2, 24000.0, 11.0, '2023-12-01', '2024-12-01', 'starting', 3, 20.0, NULL, 0
    //     UNION ALL SELECT 13, 3, 16000.0, 12.0, '2023-01-01', '2024-01-01', 'starting', 1, 12.5, NULL, 0
    //     UNION ALL SELECT 14, 4, 13000.0, 10.5, '2023-02-01', '2024-02-01', 'starting', 2, 10.0, NULL, 0
    //     UNION ALL SELECT 15, 5, 18000.0, 9.0, '2023-03-01', '2024-03-01', 'starting', 3, 13.0, NULL, 0
    // ) AS temp
    // WHERE NOT EXISTS (SELECT 1 FROM Loan WHERE loan_id = temp.loan_id);

    // INSERT INTO GoldItem (gold_item_id, loan_id, item_description, item_type, weight, karat, appraisal_value, normal_photo, weighted_photo, num_pieces)
    // SELECT gold_item_id, loan_id, item_description, item_type, weight, karat, appraisal_value, normal_photo, weighted_photo, num_pieces
    // FROM (
    //     SELECT 1 AS gold_item_id, 1 AS loan_id, 'Gold Necklace' AS item_description, 'necklace' AS item_type, 50.0 AS weight, 22 AS karat, 50000.0 AS appraisal_value, '' AS normal_photo, '' AS weighted_photo, 1 AS num_pieces
    //     UNION ALL SELECT 2, 1, 'Gold Ring', 'ring', 10.0, 18, 10000.0, '', '', 1
    //     UNION ALL SELECT 3, 2, 'Gold Bracelet', 'bracelet', 20.0, 20, 20000.0, '', '', 1
    //     UNION ALL SELECT 4, 2, 'Gold Earrings', 'earrings', 5.0, 22, 5000.0, '', '', 2
    //     UNION ALL SELECT 5, 3, 'Gold Pendant', 'pendant', 15.0, 18, 15000.0, '', '', 1
    //     UNION ALL SELECT 6, 3, 'Gold Chain', 'chain', 30.0, 20, 30000.0, '', '', 1
    //     UNION ALL SELECT 7, 3, 'Gold Bangles', 'bangles', 40.0, 22, 40000.0, '', '', 2
    //     UNION ALL SELECT 8, 4, 'Gold Necklace', 'necklace', 60.0, 24, 60000.0, '', '', 1
    //     UNION ALL SELECT 9, 5, 'Gold Ring', 'ring', 12.0, 18, 12000.0, '', '', 1
    //     UNION ALL SELECT 10, 6, 'Gold Bracelet', 'bracelet', 25.0, 20, 25000.0, '', '', 1
    //     UNION ALL SELECT 11, 6, 'Gold Earrings', 'earrings', 7.0, 22, 7000.0, '', '', 2
    //     UNION ALL SELECT 12, 7, 'Gold Pendant', 'pendant', 18.0, 18, 18000.0, '', '', 1
    //     UNION ALL SELECT 13, 7, 'Gold Chain', 'chain', 35.0, 20, 35000.0, '', '', 1
    //     UNION ALL SELECT 14, 7, 'Gold Bangles', 'bangles', 45.0, 22, 45000.0, '', '', 2
    //     UNION ALL SELECT 15, 8, 'Gold Necklace', 'necklace', 70.0, 24, 70000.0, '', '', 1
    //     UNION ALL SELECT 16, 9, 'Gold Ring', 'ring', 14.0, 18, 14000.0, '', '', 1
    //     UNION ALL SELECT 17, 10, 'Gold Bracelet', 'bracelet', 28.0, 20, 28000.0, '', '', 1
    //     UNION ALL SELECT 18, 10, 'Gold Earrings', 'earrings', 9.0, 22, 9000.0, '', '', 2
    //     UNION ALL SELECT 19, 11, 'Gold Pendant', 'pendant', 20.0, 18, 20000.0, '', '', 1
    //     UNION ALL SELECT 20, 12, 'Gold Chain', 'chain', 40.0, 20, 40000.0, '', '', 1
    // ) AS temp
    // WHERE NOT EXISTS (SELECT 1 FROM GoldItem WHERE gold_item_id = temp.gold_item_id);

    // INSERT INTO Payment (payment_id, gold_loan_id, transaction_id, payment_date, amount, status)
    // SELECT payment_id, gold_loan_id, transaction_id, payment_date, amount, status
    // FROM (
    //     SELECT 1 AS payment_id, 1 AS gold_loan_id, 'TXN1' AS transaction_id, '2023-01-15' AS payment_date, 1000.0 AS amount, 'completed' AS status
    //     UNION ALL SELECT 2, 2, 'TXN2', '2023-02-15', 2000.0, 'completed'
    //     UNION ALL SELECT 3, 3, 'TXN3', '2023-03-15', 1500.0, 'completed'
    //     UNION ALL SELECT 4, 4, 'TXN4', '2023-04-15', 1200.0, 'completed'
    //     UNION ALL SELECT 5, 5, 'TXN5', '2023-05-15', 1700.0, 'completed'
    //     UNION ALL SELECT 9, 9, 'TXN9', '2023-09-15', 3000.0, 'completed'
    //     UNION ALL SELECT 22, 7, 'TXN22', '2024-10-15', 1900.0, 'completed'
    //     UNION ALL SELECT 27, 12, 'TXN27', '2024-03-15', 2400.0, 'completed'
    //     UNION ALL SELECT 31, 1, 'TXN31', '2024-07-15', 1000.0, 'completed'
    //     UNION ALL SELECT 32, 2, 'TXN32', '2024-08-15', 2000.0, 'completed'
    //     UNION ALL SELECT 33, 3, 'TXN33', '2024-09-15', 1500.0, 'completed'
    //     UNION ALL SELECT 34, 4, 'TXN34', '2024-10-15', 1200.0, 'completed'
    //     UNION ALL SELECT 35, 5, 'TXN35', '2024-11-15', 1700.0, 'completed'
    //     UNION ALL SELECT 39, 9, 'TXN39', '2025-03-15', 3000.0, 'completed'
    //     UNION ALL SELECT 40, 10, 'TXN40', '2025-04-15', 2200.0, 'completed'
    // ) AS temp
    // WHERE NOT EXISTS (SELECT 1 FROM Payment WHERE payment_id = temp.payment_id);