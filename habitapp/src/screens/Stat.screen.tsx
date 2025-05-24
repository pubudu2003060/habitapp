import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useColorStore from '../store/ColorStore'
import { useHabitStore } from '../store/HabitsStore'
import Icon from 'react-native-vector-icons/FontAwesome'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, subDays, addDays, isWithinInterval } from 'date-fns'
import HeaderBar from '../components/header/HeaderBar'

const Stat = () => {
  const currentTheme = useColorStore(state => state.currentTheme)
  const primaryColors = useColorStore(state => state.primaryColors)
  const habits = useHabitStore(state => state.habits)

  const [selectedPeriod, setSelectedPeriod] = useState<'Day' | 'Week' | 'Month'>('Week')
  const [currentDate, setCurrentDate] = useState(new Date())

  const periodTypes = ['Day', 'Week', 'Month']

  const stats = useMemo(() => {
    const currentHabits = habits.filter(habit => habit.habitStatus === 'current')

    let startDate: Date
    let endDate: Date
    let chartDays: Date[] = []

    if (selectedPeriod === 'Day') {
      startDate = new Date(currentDate)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(currentDate)
      endDate.setHours(23, 59, 59, 999)

      // Last 7 days for chart
      chartDays = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(currentDate)
        day.setDate(day.getDate() - (6 - i))
        return day
      })
    } else if (selectedPeriod === 'Week') {
      startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
      endDate = endOfWeek(currentDate, { weekStartsOn: 1 })
      chartDays = eachDayOfInterval({ start: startDate, end: endDate })
    } else {
      startDate = startOfMonth(currentDate)
      endDate = endOfMonth(currentDate)

      // Get weeks of the month for chart
      chartDays = []
      let weekStart = startOfWeek(startDate, { weekStartsOn: 1 })
      while (weekStart <= endDate) {
        chartDays.push(new Date(weekStart))
        weekStart = addDays(weekStart, 7)
      }
    }

    // Calculate completion rates for chart
    const chartData = chartDays.map(day => {
      let dayHabits: any[] = []

      if (selectedPeriod === 'Month') {
        // For monthly view, calculate weekly completion rates
        const weekStart = new Date(day)
        const weekEnd = addDays(weekStart, 6)
        dayHabits = currentHabits.filter(habit =>
          habit.repeat.type === 'weekly' || habit.repeat.type === 'daily'
        )
      } else {
        // For daily and weekly views
        const filterType = selectedPeriod === 'Day' ? 'daily' :
          selectedPeriod === 'Week' ? 'daily' : 'weekly'
        dayHabits = currentHabits.filter(habit => habit.repeat.type === filterType)
      }

      const completedHabits = dayHabits.filter(habit => {
        if (!habit.lastCompletedDate) return false
        const completedDate = new Date(habit.lastCompletedDate)

        if (selectedPeriod === 'Day') {
          return completedDate.toDateString() === day.toDateString()
        } else if (selectedPeriod === 'Week') {
          return isWithinInterval(completedDate, {
            start: startOfWeek(day, { weekStartsOn: 1 }),
            end: endOfWeek(day, { weekStartsOn: 1 })
          })
        } else {
          const weekStart = new Date(day)
          const weekEnd = addDays(weekStart, 6)
          return isWithinInterval(completedDate, { start: weekStart, end: weekEnd })
        }
      })

      const rate = dayHabits.length > 0 ? (completedHabits.length / dayHabits.length) * 100 : 0
      return { date: day, rate: Math.round(rate), total: dayHabits.length, completed: completedHabits.length }
    })

    // Overall stats for current period
    const relevantHabits = currentHabits.filter(habit => {
      if (selectedPeriod === 'Day') return habit.repeat.type === 'daily'
      if (selectedPeriod === 'Week') return habit.repeat.type === 'daily' || habit.repeat.type === 'weekly'
      return true // Monthly shows all habits
    })

    const completedInPeriod = relevantHabits.filter(habit => {
      if (!habit.lastCompletedDate) return false
      const completedDate = new Date(habit.lastCompletedDate)
      return isWithinInterval(completedDate, { start: startDate, end: endDate })
    })

    const avgCompletionRate = relevantHabits.length > 0
      ? Math.round((completedInPeriod.length / relevantHabits.length) * 100)
      : 0

    // Individual habit stats
    const habitStats = currentHabits.map(habit => {
      let progress = 0
      let status = 'pending'

      if (habit.goal && habit.progress) {
        if (habit.goal.type === 'units' && habit.progress.type === 'units') {
          progress = habit.goal.amount > 0
            ? Math.round((habit.progress.completedAmount / habit.goal.amount) * 100)
            : 0
        } else if (habit.goal.type === 'timer' && habit.progress.type === 'timer') {
          const goalMinutes = habit.goal.timePeriod.hours * 60 + habit.goal.timePeriod.minutes
          const progressMinutes = habit.progress.completedTimePeriod.hours * 60 + habit.progress.completedTimePeriod.minutes
          progress = goalMinutes > 0
            ? Math.round((progressMinutes / goalMinutes) * 100)
            : 0
        }
      }

      if (habit.completeStatus === 'completed') {
        progress = 100
        status = 'completed'
      }

      return {
        ...habit,
        progress,
        status
      }
    }).sort((a, b) => b.progress - a.progress)

    return {
      chartData,
      avgCompletionRate,
      totalHabits: relevantHabits.length,
      completedHabits: completedInPeriod.length,
      habitStats,
      currentPeriodText: selectedPeriod === 'Day'
        ? format(currentDate, 'MMM dd')
        : selectedPeriod === 'Week'
          ? `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd')}`
          : format(currentDate, 'MMMM yyyy')
    }
  }, [habits, selectedPeriod, currentDate])

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)

    if (selectedPeriod === 'Day') {
      direction === 'prev' ? newDate.setDate(newDate.getDate() - 1) : newDate.setDate(newDate.getDate() + 1)
    } else if (selectedPeriod === 'Week') {
      direction === 'prev' ? newDate.setDate(newDate.getDate() - 7) : newDate.setDate(newDate.getDate() + 7)
    } else {
      direction === 'prev' ? newDate.setMonth(newDate.getMonth() - 1) : newDate.setMonth(newDate.getMonth() + 1)
    }

    setCurrentDate(newDate)
  }

  const maxChartValue = Math.max(...stats.chartData.map(d => d.rate), 10)

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.Background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <HeaderBar title="Stats" />

        {/* Period Selector */}
        <View style={styles.tabContainer}>
          {periodTypes.map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period as any)}
              style={[
                styles.tabButton,
                {
                  backgroundColor: selectedPeriod === period ? primaryColors.Primary : primaryColors.Error,
                }
              ]}
            >
              <Text style={[
                styles.tabText,
                {
                  color: selectedPeriod === period ? currentTheme.ButtonText : currentTheme.SecondoryText
                }
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Navigation */}
        <View style={styles.dateNavigation}>
          <TouchableOpacity onPress={() => navigatePeriod('prev')}>
            <Icon name="chevron-left" size={20} color={currentTheme.PrimaryText} />
          </TouchableOpacity>
          <Text style={[styles.dateText, { color: currentTheme.PrimaryText }]}>
            {stats.currentPeriodText}
          </Text>
          <TouchableOpacity onPress={() => navigatePeriod('next')}>
            <Icon name="chevron-right" size={20} color={currentTheme.PrimaryText} />
          </TouchableOpacity>
        </View>

        {/* Main Stats Card */}
        <View style={[styles.statsCard, { backgroundColor: currentTheme.Card }]}>
          <Text style={[styles.completionRate, { color: currentTheme.PrimaryText }]}>
            {stats.avgCompletionRate}%
          </Text>
          <Text style={[styles.completionLabel, { color: currentTheme.SecondoryText }]}>
            Avg. completion rate
          </Text>

          {/* Chart */}
          <View style={styles.chartContainer}>
            {stats.chartData.map((item, index) => (
              <View key={index} style={styles.chartBar}>
                <View style={[
                  styles.bar,
                  {
                    height: (item.rate / maxChartValue) * 100,
                    backgroundColor: item.rate >= 75 ? primaryColors.Primary :
                      item.rate >= 50 ? primaryColors.Accent :
                        item.rate >= 25 ? '#FFC107' : primaryColors.Error
                  }
                ]} />
                <Text style={[styles.chartLabel, { color: currentTheme.SecondoryText }]}>
                  {selectedPeriod === 'Day'
                    ? format(item.date, 'E')[0]
                    : selectedPeriod === 'Week'
                      ? format(item.date, 'E')[0]
                      : format(item.date, 'dd')}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: currentTheme.Card }]}>
            <Text style={[styles.summaryTitle, { color: currentTheme.SecondoryText }]}>
              Habit Progress
            </Text>
            <Text style={[styles.summaryValue, { color: currentTheme.PrimaryText }]}>
              {stats.completedHabits}/{stats.totalHabits}
            </Text>
            <Icon name="chevron-right" size={16} color={currentTheme.SecondoryText} />
          </View>

          <View style={[styles.summaryCard, { backgroundColor: currentTheme.Card }]}>
            <Text style={[styles.summaryTitle, { color: currentTheme.SecondoryText }]}>
              Challenge Progress
            </Text>
            <Text style={[styles.summaryValue, { color: currentTheme.PrimaryText }]}>
              {stats.avgCompletionRate}%
            </Text>
            <Icon name="chevron-right" size={16} color={currentTheme.SecondoryText} />
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: currentTheme.Card }]}>
            <Text style={[styles.summaryTitle, { color: currentTheme.SecondoryText }]}>
              Leaderboard
            </Text>
            <Text style={[styles.summaryValue, { color: currentTheme.PrimaryText }]}>
              #{Math.max(1, 10 - Math.floor(stats.avgCompletionRate / 10))}
            </Text>
            <Icon name="chevron-right" size={16} color={currentTheme.SecondoryText} />
          </View>

          <View style={[styles.summaryCard, { backgroundColor: currentTheme.Card }]}>
            <Text style={[styles.summaryTitle, { color: currentTheme.SecondoryText }]}>
              Points Earned
            </Text>
            <Text style={[styles.summaryValue, { color: currentTheme.PrimaryText }]}>
              {stats.completedHabits * 10}
            </Text>
            <Icon name="chevron-right" size={16} color={currentTheme.SecondoryText} />
          </View>
        </View>

        {/* Individual Habit Stats */}
        <View style={styles.habitStatsContainer}>
          <Text style={[styles.sectionTitle, { color: currentTheme.PrimaryText }]}>
            Habit Details
          </Text>

          {stats.habitStats.slice(0, 5).map((habit) => (
            <View key={habit.id} style={[styles.habitStatCard, { backgroundColor: currentTheme.Card }]}>
              <View style={styles.habitStatLeft}>
                <Icon name="circle" size={24} color={primaryColors.Primary} />
                <View style={styles.habitStatInfo}>
                  <Text style={[styles.habitStatName, { color: currentTheme.PrimaryText }]}>
                    {habit.name}
                  </Text>
                  <Text style={[styles.habitStatType, { color: currentTheme.SecondoryText }]}>
                    {habit.repeat.type.charAt(0).toUpperCase() + habit.repeat.type.slice(1)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.habitStatProgress, { color: primaryColors.Primary }]}>
                {habit.progress}%
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsCard: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completionRate: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 4,
  },
  completionLabel: {
    fontSize: 16,
    marginBottom: 30,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    height: 120,
    paddingHorizontal: 10,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  bar: {
    width: '80%',
    minHeight: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  habitStatsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  habitStatCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  habitStatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitStatInfo: {
    marginLeft: 12,
    flex: 1,
  },
  habitStatName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  habitStatType: {
    fontSize: 14,
  },
  habitStatProgress: {
    fontSize: 18,
    fontWeight: '700',
  },
})

export default Stat