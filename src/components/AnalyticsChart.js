import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTransactions } from '../context/TransactionContext';

const AnalyticsChart = () => {
  const { getSpendingByCategory, totalExpense, theme } = useTransactions();
  const spendingData = getSpendingByCategory();

  if (spendingData.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>Spending Analysis</Text>
      {spendingData.sort((a, b) => b.amount - a.amount).slice(0, 5).map((item, index) => {
        const percentage = totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0;
        return (
          <View key={index} style={styles.barContainer}>
            <View style={styles.labelRow}>
              <Text style={[styles.categoryName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.categoryAmount, { color: theme.subText }]}>₹{item.amount.toLocaleString()}</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: theme.background }]}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${percentage}%`, 
                    backgroundColor: item.color
                  }
                ]} 
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  barContainer: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryAmount: {
    fontSize: 13,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default AnalyticsChart;
