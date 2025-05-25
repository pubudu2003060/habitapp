import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useColorStore from '../store/ColorStore'
import { useHabitStore } from '../store/HabitsStore'
import { useCompletedTasksStore } from '../store/CompletedTaskStore'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, subDays, addDays, isWithinInterval, isSameDay, isAfter } from 'date-fns'
import HeaderBar from '../components/header/HeaderBar'
import StatBar from '../components/stat/StatBar'
import HabitStat from '../components/stat/HabitStat'
import { statType } from '../types/Types'

const Stat = () => {
  const currentTheme = useColorStore(state => state.currentTheme)
  const habits = useHabitStore(state => state.habits)
  const completedTasks = useCompletedTasksStore(state => state.completedTasks)

  const [selectedPeriod, setSelectedPeriod] = useState<'Day' | 'Week' | 'Month'>('Week')
  const [currentDate, setCurrentDate] = useState(new Date())

  const stats: statType = useMemo(() => {
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.Background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar title="Stats" />
        <StatBar selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} stats={stats} currentDate={currentDate} setCurrentDate={setCurrentDate} />
        <HabitStat {...stats} />
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
})

export default Stat