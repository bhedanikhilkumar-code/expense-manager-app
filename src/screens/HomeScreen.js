import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, ScrollView, StatusBar } from 'react-native';
import { Plus, Search, X, Moon, Sun, TrendingUp, Wallet } from 'lucide-react-native';
import { useTransactions } from '../context/TransactionContext';
import BalanceCard from '../components/BalanceCard';
import TransactionItem from '../components/TransactionItem';
import AnalyticsChart from '../components/AnalyticsChart';

const HomeScreen = ({ navigation }) => {
  const { 
    transactions, balance, totalIncome, totalExpense, deleteTransaction, 
    loading, theme, isDarkMode, toggleTheme, activeFilter, setActiveFilter 
  } = useTransactions();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const filters = ['All', 'Today', 'Week', 'Month'];

  const filteredTransactions = transactions.filter(t => {
    const title = String(t.title || '').toLowerCase();
    const category = String(t.category || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || category.includes(query);
  });

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={styles.header}>
        {!isSearchActive ? (
          <View style={styles.headerTop}>
            <View style={styles.headerTitleSection}>
              <View style={styles.logoContainer}>
                <Wallet size={28} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.greeting, { color: theme.text }]}>Namaste!</Text>
                <Text style={[styles.subGreeting, { color: theme.subText }]}>Your expense tracker</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={toggleTheme} style={[styles.iconBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {isDarkMode ? <Sun size={22} color="#FFD700" /> : <Moon size={22} color="#5F6368" />}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsSearchActive(true)} style={[styles.iconBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Search size={22} color={theme.subText} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.primary }]}>
            <Search size={20} color={theme.primary} style={{ marginRight: 10 }} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search transactions..."
              placeholderTextColor={theme.subText}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => {
              setIsSearchActive(false);
              setSearchQuery('');
            }}>
              <X size={20} color={theme.subText} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <BalanceCard 
          balance={balance}
          income={totalIncome}
          expense={totalExpense}
        />

        <View style={styles.filterSection}>
          <Text style={[styles.sectionLabel, { color: theme.subText }]}>Filter by</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {filters.map((f) => (
              <TouchableOpacity 
                key={f}
                style={[
                  styles.filterChip, 
                  { backgroundColor: activeFilter === f ? theme.primary : theme.card, borderColor: activeFilter === f ? theme.primary : theme.border }
                ]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[
                  styles.filterText, 
                  { color: activeFilter === f ? '#FFF' : theme.subText }
                ]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {!isSearchActive && <AnalyticsChart />}

        <View style={styles.transactionListHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {isSearchActive ? 'Search Results' : 'Recent Transactions'}
          </Text>
          <Text style={[styles.transactionCount, { color: theme.subText }]}>
            {filteredTransactions.length} items
          </Text>
        </View>

        <View style={styles.listContainer}>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(item => (
              <TransactionItem key={item.id} item={item} onDelete={deleteTransaction} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.subText }]}>
                {searchQuery ? 'No matching transactions found.' : 'No transactions yet. Start adding some!'}
              </Text>
            </View>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Plus color="#FFF" size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitleSection: { flexDirection: 'row', alignItems: 'center' },
  logoContainer: { 
    width: 50, 
    height: 50, 
    borderRadius: 16, 
    backgroundColor: '#E8F0FE', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  headerActions: { flexDirection: 'row' },
  greeting: { fontSize: 22, fontWeight: 'bold' },
  subGreeting: { fontSize: 13, marginTop: 2 },
  iconBtn: { padding: 12, borderRadius: 14, marginLeft: 10, borderWidth: 1 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 16 },
  scrollContent: { paddingBottom: 20 },
  filterSection: { marginTop: 10, marginBottom: 5 },
  sectionLabel: { fontSize: 12, fontWeight: '600', marginLeft: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  filterChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginRight: 10, borderWidth: 1 },
  filterText: { fontSize: 14, fontWeight: '600' },
  transactionListHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20, 
    marginTop: 25, 
    marginBottom: 15 
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  transactionCount: { fontSize: 13 },
  listContainer: { paddingHorizontal: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16 },
  fab: { 
    position: 'absolute', 
    bottom: 30, 
    right: 24, 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 8, 
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12 
  },
});

export default HomeScreen;
