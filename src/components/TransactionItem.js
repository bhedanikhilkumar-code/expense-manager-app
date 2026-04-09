import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react-native';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useTransactions } from '../context/TransactionContext';

const TransactionItem = ({ item, onDelete }) => {
  const { theme, isDarkMode } = useTransactions();
    
  const isIncome = item.type === 'income';
  const iconBg = isIncome 
    ? (isDarkMode ? 'rgba(52, 168, 83, 0.15)' : 'rgba(52, 168, 83, 0.1)') 
    : (isDarkMode ? 'rgba(234, 67, 53, 0.15)' : 'rgba(234, 67, 53, 0.1)');
  const iconColor = isIncome ? theme.income : theme.expense;

  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete(item.id) }
      ]
    );
  };

  return (
    <View style={[styles.transactionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        {isIncome ? <TrendingUp size={22} color={iconColor} /> : <TrendingDown size={22} color={iconColor} />}
      </View>
      <View style={styles.transactionDetails}>
        <Text style={[styles.transactionTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
        <View style={styles.subInfo}>
          <Text style={[styles.transactionCategory, { color: theme.subText }]}>{item.category}</Text>
          <Text style={[styles.dot, { color: theme.subText }]}> • </Text>
          <Text style={[styles.transactionDate, { color: theme.subText }]}>{formatDate(item.date)}</Text>
        </View>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.transactionAmount, { color: iconColor }]}>
          {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
        </Text>
        <TouchableOpacity onPress={handleDelete} style={[styles.deleteBtn, { backgroundColor: theme.background }]}>
          <Trash2 size={16} color={theme.subText} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  iconContainer: { padding: 12, borderRadius: 14, marginRight: 14 },
  transactionDetails: { flex: 1 },
  transactionTitle: { fontSize: 16, fontWeight: '600' },
  subInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  transactionCategory: { fontSize: 12 },
  dot: { fontSize: 12 },
  transactionDate: { fontSize: 12 },
  rightContent: { alignItems: 'flex-end' },
  transactionAmount: { fontSize: 16, fontWeight: 'bold' },
  deleteBtn: { marginTop: 8, padding: 8, borderRadius: 10 },
});

export default TransactionItem;
