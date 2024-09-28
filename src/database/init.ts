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
    WHERE NOT EXISTS (SELECT 1  FROM Shop WHERE shop_id = 1);

    `);
}



    