import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionContext = createContext();

const STORAGE_KEY = '@transactions';
const THEME_KEY = '@app_theme';

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Today', 'Week', 'Month'

  // Load data from AsyncStorage on initial mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedTransactions, storedTheme] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(THEME_KEY)
        ]);
        
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        } else {
          // Default initial data
          const initialData = [
            { id: '1', title: 'Salary', amount: 50000, type: 'income', category: 'Salary', date: new Date().toISOString() },
            { id: '2', title: 'Grocery', amount: 2500, type: 'expense', category: 'Food', date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
            { id: '3', title: 'Petrol', amount: 1200, type: 'expense', category: 'Transport', date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
            { id: '4', title: 'Rent', amount: 15000, type: 'expense', category: 'Housing', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
            { id: '5', title: 'Internet', amount: 800, type: 'expense', category: 'Utilities', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
            { id: '6', title: 'Gym', amount: 1500, type: 'expense', category: 'Health', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
            { id: '7', title: 'Dining Out', amount: 1200, type: 'expense', category: 'Food', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
          ];
          setTransactions(initialData);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }

        if (storedTheme) {
          setIsDarkMode(JSON.parse(storedTheme));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    const saveData = async () => {
      if (!loading) {
        try {
          await Promise.all([
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)),
            AsyncStorage.setItem(THEME_KEY, JSON.stringify(isDarkMode))
          ]);
        } catch (error) {
          console.error('Failed to save data:', error);
        }
      }
    };
    saveData();
  }, [transactions, isDarkMode, loading]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const addTransaction = (transaction) => {
    setTransactions(prev => [
      { id: Date.now().toString(), date: new Date().toISOString(), ...transaction },
      ...prev
    ]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Filtering Logic
  const getFilteredTransactions = () => {
    const now = new Date();
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      if (activeFilter === 'Today') {
        return tDate.toDateString() === now.toDateString();
      } else if (activeFilter === 'Week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return tDate >= oneWeekAgo;
      } else if (activeFilter === 'Month') {
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      }
      return true; // 'All'
    });
  };

   const filteredData = getFilteredTransactions();

   const totalIncome = transactions
     .filter(t => t.type === 'income')
     .reduce((sum, t) => sum + Number(t.amount || 0), 0);

   const totalExpense = transactions
     .filter(t => t.type === 'expense')
     .reduce((sum, t) => sum + Number(t.amount || 0), 0);

   const balance = totalIncome - totalExpense;

   // Spending by category (for chart)
   const getSpendingByCategory = () => {
     const categories = {};
     filteredData
       .filter(t => t.type === 'expense')
       .forEach(t => {
         categories[t.category] = (categories[t.category] || 0) + t.amount;
       });
      
    const CATEGORY_COLORS = {
      'Food': '#FF6B6B', 'Transport': '#4ECDC4', 'Shopping': '#45B7D1',
      'Bills': '#96CEB4', 'Entertainment': '#F39C12', 'Health': '#D4A5A5',
      'Housing': '#9B59B6', 'Utilities': '#34495E', 'General': '#95A5A6'
    };

    const getConsistentColor = (name) => {
      if (CATEGORY_COLORS[name]) return CATEGORY_COLORS[name];
      let hash = 0;
      for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
      return '#' + (hash & 0x00FFFFFF).toString(16).padStart(6, '0');
    };

    return Object.keys(categories).map(name => ({
      name,
      amount: categories[name],
      color: getConsistentColor(name)
    }));
  };

  const theme = {
    background: isDarkMode ? '#121212' : '#F8F9FA',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#202124',
    subText: isDarkMode ? '#B0B0B0' : '#5F6368',
    primary: '#1A73E8',
    income: '#34A853',
    expense: '#EA4335',
    border: isDarkMode ? '#333333' : '#DADCE0'
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions: filteredData, 
      allTransactions: transactions,
      addTransaction, 
      deleteTransaction,
      totalIncome, 
      totalExpense, 
      balance,
      loading,
      isDarkMode,
      toggleTheme,
      activeFilter,
      setActiveFilter,
      getSpendingByCategory,
      theme
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
