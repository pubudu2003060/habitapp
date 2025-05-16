import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { habitType } from '../../types/Types'
import useColorStore from '../../store/ColorStore'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

const HabitCard = ({ habit, displayedDay }: { habit: habitType, displayedDay: Date }) => {
  const currentTheme = useColorStore(state => state.currentTheme)
  const primaryColors = useColorStore(state => state.primaryColors)

  // Calculate progress placeholder - you would replace this with actual tracking logic
  const progress = Math.floor(Math.random() * 100)

  const getRepeatText = () => {
    if (habit.repeat.type === 'daily') {
      return `${habit.repeat.days.length} days per week`
    } else if (habit.repeat.type === 'weekly') {
      if (habit.goal?.type === 'units') {
        return `${habit.goal.amount} ${habit.goal.amount > 1 ? 'times' : 'time'} per week`
      } else if (habit.goal?.type === 'timer') {
        const hours = habit.goal?.timePeriod.hours || 0
        const minutes = habit.goal?.timePeriod.minutes || 0
        if (hours > 0) {
          return `${hours}h ${minutes}m per week`
        } else {
          return `${minutes} minutes per week`
        }
      }
      return 'Weekly'
    } else {
      if (habit.goal?.type === 'units') {
        return `${habit.goal.amount} ${habit.goal.amount > 1 ? 'times' : 'time'} per month`
      } else if (habit.goal?.type === 'timer') {
        const hours = habit.goal?.timePeriod.hours || 0
        const minutes = habit.goal?.timePeriod.minutes || 0
        if (hours > 0) {
          return `${hours}h ${minutes}m per month`
        } else {
          return `${minutes} minutes per month`
        }
      }
      return 'Monthly'
    }
  }

  return (
    <View style={[styles.card, { backgroundColor: currentTheme.Card }]}>
      <View style={styles.cardContent}>
        <View style={styles.progressContainer}>
          <AnimatedCircularProgress
            size={60}
            width={6}
            fill={progress}
            rotation={0}
            tintColor={primaryColors.Primary}
            backgroundColor={currentTheme.Border}
          >
            {(fill:any) => (
              <Text style={[styles.progressText, { color: currentTheme.PrimaryText }]}>
                {Math.round(fill)}%
              </Text>
            )}
          </AnimatedCircularProgress>
        </View>
        
        <View style={styles.habitInfo}>
          <Text style={[styles.habitName, { color: currentTheme.PrimaryText }]}>
            {habit.name}
          </Text>
          <Text style={[styles.habitDescription, { color: currentTheme.SecondoryText }]} numberOfLines={2}>
            {habit.description}
          </Text>
          <Text style={[styles.repeatInfo, { color: primaryColors.Accent }]}>
            {getRepeatText()}
          </Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: primaryColors.Primary }]}
          onPress={() => {/* Mark as complete functionality */}}
        >
          <Text style={[styles.actionText, { color: currentTheme.ButtonText }]}>Complete</Text>
        </TouchableOpacity>
        
        {habit.goal?.type === 'units' && (
          <View style={styles.unitContainer}>
            <Text style={[styles.unitText, { color: currentTheme.PrimaryText }]}>
              0/{habit.goal.amount}
            </Text>
          </View>
        )}
        
        {habit.goal?.type === 'timer' && (
          <View style={styles.timerContainer}>
            <Text style={[styles.timerText, { color: currentTheme.PrimaryText }]}>
              0/{habit.goal.timePeriod.hours}h {habit.goal.timePeriod.minutes}m
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  progressContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 14,
    marginBottom: 6,
  },
  repeatInfo: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  actionText: {
    fontWeight: '600',
    fontSize: 14,
  },
  unitContainer: {
    alignItems: 'center',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '700',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
  }
});

export default HabitCard