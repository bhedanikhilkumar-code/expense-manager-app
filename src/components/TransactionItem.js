import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react-native';
import { formatCurrency, formatDate } from '../utils/formatters';

const TransactionItem = ({ item, onDelete }) => (
  <View style={styles.transactionCard}>
    <View style={[styles.iconContainer, { backgroundColor: item.type === 'income' ? '#E6F4EA' : '#FCE8E6' }]}>
      {item.type === 'income' ? <TrendingUp size={20} color="#1E8E3E" /> : <TrendingDown size={20} color="#D93025" />}
    </View>
    <View style={styles.transactionDetails}>
      <Text style={styles.transactionTitle}>{item.title}</Text>
      <View style={styles.subInfo}>
        <Text style={styles.transactionCategory}>{item.category}</Text>
        <Text style={styles.dot}> • </Text>
        <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
      </View>
    </View>
    <View style={styles.rightContent}>
      <Text style={[styles.transactionAmount, { color: item.type === 'income' ? '#1E8E3E' : '#D93025' }]}>
        {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
      </Text>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
        <Trash2 size={16} color="#70757A" />
      </TouchableOpacity>
    </View>
  </View>
);

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
