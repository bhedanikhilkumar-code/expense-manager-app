import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import StatItem from './StatItem';
import { formatCurrency } from '../utils/formatters';
import { useTransactions } from '../context/TransactionContext';

const BalanceCard = ({ balance, income, expense }) => {
  const { theme, isDarkMode } = useTransactions();
  return (
    <View style={[styles.balanceCard, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
      <Text style={styles.balanceLabel}>Total Balance</Text>
      <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
      
      <View style={styles.statsRow}>
        <StatItem 
          icon={<TrendingUp size={16} color={isDarkMode ? '#81C784' : '#1E8E3E'} />}
          label="Income"
          value={formatCurrency(income)}
          iconBgColor={isDarkMode ? '#1B3320' : '#E6F4EA'}
          labelColor={isDarkMode ? '#B0B0B0' : 'rgba(255, 255, 255, 0.7)'}
          valueColor={isDarkMode ? '#E0E0E0' : '#FFF'}
        />
        <StatItem 
          icon={<TrendingDown size={16} color={isDarkMode ? '#E57373' : '#D93025'} />}
          label="Expense"
          value={formatCurrency(expense)}
          iconBgColor={isDarkMode ? '#3C1E1E' : '#FCE8E6'}
          labelColor={isDarkMode ? '#B0B0B0' : 'rgba(255, 255, 255, 0.7)'}
          valueColor={isDarkMode ? '#E0E0E0' : '#FFF'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: '#1A73E8',
    margin: 20,
    padding: 24,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  balanceLabel: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, fontWeight: '500' },
  balanceAmount: { color: '#FFF', fontSize: 36, fontWeight: 'bold', marginVertical: 12 },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10, 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255, 255, 255, 0.2)', 
    paddingTop: 16 
  },
});

export default BalanceCard;
