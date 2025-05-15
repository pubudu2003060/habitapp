import React, { useEffect } from 'react'
import { View, Text, FlatList } from 'react-native'
import { useUserStore } from '../../store/UserStore'
import { useHabitStore } from '../../store/HabitsStore'
import { habitType } from '../../types/Types'

const getTodayHabits = (habits:habitType[]) => {
    const today = new Date().getDay(); 

    return habits.filter((habit:habitType) => {
        if (habit.repeat.type === 'daily') return true;
        if (habit.repeat.type === 'weekly') return true;
        return false;
    });
}

const HabitToComplete = () => {

    const habits = useHabitStore(state => state.habits)

    const todayHabits = getTodayHabits(habits);

    if (todayHabits.length === 0) {
        return (
            <View style={{ padding: 20 }}>
                <Text>No habits to complete today 🚀</Text>
            </View>
        );
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Today's Habits</Text>
            <FlatList
                data={todayHabits}
                keyExtractor={(item,i) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: 16 }}>{item.name}</Text>
                        <Text style={{ fontSize: 16 }}>{item.repeat.type}</Text>
                    </View>
                )}
            />
        </View>
    )
}

export default HabitToComplete
