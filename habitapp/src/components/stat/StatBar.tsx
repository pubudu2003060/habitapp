import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import useColorStore from '../../store/ColorStore'
import Icon from 'react-native-vector-icons/FontAwesome'
import { format, isAfter, startOfMonth, startOfWeek } from 'date-fns'
import { statBarType, statType } from '../../types/Types'

const StatBar = ({ selectedPeriod, setSelectedPeriod, stats, currentDate, setCurrentDate }: statBarType) => {

    const currentTheme = useColorStore(state => state.currentTheme)
    const primaryColors = useColorStore(state => state.primaryColors)

    const periodTypes = ['Day', 'Week', 'Month']

    const navigatePeriod = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate)
        const today = new Date()

        if (selectedPeriod === 'Day') {
            direction === 'prev' ? newDate.setDate(newDate.getDate() - 1) : newDate.setDate(newDate.getDate() + 1)
        } else if (selectedPeriod === 'Week') {
            direction === 'prev' ? newDate.setDate(newDate.getDate() - 7) : newDate.setDate(newDate.getDate() + 7)
        } else {
            direction === 'prev' ? newDate.setMonth(newDate.getMonth() - 1) : newDate.setMonth(newDate.getMonth() + 1)
        }

        if (direction === 'next') {
            if (selectedPeriod === 'Day' && isAfter(newDate, today)) {
                return
            } else if (selectedPeriod === 'Week' && isAfter(startOfWeek(newDate, { weekStartsOn: 1 }), today)) {
                return
            } else if (selectedPeriod === 'Month' && isAfter(startOfMonth(newDate), today)) {
                return
            }
        }
        setCurrentDate(newDate)
    }

    const canNavigateNext = () => {
        const today = new Date()
        const testDate = new Date(currentDate)

        if (selectedPeriod === 'Day') {
            testDate.setDate(testDate.getDate() + 1)
            return !isAfter(testDate, today)
        } else if (selectedPeriod === 'Week') {
            testDate.setDate(testDate.getDate() + 7)
            return !isAfter(startOfWeek(testDate, { weekStartsOn: 1 }), today)
        } else {
            testDate.setMonth(testDate.getMonth() + 1)
            return !isAfter(startOfMonth(testDate), today)
        }
    }

    return (
        <>
            <View style={styles.tabContainer}>
                {periodTypes.map((period) => (
                    <TouchableOpacity
                        key={period}
                        onPress={() => setSelectedPeriod(period as any)}
                        style={[
                            styles.tabButton,
                            {
                                backgroundColor: selectedPeriod === period ? primaryColors.Primary : primaryColors.Error,
                            }
                        ]}
                    >
                        <Text style={[
                            styles.tabText,
                            {
                                color: selectedPeriod === period ? currentTheme.ButtonText : currentTheme.ButtonText
                            }
                        ]}>
                            {period}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.dateNavigation}>
                <TouchableOpacity onPress={() => navigatePeriod('prev')}>
                    <Icon name="chevron-left" size={20} color={currentTheme.PrimaryText} />
                </TouchableOpacity>
                <Text style={[styles.dateText, { color: currentTheme.PrimaryText }]}>
                    {stats.currentPeriodText}
                </Text>
                <TouchableOpacity
                    onPress={() => navigatePeriod('next')}
                    disabled={!canNavigateNext()}
                    style={{ opacity: canNavigateNext() ? 1 : 0.3 }}
                >
                    <Icon name="chevron-right" size={20} color={currentTheme.PrimaryText} />
                </TouchableOpacity>
            </View>

            <View style={[styles.statsCard, { backgroundColor: currentTheme.Card }]}>
                <Text style={[styles.completionRate, { color: currentTheme.PrimaryText }]}>
                    {stats.completedHabits}
                </Text>
                <Text style={[styles.completionLabel, { color: currentTheme.SecondoryText }]}>
                    Total Completions
                </Text>
                <View style={styles.chartContainer}>
                    {stats.chartData.map((item, index) => {
                        const maxHeight = 100
                        const barHeight = stats.maxChartValue > 0 ? (item.completed / stats.maxChartValue) * maxHeight : 0

                        return (
                            <View key={index} style={styles.chartBar}>
                                <View style={[
                                    styles.bar,
                                    {
                                        height: Math.max(barHeight, 4),
                                        backgroundColor: item.completed > 0 ?
                                            (barHeight >= 75 ? primaryColors.Primary :
                                                barHeight >= 50 ? primaryColors.Accent :
                                                    barHeight >= 25 ? '#FFC107' : primaryColors.Error) :
                                            currentTheme.SecondoryText + '30'
                                    }
                                ]} />
                                <Text style={[styles.chartLabel, { color: currentTheme.SecondoryText }]}>
                                    {selectedPeriod === 'Day'
                                        ? format(item.date, 'HH')
                                        : selectedPeriod === 'Week'
                                            ? format(item.date, 'EEE')[0]
                                            : format(item.date, 'dd')}
                                </Text>
                            </View>
                        )
                    })}
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'transparent',
        borderRadius: 12,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 2,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    dateNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
    },
    statsCard: {
        marginHorizontal: 20,
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    completionRate: {
        fontSize: 48,
        fontWeight: '700',
        marginBottom: 4,
    },
    completionLabel: {
        fontSize: 16,
        marginBottom: 30,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        width: '100%',
        height: 120,
        paddingHorizontal: 10,
    },
    chartBar: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 2,
    },
    bar: {
        width: '80%',
        minHeight: 4,
        borderRadius: 2,
        marginBottom: 8,
    },
    chartLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
})

export default StatBar