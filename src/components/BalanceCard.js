import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import StatItem from './StatItem';
import { formatCurrency } from '../utils/formatters';

const BalanceCard = ({ balance, income, expense }) => (
  <View style={styles.balanceCard}>
    <Text style={styles.balanceLabel}>Total Balance</Text>
    <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
    
    <View style={styles.statsRow}>
      <StatItem 
        icon={<TrendingUp size={16} color="#1E8E3E" />}
        label="Income"
        value={formatCurrency(income)}
        iconBgColor="#E6F4EA"
      />
      <StatItem 
        icon={<TrendingDown size={16} color="#D93025" />}
        label="Expense"
        value={formatCurrency(expense)}
        iconBgColor="#FCE8E6"
      />
    </View>
  </View>
);

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
