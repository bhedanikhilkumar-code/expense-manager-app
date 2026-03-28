import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput } from 'react-native';
import { Plus, Search, X } from 'lucide-react-native';
import { useTransactions } from '../context/TransactionContext';
import BalanceCard from '../components/BalanceCard';
import TransactionItem from '../components/TransactionItem';

const HomeScreen = ({ navigation }) => {
  const { transactions, balance, totalIncome, totalExpense, deleteTransaction, loading } = useTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const filteredTransactions = transactions.filter(t => {
    const title = String(t.title || '').toLowerCase();
    const category = String(t.category || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || category.includes(query);
  });

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {!isSearchActive ? (
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Namaste! 🙏</Text>
              <Text style={styles.subGreeting}>Aapka aaj ka kharcha yahan hai.</Text>
            </View>
            <TouchableOpacity onPress={() => setIsSearchActive(true)} style={styles.iconBtn}>
              <Search size={24} color="#5F6368" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.searchBar}>
            <Search size={20} color="#5F6368" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => {
              setIsSearchActive(false);
              setSearchQuery('');
            }}>
              <X size={20} color="#5F6368" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <BalanceCard 
        balance={balance}
        income={totalIncome}
        expense={totalExpense}
      />

      <View style={styles.transactionListHeader}>
        <Text style={styles.sectionTitle}>
          {isSearchActive ? 'Search Results' : 'Recent Transactions'}
        </Text>
        {!isSearchActive && (
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={deleteTransaction} />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No matching transactions found.' : 'No transactions yet. Start adding some!'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Plus color="#FFF" size={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#202124' },
  subGreeting: { fontSize: 14, color: '#5F6368', marginTop: 4 },
  iconBtn: { padding: 8, backgroundColor: '#FFF', borderRadius: 12, elevation: 1 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, elevation: 2 },
  searchInput: { flex: 1, fontSize: 16, color: '#202124' },
  transactionListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#202124' },
  seeAll: { color: '#1A73E8', fontWeight: '600' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#70757A', fontSize: 16 },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#1A73E8', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#1A73E8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
});

export default HomeScreen;
