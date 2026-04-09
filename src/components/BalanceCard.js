import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react-native';
import StatItem from './StatItem';
import { formatCurrency } from '../utils/formatters';
import { useTransactions } from '../context/TransactionContext';

const BalanceCard = ({ balance, income, expense }) => {
  const { theme, isDarkMode } = useTransactions();
  return (
    <View style={[styles.balanceCard, { backgroundColor: theme.primary }]}>
      <View style={styles.cardHeader}>
        <View style={styles.walletIconContainer}>
          <Wallet size={24} color="#FFF" />
        </View>
        <Text style={styles.balanceLabel}>Total Balance</Text>
      </View>
      <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>

      <View style={styles.statsRow}>
        <StatItem
          icon={<TrendingUp size={18} color={theme.income} />}
          label="Income"
          value={formatCurrency(income)}
          iconBgColor="rgba(255,255,255,0.2)"
          valueColor="#FFF"
          labelColor="rgba(255,255,255,0.8)"
        />
        <View style={styles.divider} />
        <StatItem
          icon={<TrendingDown size={18} color="#FFF" />}
          label="Expense"
          value={formatCurrency(expense)}
          iconBgColor="rgba(255,255,255,0.2)"
          valueColor="#FFF"
          labelColor="rgba(255,255,255,0.8)"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    margin: 20,
    padding: 24,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  walletIconContainer: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 10
  },
  balanceLabel: { fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  balanceAmount: { fontSize: 38, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 16
  },
  divider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 20 },
});

export default BalanceCard;
