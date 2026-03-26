import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatItem = ({ icon, label, value, iconBgColor, valueColor = '#FFF' }) => (
  <View style={styles.statItem}>
    <View style={[styles.statIconWrapper, { backgroundColor: iconBgColor }]}>
      {icon}
    </View>
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  statItem: { flexDirection: 'row', alignItems: 'center' },
  statIconWrapper: { padding: 8, borderRadius: 12, marginRight: 10 },
  statLabel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 },
  statValue: { fontSize: 16, fontWeight: '600' },
});

export default StatItem;
