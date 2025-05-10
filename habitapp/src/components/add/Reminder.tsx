import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { habitType } from '../../types/Types';
import useColorStore from '../../store/ColorStore';

const Reminder = ({ habit, setHabit }: { habit: habitType, setHabit: React.Dispatch<React.SetStateAction<habitType>> }) => {
    const currentTheme = useColorStore(state => state.currentTheme);
    const primaryColors = useColorStore(state => state.primaryColors);
    const isDark = useColorStore(state => state.isDark);

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.Card }]}>
            <Text style={[styles.title, { color: currentTheme.PrimaryText }]}>Reminder</Text>
            
            <View style={styles.timeDisplayContainer}>
                <Text style={[styles.timeText, { color: primaryColors.Primary }]}>
                    {habit.reminder.getHours().toString().padStart(2, '0')}:{habit.reminder.getMinutes().toString().padStart(2, '0')}
                </Text>
            </View>
            
            <View style={styles.pickerContainer}>
                <DatePicker
                    mode='time'
                    theme={isDark ? "dark" : "light"}
                    date={habit.reminder}
                    onDateChange={(date) => {
                        setHabit(h => {
                            const hours = date.getHours();
                            const minutes = date.getMinutes();
                            const newReminder = new Date(0, 0, 0, hours, minutes);
                            return { ...h, reminder: newReminder };
                        });
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 12,
        padding: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    timeDisplayContainer: {
        alignItems: 'center',
        borderRadius: 12,
    },
    timeText: {
        fontSize: 24,
        fontWeight: '700',
    },
    pickerContainer: {
        alignItems: 'center',
    },
});

export default Reminder