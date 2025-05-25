import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useColorStore from '../store/ColorStore'
import { useHabitStore } from '../store/HabitsStore'
import { useCompletedTasksStore } from '../store/CompletedTaskStore'
import Icon from 'react-native-vector-icons/FontAwesome'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, subDays, addDays, isWithinInterval, isSameDay, isAfter } from 'date-fns'
import HeaderBar from '../components/header/HeaderBar'
import { useUserStore } from '../store/UserStore'

const Stat = () => {
  const currentTheme = useColorStore(state => state.currentTheme)
  const primaryColors = useColorStore(state => state.primaryColors)
  const habits = useHabitStore(state => state.habits)
  const completedTasks = useCompletedTasksStore(state => state.completedTasks)
  const getCompletedTasksByDateRange = useCompletedTasksStore(state => state.getCompletedTasksByDateRange)


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

      // Create 24 hours for day view
      chartDays = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(startDate)
        hour.setHours(i)
        return hour
      })
    }
    else if (selectedPeriod === 'Week') {
      startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
      endDate = endOfWeek(currentDate, { weekStartsOn: 1 })
      chartDays = eachDayOfInterval({ start: startDate, end: endDate })
    } else {
      startDate = startOfMonth(currentDate)
      endDate = endOfMonth(currentDate)

      // Create weeks for month view
      chartDays = []
      let weekStart = startOfWeek(startDate, { weekStartsOn: 1 })
      while (weekStart <= endDate) {
        chartDays.push(new Date(weekStart))
        weekStart = addDays(weekStart, 7)
      }
    }

    const chartData = chartDays.map(day => {
      let dayCompletedTasks = 0

      if (selectedPeriod === 'Day') {
        // For hour-based chart in day view
        const hourStart = new Date(day)
        hourStart.setMinutes(0, 0, 0)
        const hourEnd = new Date(day)
        hourEnd.setMinutes(59, 59, 999)

        // Find tasks completed in this hour
        completedTasks.forEach(dayTaskArray => {
          if (dayTaskArray.length > 0) {
            const tasksInHour = dayTaskArray.filter(task => {
              const taskDate = new Date(task.completedAt || task.completedDate)
              return taskDate >= hourStart && taskDate <= hourEnd
            })
            dayCompletedTasks += tasksInHour.length
          }
        })
      } else if (selectedPeriod === 'Week') {
        // For daily chart in week view
        const dayStart = new Date(day)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(day)
        dayEnd.setHours(23, 59, 59, 999)

        completedTasks.forEach(dayTaskArray => {
          if (dayTaskArray.length > 0) {
            const taskDate = new Date(dayTaskArray[0].completedDate)
            taskDate.setHours(0, 0, 0, 0)
            if (taskDate.getTime() === dayStart.getTime()) {
              dayCompletedTasks += dayTaskArray.length
            }
          }
        })
      } else {
        // For weekly chart in month view
        const weekStart = new Date(day)
        const weekEnd = addDays(weekStart, 6)

        completedTasks.forEach(dayTaskArray => {
          if (dayTaskArray.length > 0) {
            const taskDate = new Date(dayTaskArray[0].completedDate)
            if (taskDate >= weekStart && taskDate <= weekEnd) {
              dayCompletedTasks += dayTaskArray.length
            }
          }
        })
      }

      return {
        date: day,
        completed: dayCompletedTasks
      }
    })

    const maxChartValue = Math.max(...chartData.map(item => item.completed), 1)
    const totalCompletedInPeriod = chartData.reduce((total, item) => total + item.completed, 0)

    // Individual habit stats using current habits and completed tasks
    const habitStats = currentHabits.map(habit => {
      // Get completed tasks for this specific habit in the current period
      let habitCompletedTasks = 0

      completedTasks.forEach(dayTaskArray => {
        dayTaskArray.forEach(task => {
          const taskDate = new Date(task.completedDate)
          if ((task.id === habit.id || task.name === habit.name) &&
            taskDate >= startDate && taskDate <= endDate) {
            habitCompletedTasks++
          }
        })
      })

      // Calculate expected completions for this habit in the period
      let expectedCompletions = 0
      if (selectedPeriod === 'Day') {
        expectedCompletions = habit.repeat.type === 'daily' ? 1 : 0
      } else if (selectedPeriod === 'Week') {
        if (habit.repeat.type === 'daily') expectedCompletions = 7
        else if (habit.repeat.type === 'weekly') expectedCompletions = 1
      } else { // Month
        const daysInMonth = endOfMonth(currentDate).getDate()
        if (habit.repeat.type === 'daily') expectedCompletions = daysInMonth
        else if (habit.repeat.type === 'weekly') expectedCompletions = Math.floor(daysInMonth / 7)
        else if (habit.repeat.type === 'monthly') expectedCompletions = 1
      }

      // Calculate progress percentage
      const progress = expectedCompletions > 0
        ? Math.min(Math.round((habitCompletedTasks / expectedCompletions) * 100), 100)
        : habitCompletedTasks > 0 ? 100 : 0

      // Determine status
      let status = 'pending'
      if (progress >= 100) {
        status = 'completed'
      } else if (progress >= 50) {
        status = 'in_progress'
      }

      return {
        id: habit.id,
        name: habit.name,
        progress: progress,
        status: status,
        repeat: habit.repeat,
        completedCount: habitCompletedTasks,
        expectedCount: expectedCompletions,
        description: habit.description
      }
    }).sort((a, b) => b.progress - a.progress)

    return {
      chartData,
      maxChartValue,
      totalHabits: currentHabits.length,
      completedHabits: totalCompletedInPeriod,
      habitStats,
      currentPeriodText: selectedPeriod === 'Day'
        ? format(currentDate, 'MMM dd, yyyy')
        : selectedPeriod === 'Week'
          ? `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')}`
          : format(currentDate, 'MMMM yyyy')
    }
  }, [habits, completedTasks, selectedPeriod, currentDate])

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    const today = new Date()

    if (selectedPeriod === 'Day') {
      direction === 'prev' ? newDate.setDate(newDate.getDate() - 1) : newDate.setDate(newDate.getDate() + 1)
    } else if (selectedPeriod === 'Week') {
      direction === 'prev' ? newDate.setDate(newDate.getDate() - 7) : newDate.setDate(newDate.getDate() + 7)
    } else {
      direction === 'prev' ? newDate.setMonth(newDate.getMonth() - 1) : newDate.setMonth(newDate.getMonth() + 1)
    }

    // Don't allow navigation beyond today
    if (direction === 'next') {
      if (selectedPeriod === 'Day' && isAfter(newDate, today)) {
        return // Don't navigate
      } else if (selectedPeriod === 'Week' && isAfter(startOfWeek(newDate, { weekStartsOn: 1 }), today)) {
        return // Don't navigate
      } else if (selectedPeriod === 'Month' && isAfter(startOfMonth(newDate), today)) {
        return // Don't navigate
      }
    }

    setCurrentDate(newDate)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return primaryColors.Primary
      case 'in_progress':
        return primaryColors.Accent
      default:
        return currentTheme.SecondoryText
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'check-circle'
      case 'in_progress':
        return 'clock-o'
      default:
        return 'circle-o'
    }
  }

  const canNavigateNext = () => {
    const today = new Date()
    const testDate = new Date(currentDate)

    if (selectedPeriod === 'Day') {
      testDate.setDate(testDate.getDate() + 1)
      return !isAfter(testDate, today)
    } else if (selectedPeriod === 'Week') {
      testDate.setDate(testDate.getDate() + 7)
      return !isAfter(startOfWeek(testDate, { weekStartsOn: 1 }), today)
    } else {
      testDate.setMonth(testDate.getMonth() + 1)
      return !isAfter(startOfMonth(testDate), today)
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.Background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <HeaderBar title="Stats" />

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
                  color: selectedPeriod === period ? currentTheme.ButtonText : currentTheme.ButtonText
                }
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dateNavigation}>
          <TouchableOpacity onPress={() => navigatePeriod('prev')}>
            <Icon name="chevron-left" size={20} color={currentTheme.PrimaryText} />
          </TouchableOpacity>
          <Text style={[styles.dateText, { color: currentTheme.PrimaryText }]}>
            {stats.currentPeriodText}
          </Text>
          <TouchableOpacity
            onPress={() => navigatePeriod('next')}
            disabled={!canNavigateNext()}
            style={{ opacity: canNavigateNext() ? 1 : 0.3 }}
          >
            <Icon name="chevron-right" size={20} color={currentTheme.PrimaryText} />
          </TouchableOpacity>
        </View>

        {/* Main Stats Card */}
        <View style={[styles.statsCard, { backgroundColor: currentTheme.Card }]}>
          <Text style={[styles.completionRate, { color: currentTheme.PrimaryText }]}>
            {stats.completedHabits}
          </Text>
          <Text style={[styles.completionLabel, { color: currentTheme.SecondoryText }]}>
            Total Completions
          </Text>

          <View style={styles.chartContainer}>
            {stats.chartData.map((item, index) => {
              const maxHeight = 100
              const barHeight = stats.maxChartValue > 0 ? (item.completed / stats.maxChartValue) * maxHeight : 0

              return (
                <View key={index} style={styles.chartBar}>
                  <View style={[
                    styles.bar,
                    {
                      height: Math.max(barHeight, 4), // Minimum height for visibility
                      backgroundColor: item.completed > 0 ?
                        (barHeight >= 75 ? primaryColors.Primary :
                          barHeight >= 50 ? primaryColors.Accent :
                            barHeight >= 25 ? '#FFC107' : primaryColors.Error) :
                        currentTheme.SecondoryText + '30'
                    }
                  ]} />
                  <Text style={[styles.chartLabel, { color: currentTheme.SecondoryText }]}>
                    {selectedPeriod === 'Day'
                      ? format(item.date, 'HH')
                      : selectedPeriod === 'Week'
                        ? format(item.date, 'EEE')[0]
                        : format(item.date, 'dd')}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* Individual Habit Stats */}
        <View style={styles.habitStatsContainer}>
          <Text style={[styles.sectionTitle, { color: currentTheme.PrimaryText }]}>
            Habit Details
          </Text>

          {stats.habitStats.length === 0 ? (
            <View style={[styles.emptyStateCard, { backgroundColor: currentTheme.Card }]}>
              <Icon name="calendar-o" size={48} color={currentTheme.SecondoryText} />
              <Text style={[styles.emptyStateTitle, { color: currentTheme.PrimaryText }]}>
                No Active Habits
              </Text>
              <Text style={[styles.emptyStateText, { color: currentTheme.SecondoryText }]}>
                Start tracking your habits to see detailed statistics here
              </Text>
            </View>
          ) : (
            stats.habitStats.slice(0, 8).map((habit) => (
              <View key={habit.id} style={[styles.habitStatCard, { backgroundColor: currentTheme.Card }]}>
                <View style={styles.habitStatLeft}>
                  <Icon
                    name={getStatusIcon(habit.status)}
                    size={24}
                    color={getStatusColor(habit.status)}
                  />
                  <View style={styles.habitStatInfo}>
                    <Text style={[styles.habitStatName, { color: currentTheme.PrimaryText }]}>
                      {habit.name}
                    </Text>
                    <Text style={[styles.habitStatType, { color: currentTheme.SecondoryText }]}>
                      {habit.repeat.type.charAt(0).toUpperCase() + habit.repeat.type.slice(1)} • {habit.completedCount} completed
                    </Text>
                  </View>
                </View>
                <View style={styles.habitStatRight}>
                  <Text style={[
                    styles.habitStatProgress,
                    { color: getStatusColor(habit.status) }
                  ]}>
                    {habit.progress}%
                  </Text>
                  <View style={[styles.progressBar, { backgroundColor: currentTheme.SecondoryText + '20' }]}>
                    <View style={[
                      styles.progressFill,
                      {
                        width: `${habit.progress}%`,
                        backgroundColor: getStatusColor(habit.status)
                      }
                    ]} />
                  </View>
                </View>
              </View>
            ))
          )}

          {stats.habitStats.length > 8 && (
            <TouchableOpacity style={[styles.showMoreButton, { backgroundColor: currentTheme.Card }]}>
              <Text style={[styles.showMoreText, { color: primaryColors.Primary }]}>
                Show {stats.habitStats.length - 8} more habits
              </Text>
              <Icon name="chevron-down" size={16} color={primaryColors.Primary} />
            </TouchableOpacity>
          )}
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
  habitStatRight: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  habitStatProgress: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  progressBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  emptyStateCard: {
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
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  showMoreText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
})

export default Stat