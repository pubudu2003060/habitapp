import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useHabitStore } from '../store/HabitsStore'
import useColorStore from '../store/ColorStore'
import HeaderBar from '../components/header/HeaderBar'
import HabitCard from '../components/explore/HabitCard'
import LottieView from 'lottie-react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const Explore = () => {
  const habits = useHabitStore(state => state.habits)
  const currentTheme = useColorStore(state => state.currentTheme);
  const primaryColors = useColorStore(state => state.primaryColors);

  const [filter, setFilter] = useState<'all' | 'current' | 'completed' | 'pending'>('all');

  const filteredHabits = habits.filter(habit => {
    if (filter === 'all') return true;
    if (filter === 'current') return habit.habitStatus === 'current';
    if (filter === 'completed') return habit.habitStatus === 'current' && habit.completeStatus === 'completed';
    if (filter === 'pending') return habit.habitStatus === 'current' && habit.completeStatus === 'pending';
    return true;
  });

  const getFilterButtonStyle = (filterType: string) => ({
    backgroundColor: filter === filterType ? primaryColors.Primary : currentTheme.Card,
    borderColor: filter === filterType ? primaryColors.Primary : currentTheme.Border,
  });

  const getFilterTextStyle = (filterType: string) => ({
    color: filter === filterType ? currentTheme.ButtonText : currentTheme.PrimaryText,
  });

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [filter, habits]);

  const isDark = useColorStore(state => state.isDark)

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
                {filterType === 'completed' && ` (${habits.filter(h => h.habitStatus === 'current' && h.completeStatus === 'completed').length})`}
                {filterType === 'pending' && ` (${habits.filter(h => h.habitStatus === 'current' && h.completeStatus === 'pending').length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ?
          isDark ? <View style={styles.emptyContainer}>
            <LottieView
              style={styles.animation}
              source={require('../assets/animations/darkHabitLoading.json')}
              autoPlay
              loop
            />
          </View> : <View style={styles.emptyContainer}>
            <LottieView
              style={styles.animation}
              source={require('../assets/animations/habitLoading.json')}
              autoPlay
              loop
            />
          </View> : filteredHabits.length > 0 ? (
            filteredHabits.map((habit, index) => (
              <HabitCard key={habit.id} habit={habit} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyStateCard, { backgroundColor: currentTheme.Card }]}>
                <Icon name="calendar-o" size={48} color={currentTheme.SecondoryText} />
                <Text style={[styles.emptyStateTitle, { color: currentTheme.PrimaryText }]}>
                  {filter === 'all' ? 'No habits found' : `No ${filter} habits`}
                </Text>
                <Text style={[styles.emptyStateText, { color: currentTheme.SecondoryText }]}>
                  {filter === 'all'
                    ? 'Create your first habit to get started! Start by adding a new habit and track your progress every day.'
                    : `You don't have any ${filter} habits at the moment. Try creating a new habit or updating your existing ones to see them here.`
                  }
                </Text>
              </View>
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

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
    paddingBottom: 110,
  },
  animation: {
    width: 240,
    height: 240,
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
  }, emptyStateCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Explore