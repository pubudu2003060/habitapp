import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { useUserStore } from '../../store/UserStore'
import PagerView from 'react-native-pager-view';
import { addDays, eachDayOfInterval, eachWeekOfInterval, format, subDays } from 'date-fns';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import useColorStore from '../../store/ColorStore';

const ShortStatus = ({ displayedDay, setDisplayedDay }: { displayedDay: Date, setDisplayedDay: React.Dispatch<React.SetStateAction<Date>> }) => {
  const user = useUserStore(state => state.user)
  const [today] = useState(new Date())
  const currentTheme = useColorStore(state => state.currentTheme);
  const primaryColors = useColorStore(state => state.primaryColors);

  const dates = eachWeekOfInterval(
    {
      start: subDays(new Date(), 7),
      end: addDays(new Date(), 7)
    },
    {
      weekStartsOn: 1
    }
  ).reduce((acc: Date[][], cur) => {
    const alldays = eachDayOfInterval({
      start: cur,
      end: addDays(cur, 6)
    })

    acc.push(alldays)

    return acc;
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.dateText, { color: currentTheme.SecondoryText }]}>
          {today.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <Text style={[styles.welcomeText, { color: primaryColors.Info }]}>Hi, {user?.name}</Text>
      </View>

      <PagerView style={styles.pagerView} initialPage={2} >
        {
          dates.map((week, i) => {
            return (
              <View key={i} style={styles.daysRow}>
                {week.map((day, index) => {
                  const txt = format(day, 'EEEEE')
                  const isToday = day.getDate() === displayedDay.getDate() &&
                    day.getMonth() === displayedDay.getMonth() &&
                    day.getFullYear() === displayedDay.getFullYear();

                  return (
                    <TouchableOpacity key={index}
                      style={[
                        styles.dayContainer,
                        isToday && { backgroundColor: primaryColors.Primary, borderRadius: 20 }
                      ]}

                      onPress={() => { setDisplayedDay(day) }}
                    >
                      <Text style={[
                        styles.dayText,
                        { color: isToday ? currentTheme.ButtonText : currentTheme.PrimaryText }
                      ]}>
                        {txt}
                      </Text>
                      <Text style={[
                        styles.dateNumber,
                        { color: isToday ? currentTheme.ButtonText : currentTheme.PrimaryText }
                      ]}>
                        {day.getDate()}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )
          })
        }
      </PagerView>

      <View style={[styles.statsContainer, { backgroundColor: currentTheme.Card }]}>
        <AnimatedCircularProgress
          size={120}
          width={15}
          fill={60}
          rotation={0}
          tintColor={primaryColors.Primary}
          onAnimationComplete={() => console.log('onAnimationComplete')}
          backgroundColor={currentTheme.Border} >
          {(fill: any) => (
            <Text style={[styles.progressText, { color: currentTheme.PrimaryText }]}>
              {Math.round(fill)}%
            </Text>
          )}
        </AnimatedCircularProgress>
        <View style={styles.statsTextContainer}>
          <Text style={[styles.statsTitle, { color: currentTheme.PrimaryText }]}>Daily Habits</Text>
          <Text style={[styles.statsSubtitle, { color: primaryColors.Accent }]}>Almost there! Goals in reach!</Text>
          <Text style={[styles.statsProgress, { color: currentTheme.SecondoryText }]}>3/7 of habit complete</Text>
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    height: 350,
  },
  headerContainer: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 16,
  },
  pagerView: {
    flex: 1,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dayContainer: {
    width: 40,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  statsProgress: {
    fontSize: 14,
  },
   progressText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ShortStatus