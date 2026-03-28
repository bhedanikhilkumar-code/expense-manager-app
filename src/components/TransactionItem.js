import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react-native';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useTransactions } from '../context/TransactionContext';

const TransactionItem = ({ item, onDelete }) => {
  const { theme, isDarkMode } = useTransactions();
  
  const isIncome = item.type === 'income';
  const iconBg = isIncome 
    ? (isDarkMode ? '#1B3320' : '#E6F4EA') 
    : (isDarkMode ? '#3C1E1E' : '#FCE8E6');
  const iconColor = isIncome ? '#34A853' : '#EA4335';

  return (
    <View style={[styles.transactionCard, { backgroundColor: theme.card }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        {isIncome ? <TrendingUp size={20} color={iconColor} /> : <TrendingDown size={20} color={iconColor} />}
      </View>
      <View style={styles.transactionDetails}>
        <Text style={[styles.transactionTitle, { color: theme.text }]}>{item.title}</Text>
        <View style={styles.subInfo}>
          <Text style={[styles.transactionCategory, { color: theme.subText }]}>{item.category}</Text>
          <Text style={[styles.dot, { color: theme.border }]}> • </Text>
          <Text style={[styles.transactionDate, { color: theme.subText }]}>{formatDate(item.date)}</Text>
        </View>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.transactionAmount, { color: iconColor }]}>
          {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
        </Text>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
          <Trash2 size={16} color={theme.subText} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionCard: { 
    backgroundColor: '#FFF', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 12, 
    elevation: 1 
  },
  iconContainer: { padding: 12, borderRadius: 14, marginRight: 16 },
  transactionDetails: { flex: 1 },
  transactionTitle: { fontSize: 16, fontWeight: '600', color: '#202124' },
  subInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  transactionCategory: { fontSize: 12, color: '#70757A' },
  dot: { fontSize: 12, color: '#DADCE0' },
  transactionDate: { fontSize: 12, color: '#70757A' },
  rightContent: { alignItems: 'flex-end' },
  transactionAmount: { fontSize: 16, fontWeight: 'bold' },
  deleteBtn: { marginTop: 4, padding: 4 },
});

export default TransactionItem;
