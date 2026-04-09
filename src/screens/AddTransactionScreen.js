import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { ChevronLeft, Save, Calculator } from 'lucide-react-native';
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
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ChevronLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Add Transaction</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.typeToggle, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TouchableOpacity 
              style={[
                styles.typeBtn, 
                type === 'expense' && { backgroundColor: theme.expense }
              ]}
              onPress={() => handleTypeChange('expense')}
            >
              <Text style={[
                styles.typeBtnText, 
                { color: type === 'expense' ? '#FFF' : theme.subText }
              ]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.typeBtn, 
                type === 'income' && { backgroundColor: theme.income }
              ]}
              onPress={() => handleTypeChange('income')}
            >
              <Text style={[
                styles.typeBtnText, 
                { color: type === 'income' ? '#FFF' : theme.subText }
              ]}>Income</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.amountCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.amountLabel, { color: theme.subText }]}>Amount (₹)</Text>
            <View style={styles.amountInputRow}>
              <Text style={[styles.currencySymbol, { color: theme.primary }]}>₹</Text>
              <TextInput
                style={[styles.amountInput, { color: theme.text }]}
                placeholder="0"
                placeholderTextColor={theme.subText}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryCard,
                  { backgroundColor: theme.card, borderColor: category === cat ? (type === 'expense' ? theme.expense : theme.income) : theme.border },
                  category === cat && { borderWidth: 2 }
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryText, 
                  { color: category === cat ? (type === 'expense' ? theme.expense : theme.income) : theme.subText }
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
          <View style={[styles.inputCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TextInput
              style={[styles.titleInput, { color: theme.text }]}
              placeholder="What was this for?"
              placeholderTextColor={theme.subText}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.saveButton, 
              { backgroundColor: theme.primary, opacity: (!title.trim() || !amount) ? 0.5 : 1 }
            ]} 
            onPress={handleSave}
            disabled={!title.trim() || !amount}
          >
            <Save size={22} color="#FFF" style={{ marginRight: 10 }} />
            <Text style={styles.saveButtonText}>Save Transaction</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backButton: { padding: 10, borderRadius: 12, borderWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  typeToggle: { flexDirection: 'row', borderRadius: 16, padding: 4, borderWidth: 1, marginBottom: 20 },
  typeBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  typeBtnText: { fontSize: 16, fontWeight: '700' },
  amountCard: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 24 },
  amountLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  amountInputRow: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: { fontSize: 36, fontWeight: 'bold', marginRight: 8 },
  amountInput: { fontSize: 42, fontWeight: 'bold', flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, marginTop: 8 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  categoryCard: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, borderWidth: 1, minWidth: '30%', alignItems: 'center' },
  categoryText: { fontSize: 14, fontWeight: '600' },
  inputCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
  titleInput: { fontSize: 16 },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 16, marginBottom: 30 },
  saveButtonText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
});

export default AddTransactionScreen;
