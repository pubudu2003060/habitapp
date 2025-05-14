import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { DayOfWeek, habitType } from '../../types/Types'
import useColorStore from '../../store/ColorStore'

const Repeat = ({ habit, setHabit }: { habit: habitType, setHabit: React.Dispatch<React.SetStateAction<habitType>> }) => {

    const currentTheme = useColorStore(state => state.currentTheme);
    const primaryColors = useColorStore(state => state.primaryColors);

    const allDays: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const shortDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    const togalDay = (day: DayOfWeek) => {
        setHabit(h => {
            const days = h.repeat.type === "daily" ? h.repeat.days : [];
            const updatedDays = days.includes(day)
                ? days.filter(d => d !== day)
                : [...days, day];
            return {
                ...h,
                repeat: { type: "daily", days: updatedDays }
            };
        });
    }

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.Card }]}>
            <Text style={[styles.title, { color: currentTheme.PrimaryText }]}>Repeat</Text>

            <View style={styles.buttonContainer}>
                {['daily', 'weekly', 'monthly'].map((type, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.customButton,
                            {
                                backgroundColor: habit.repeat.type === type ? primaryColors.Primary : primaryColors.Error
                            }
                        ]}
                        onPress={() => {
                            if (type === 'daily') {
                                setHabit(h => ({ ...h, repeat: { type: "daily", days: allDays } }));
                            } else {
                                setHabit(h => ({ ...h, repeat: { type: type as any } }));
                            }
                        }}
                    >
                        <Text style={[styles.buttonText,{color:currentTheme.ButtonText}]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.daysContainer}>
                {shortDays.map((day, index) => {
                    const disabled = habit.repeat.type !== "daily";
                    const fullDay: DayOfWeek = allDays[index];
                    const isSelected = habit.repeat.type === "daily" && habit.repeat.days.includes(fullDay);
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dayWrapper,
                                {
                                    backgroundColor: isSelected ? primaryColors.Primary : primaryColors.Error,
                                    opacity: disabled ? 0.4 : 1,
                                }
                            ]}
                            onPress={() => { if (!disabled) togalDay(fullDay); }}
                            disabled={disabled}
                        >
                            <Text style={[styles.dayText,{color:currentTheme.ButtonText}]}>{day}</Text>
                        </TouchableOpacity>
                    )
                })}
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
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    customButton: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: '600',
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontWeight: '600',
    }
});

export default Repeat
