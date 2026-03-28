import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { Plus, Search, X, Moon, Sun } from 'lucide-react-native';
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
      <View style={styles.header}>
        {!isSearchActive ? (
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: theme.text }]}>Namaste! 🙏</Text>
              <Text style={[styles.subGreeting, { color: theme.subText }]}>Aapka aaj ka kharcha yahan hai.</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={toggleTheme} style={[styles.iconBtn, { backgroundColor: theme.card, marginRight: 10 }]}>
                {isDarkMode ? <Sun size={24} color="#FFD700" /> : <Moon size={24} color="#5F6368" />}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsSearchActive(true)} style={[styles.iconBtn, { backgroundColor: theme.card }]}>
                <Search size={24} color={theme.subText} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
            <Search size={20} color={theme.subText} style={{ marginRight: 10 }} />
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <BalanceCard 
          balance={balance}
          income={totalIncome}
          expense={totalExpense}
        />

        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {filters.map((f) => (
              <TouchableOpacity 
                key={f}
                style={[
                  styles.filterChip, 
                  { backgroundColor: activeFilter === f ? theme.primary : theme.card }
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
        style={[styles.fab, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Plus color="#FFF" size={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerActions: { flexDirection: 'row' },
  greeting: { fontSize: 24, fontWeight: 'bold' },
  subGreeting: { fontSize: 14, marginTop: 4 },
  iconBtn: { padding: 10, borderRadius: 14, elevation: 1 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, elevation: 2 },
  searchInput: { flex: 1, fontSize: 16 },
  filterRow: { marginTop: 20, marginBottom: 5 },
  filterChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginRight: 10, elevation: 1 },
  filterText: { fontSize: 14, fontWeight: '600' },
  transactionListHeader: { paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  listContainer: { paddingHorizontal: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16 },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
});

export default HomeScreen;
