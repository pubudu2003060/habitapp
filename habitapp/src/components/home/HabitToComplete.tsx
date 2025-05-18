import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { useHabitStore } from '../../store/HabitsStore'
import { habitType } from '../../types/Types'
import HabitCard from './HabitCard'
import useColorStore from '../../store/ColorStore'

const HabitToComplete = () => {

    const currentHabits = useHabitStore(state => state.habits)

    const periodTypes = ['daily', 'weekly', 'monthly']
    const [timePeriod, setTimePeriod] = useState('daily')
    const [todayHabits, setTodayHabits] = useState<habitType[]>([])

    const currentTheme = useColorStore(state => state.currentTheme)
    const primaryColors = useColorStore(state => state.primaryColors)

    const getTodayHabits = (timePeriod: string) => {
        const sortedHabits = currentHabits.filter((habit) => habit.habitStatus === 'current' && habit.repeat.type === timePeriod)
        setTodayHabits(sortedHabits)
    }

    useEffect(() => {
        getTodayHabits(timePeriod)
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

            {todayHabits.length > 0 ? (
                <FlatList
                    data={todayHabits}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <HabitCard habit={item} />
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

export default HabitToComplete