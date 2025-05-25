import React, { use, useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { useCompletedTasksStore } from '../../store/CompletedTaskStore'
import { completedTaskType } from '../../types/Types'
import useColorStore from '../../store/ColorStore'
import LottieView from 'lottie-react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import CompletedHabitCard from './CompletedHabitCard'

const CompletedHabit = ({ day }: { day: Date }) => {

    const [loading, setLoading] = useState(true)

    const getCompletedTasksByDate = useCompletedTasksStore(state => state.getCompletedTasksByDate)
    
    const [completedTasks, setCompletedTasks] = useState<completedTaskType[]>([])

    const currentTheme = useColorStore(state => state.currentTheme)
    const isDark = useColorStore(state => state.isDark)

    useEffect(() => {
        setLoading(true)
        const timeout = setTimeout(() => {
            const completedTasksForDay = getCompletedTasksByDate(day)
            setCompletedTasks(completedTasksForDay)
            setLoading(false)
        }, 500)
        return () => clearTimeout(timeout)
    }, [day, getCompletedTasksByDate])

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: currentTheme.PrimaryText }]}>Completed Tasks</Text>
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
                : completedTasks.length > 0 ? completedTasks.map((task) => (
                    <CompletedHabitCard 
                        key={task.id.toString()} 
                        habit={task} 
                    />
                )) : (
                    <View style={styles.emptyContainer}>
                        <View style={[styles.emptyStateCard, { backgroundColor: currentTheme.Card }]}>
                            <Icon name="calendar-o" size={48} color={currentTheme.SecondoryText} />
                            <Text style={[styles.emptyStateTitle, { color: currentTheme.PrimaryText }]}>
                                No tasks completed on this day.
                            </Text>
                            <Text style={[styles.emptyStateText, { color: currentTheme.SecondoryText }]}>
                                Keep up the good work and complete some tasks!
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

export default CompletedHabit