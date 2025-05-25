import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import useColorStore from '../../store/ColorStore'
import { statType } from '../../types/Types'

const HabitStat = (stats:statType) => {

    const currentTheme = useColorStore(state => state.currentTheme)
    const primaryColors = useColorStore(state => state.primaryColors)

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

    return (
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
    )
}

const styles = StyleSheet.create({
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

export default HabitStat
