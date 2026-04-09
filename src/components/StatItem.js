import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatItem = ({ icon, label, value, iconBgColor, valueColor = '#FFF', labelColor = 'rgba(255, 255, 255, 0.7)' }) => (
  <View style={styles.statItem}>
    <View style={[styles.statIconWrapper, { backgroundColor: iconBgColor }]}>
      {icon}
    </View>
    <View>
      <Text style={[styles.statLabel, { color: labelColor }]}>{label}</Text>
      <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  statItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statIconWrapper: { padding: 10, borderRadius: 12, marginRight: 12 },
  statLabel: { fontSize: 12, fontWeight: '500' },
  statValue: { fontSize: 16, fontWeight: '700', marginTop: 2 },
});

export default StatItem;
