import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ChevronLeft, Save } from 'lucide-react-native';
import { useTransactions } from '../context/TransactionContext';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'General'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Bonus', 'Other'];

const AddTransactionScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  
  const { addTransaction, theme, isDarkMode } = useTransactions();

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  const handleSave = () => {
    if (!title.trim() || !amount) return;
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    addTransaction({
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
    });
    navigation.goBack();
  };

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: theme.card }]}>
            <ChevronLeft size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Add Transaction</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.subText }]}>Transaction Type</Text>
            <View style={[styles.typeContainer, { backgroundColor: theme.card }]}>
              <TouchableOpacity 
                style={[
                  styles.typeButton, 
                  type === 'expense' && (isDarkMode ? { backgroundColor: '#3C1E1E' } : styles.activeExpense)
                ]}
                onPress={() => handleTypeChange('expense')}
              >
                <Text style={[
                  styles.typeText, 
                  { color: type === 'expense' ? theme.expense : theme.subText }
                ]}>Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.typeButton, 
                  type === 'income' && (isDarkMode ? { backgroundColor: '#1B3320' } : styles.activeIncome)
                ]}
                onPress={() => handleTypeChange('income')}
              >
                <Text style={[
                  styles.typeText, 
                  { color: type === 'income' ? theme.income : theme.subText }
                ]}>Income</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: theme.subText }]}>Amount</Text>
            <View style={[styles.inputWrapper, { borderBottomColor: theme.primary }]}>
              <Text style={[styles.currencySymbol, { color: theme.text }]}>₹</Text>
              <TextInput
                style={[styles.amountInput, { color: theme.text }]}
                placeholder="0"
                placeholderTextColor={theme.subText}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                autoFocus
              />
            </View>

            <Text style={[styles.label, { color: theme.subText }]}>Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: theme.card },
                    category === cat && (type === 'expense' ? (isDarkMode ? { backgroundColor: '#3C1E1E' } : styles.chipActiveExpense) : (isDarkMode ? { backgroundColor: '#1B3320' } : styles.chipActiveIncome))
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[
                    styles.categoryChipText, 
                    { color: theme.subText },
                    category === cat && { color: type === 'expense' ? theme.expense : theme.income, fontWeight: 'bold' }
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: theme.subText }]}>What was it for?</Text>
            <TextInput
              style={[styles.titleInput, { borderBottomColor: theme.border, color: theme.text }]}
              placeholder="e.g. Dinner, Rent, Bonus"
              placeholderTextColor={theme.subText}
              value={title}
              onChangeText={setTitle}
            />

            <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={handleSave}>
              <Save size={20} color="#FFF" style={{ marginRight: 10 }} />
              <Text style={styles.saveButtonText}>Save Transaction</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { padding: 8, backgroundColor: '#F1F3F4', borderRadius: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#202124' },
  form: { padding: 24, flex: 1 },
  label: { fontSize: 14, fontWeight: '600', color: '#5F6368', marginBottom: 10, marginTop: 20 },
  typeContainer: { flexDirection: 'row', backgroundColor: '#F1F3F4', borderRadius: 16, padding: 4 },
  typeButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  typeText: { fontSize: 16, fontWeight: '600', color: '#5F6368' },
  activeExpense: { backgroundColor: '#FCE8E6' },
  activeIncome: { backgroundColor: '#E6F4EA' },
  activeTypeText: { color: '#202124' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#1A73E8', paddingBottom: 8 },
  currencySymbol: { fontSize: 32, fontWeight: 'bold', color: '#202124', marginRight: 8 },
  amountInput: { fontSize: 40, fontWeight: 'bold', color: '#202124', flex: 1 },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F3F4' },
  chipActiveExpense: { backgroundColor: '#FCE8E6' },
  chipActiveIncome: { backgroundColor: '#E6F4EA' },
  categoryChipText: { fontSize: 14, color: '#5F6368', fontWeight: '500' },
  categoryChipTextActive: { color: '#202124' },
  titleInput: { fontSize: 18, borderBottomWidth: 1, borderBottomColor: '#DADCE0', paddingVertical: 12, color: '#202124' },
  saveButton: { backgroundColor: '#1A73E8', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 16, marginTop: 40, marginBottom: 20, elevation: 4 },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

export default AddTransactionScreen;
