import { Text, View, StyleSheet } from 'react-native'
import { completedTaskType } from '../../types/Types'
import useColorStore from '../../store/ColorStore'
import Icon from 'react-native-vector-icons/FontAwesome';

const CompletedHabitCard = ({ habit }: { habit: completedTaskType }) => {

    const currentTheme = useColorStore(state => state.currentTheme)
    const primaryColors = useColorStore(state => state.primaryColors)

    const getRepeatText = () => {
        if (habit?.repeat.type === 'daily') {
            return `${habit.repeat.days.length} days per week`
        } else if (habit?.repeat.type === 'weekly') {
            if (habit.goal?.type === 'units') {
                return `${habit.goal.amount} ${habit.goal.amount > 1 ? 'times' : 'time'} per week`
            } else if (habit.goal?.type === 'timer') {
                const hours = habit.goal.timePeriod.hours
                const minutes = habit.goal.timePeriod.minutes
                if (hours > 0) {
                    return `${hours}h ${minutes}m per week`
                } else {
                    return `${minutes} minutes per week`
                }
            }
            return 'Weekly'
        } else {
            if (habit?.goal?.type === 'units') {
                return `${habit.goal.amount} ${habit.goal.amount > 1 ? 'times' : 'time'} per month`
            } else if (habit?.goal?.type === 'timer') {
                const hours = habit.goal.timePeriod.hours
                const minutes = habit.goal.timePeriod.minutes
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
                    <Icon name='image' size={26} color={currentTheme.PrimaryText} />
                </View>
                <View style={styles.habitInfo}>
                    <Text style={[styles.habitName, { color: currentTheme.PrimaryText }]}>
                        {habit?.name}
                    </Text>
                    <Text style={[styles.habitDescription, { color: currentTheme.SecondoryText }]} numberOfLines={2}>
                        {habit?.description}
                    </Text>
                    <Text style={[styles.repeatInfo, { color: primaryColors.Accent }]}>
                        {getRepeatText()}
                    </Text>
                </View>
            </View>
            <View style={styles.actionsContainer}>
                {habit?.goal?.type === 'units' && (
                    <View style={styles.unitContainer}>
                        <Text style={[styles.unitText, { color: currentTheme.PrimaryText }]}>
                            {habit.progress?.type === 'units' ? habit.progress.completedAmount : 0}/{habit.goal.amount}
                        </Text>
                    </View>
                )}
                {habit?.goal?.type === 'timer' && (
                    <View style={styles.timerContainer}>
                        <Text style={[styles.timerText, { color: currentTheme.PrimaryText }]}>

                            {habit.progress?.type === 'timer' ? habit.progress.completedTimePeriod.hours + "h " + habit.progress.completedTimePeriod.minutes + 'm' : 0}/{habit.goal.timePeriod.hours}h {habit.goal.timePeriod.minutes}m

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
        marginBottom: 22,
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

export default CompletedHabitCard