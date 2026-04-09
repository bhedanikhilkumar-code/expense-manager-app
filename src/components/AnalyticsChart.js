import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart, TrendingDown } from 'lucide-react-native';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../utils/formatters';

const AnalyticsChart = () => {
  const { getSpendingByCategory, totalExpense, theme, isDarkMode } = useTransactions();
  const spendingData = getSpendingByCategory();

  if (spendingData.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <PieChart size={20} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>Spending Analysis</Text>
        </View>
        <Text style={[styles.totalExpense, { color: theme.subText }]}>
          Total: {formatCurrency(totalExpense)}
        </Text>
      </View>
      
      <View style={styles.chartContainer}>
        {spendingData.sort((a, b) => b.amount - a.amount).slice(0, 5).map((item, index) => {
          const percentage = totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0;
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.labelRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  <Text style={[styles.categoryName, { color: theme.text }]}>{item.name}</Text>
                </View>
                <Text style={[styles.categoryAmount, { color: theme.subText }]}>
                  {formatCurrency(item.amount)} ({percentage.toFixed(1)}%)
                </Text>
              </View>
              <View style={[styles.progressBarBg, { backgroundColor: isDarkMode ? '#333' : '#E8EAED' }]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: 'bold', marginLeft: 10 },
  totalExpense: { fontSize: 13, fontWeight: '600' },
  chartContainer: {},
  barContainer: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  categoryName: { fontSize: 14, fontWeight: '600' },
  categoryAmount: { fontSize: 12 },
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
});

export default AnalyticsChart;
