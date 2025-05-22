import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useHabitStore } from '../store/HabitsStore'
import useColorStore from '../store/ColorStore'
import HeaderBar from '../components/header/HeaderBar'
import HabitCard from '../components/explore/HabitCard'

const Explore = () => {
  const habits = useHabitStore(state => state.habits)
  const currentTheme = useColorStore(state => state.currentTheme);
  const primaryColors = useColorStore(state => state.primaryColors);

  const [filter, setFilter] = useState<'all' | 'current' | 'completed' | 'pending'>('all');

  const filteredHabits = habits.filter(habit => {
    if (filter === 'all') return true;
    if (filter === 'current') return habit.habitStatus === 'current';
    if (filter === 'completed') return habit.completeStatus === 'completed';
    if (filter === 'pending') return habit.completeStatus === 'pending';
    return true;
  });

  const getFilterButtonStyle = (filterType: string) => ({
    backgroundColor: filter === filterType ? primaryColors.Primary : currentTheme.Card,
    borderColor: filter === filterType ? primaryColors.Primary : currentTheme.Border,
  });

  const getFilterTextStyle = (filterType: string) => ({
    color: filter === filterType ? currentTheme.ButtonText : currentTheme.PrimaryText,
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.Background }]}>
      <HeaderBar title='Explore your Habits' />

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContainer}
        >
          {['all', 'current', 'completed', 'pending'].map((filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[styles.filterButton, getFilterButtonStyle(filterType)]}
              onPress={() => setFilter(filterType as any)}
            >
              <Text style={[styles.filterText, getFilterTextStyle(filterType)]}>
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType === 'all' && ` (${habits.length})`}
                {filterType === 'current' && ` (${habits.filter(h => h.habitStatus === 'current').length})`}
                {filterType === 'completed' && ` (${habits.filter(h => h.completeStatus === 'completed').length})`}
                {filterType === 'pending' && ` (${habits.filter(h => h.completeStatus === 'pending').length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredHabits.length > 0 ? (
          filteredHabits.map((habit, index) => (
            <HabitCard key={habit.id} habit={habit} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyIcon, { color: currentTheme.SecondoryText }]}>📝</Text>
            <Text style={[styles.emptyTitle, { color: currentTheme.PrimaryText }]}>
              {filter === 'all' ? 'No habits found' : `No ${filter} habits`}
            </Text>
            <Text style={[styles.emptyText, { color: currentTheme.SecondoryText }]}>
              {filter === 'all'
                ? 'Create your first habit to get started!'
                : `You don't have any ${filter} habits at the moment.`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom:100
  },
  filterContainer: {
    paddingVertical: 12,
  },
  filterScrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default Explore