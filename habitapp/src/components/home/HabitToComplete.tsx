import React, { use, useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { useHabitStore } from '../../store/HabitsStore'
import { habitType } from '../../types/Types'
import HabitCard from './HabitCard'
import useColorStore from '../../store/ColorStore'
import { set } from 'date-fns'
import LottieView from 'lottie-react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const HabitToComplete = () => {

    const [loading, setLoading] = useState(true)

    const currentHabits = useHabitStore(state => state.habits)

    const periodTypes = ['daily', 'weekly', 'monthly']
    const [timePeriod, setTimePeriod] = useState('daily')
    const [todayHabits, setTodayHabits] = useState<habitType[]>([])

    const currentTheme = useColorStore(state => state.currentTheme)
    const primaryColors = useColorStore(state => state.primaryColors)
    const isDark = useColorStore(state => state.isDark)

    useEffect(() => {
        setLoading(true)

        const timeout = setTimeout(() => {
            const sortedHabits = currentHabits.filter(
                (habit) => habit.habitStatus === 'current' && habit.repeat.type === timePeriod
            )
            setTodayHabits(sortedHabits)
            setLoading(false)
        }, 500)

        return () => clearTimeout(timeout)
    }, [timePeriod, currentHabits])

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: currentTheme.PrimaryText }]}>Habits to Complete</Text>

            <View style={styles.tabContainer}>
                {periodTypes.map((period, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => setTimePeriod(period)}
                        style={[
                            styles.tabButton,
                            {
                                backgroundColor: timePeriod === period ? primaryColors.Primary : primaryColors.Error,
                                marginRight: 10
                            }
                        ]}
                    >
                        <Text style={[styles.tabText, { color: currentTheme.ButtonText }]}>
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {loading ?
                isDark ? <View style={styles.emptyContainer}>
                    <LottieView
                        style={styles.animation}
                        source={require('../../assets/animations/darkHabitLoading.json')}
                        autoPlay
                        loop
                    />
                </View> : <View style={styles.emptyContainer}>
                    <LottieView
                        style={styles.animation}
                        source={require('../../assets/animations/habitLoading.json')}
                        autoPlay
                        loop
                    />
                </View>
                : todayHabits.length > 0 ? todayHabits.map((habit) => (
                    <HabitCard key={habit.id.toString()} habit={habit} />
                )) : (
                    <View style={styles.emptyContainer}>
                        <View style={[styles.emptyStateCard, { backgroundColor: currentTheme.Card }]}>
                            <Icon name="calendar-o" size={48} color={currentTheme.SecondoryText} />
                            <Text style={[styles.emptyStateTitle, { color: currentTheme.PrimaryText }]}>
                                No {timePeriod} habits to complete.
                            </Text>
                            <Text style={[styles.emptyStateText, { color: currentTheme.SecondoryText }]}>
                                Add a new habit or check back later to see your {timePeriod} habits here.
                            </Text>
                        </View>
                    </View>
                )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 12,
        marginBottom: 100,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        marginTop: 10,
        paddingHorizontal: 4,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontWeight: '600',
        fontSize: 14,
    },
    emptyContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    animation: {
        width: 240,
        height: 240,
        alignSelf: 'center',
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        fontStyle: 'italic',
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
});

export default HabitToComplete