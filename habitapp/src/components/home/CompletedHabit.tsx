import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { useHabitStore } from '../../store/HabitsStore'
import { habitType } from '../../types/Types'
import useColorStore from '../../store/ColorStore'
import CompletedHabitCard from './CompletedHabitCard'

const CompletedHabit = ({ displayedDay }: { displayedDay: Date }) => {
    const habits = useHabitStore(state => state.habits)
    const [timePeriod, setTimePeriod] = useState('daily')
    const [todayHabits, setTodayHabits] = useState<habitType[]>([])

    const currentTheme = useColorStore(state => state.currentTheme)
    const primaryColors = useColorStore(state => state.primaryColors)

    const getTodayHabits = (habits: habitType[], timePeriod: string) => {
        const filteredHabits = habits.filter((habit) => habit.repeat.type === timePeriod)
        setTodayHabits(filteredHabits)
    }

    useEffect(() => {
        getTodayHabits(habits, timePeriod)
    }, [habits, timePeriod, displayedDay])

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: currentTheme.PrimaryText }]}>Completed Habits</Text>

            {todayHabits.length > 0 ? (
                <FlatList
                    data={todayHabits}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <CompletedHabitCard habit={item} displayedDay={displayedDay} />
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: currentTheme.SecondoryText }]}>
                        No {timePeriod} habits to complete
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 100,
        marginTop: 30,
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
    listContainer: {
        paddingBottom: 10,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontStyle: 'italic',
    }
});

export default CompletedHabit