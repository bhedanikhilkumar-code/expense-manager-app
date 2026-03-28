import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionContext = createContext();

const STORAGE_KEY = '@transactions';

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load transactions from AsyncStorage on initial mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        } else {
          // Default initial data if none exists
          const initialData = [
            { id: '1', title: 'Salary', amount: 50000, type: 'income', category: 'Work', date: '2026-03-20' },
            { id: '2', title: 'Grocery', amount: 2500, type: 'expense', category: 'Food', date: '2026-03-21' },
            { id: '3', title: 'Petrol', amount: 1200, type: 'expense', category: 'Transport', date: '2026-03-22' },
          ];
          setTransactions(initialData);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Save transactions whenever they change
  useEffect(() => {
    const saveTransactions = async () => {
      if (!loading) {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        } catch (error) {
          console.error('Failed to save transactions:', error);
        }
      }
    };
    saveTransactions();
  }, [transactions, loading]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [
      { id: Date.now().toString(), date: new Date().toISOString(), ...transaction },
      ...prev
    ]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const balance = totalIncome - totalExpense;

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      addTransaction, 
      deleteTransaction,
      totalIncome, 
      totalExpense, 
      balance,
      loading 
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
