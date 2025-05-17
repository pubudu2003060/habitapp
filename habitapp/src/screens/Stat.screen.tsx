import { addDays, eachDayOfInterval, eachWeekOfInterval, format, subDays } from 'date-fns'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import PagerView from 'react-native-pager-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import useColorStore from '../store/ColorStore'



const Stat = () => {

  const currentTheme = useColorStore(state => state.currentTheme);
  const primaryColors = useColorStore(state => state.primaryColors);

    const [displayedDay, setDisplayedDay] = useState(new Date())

  const dates = eachWeekOfInterval(
    {
      start: subDays(new Date(), 21),
      end: new Date()
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
    <SafeAreaView style={{flex:1}}>
      <PagerView style={styles.pagerView} initialPage={3} >
        {
          dates.map((week, i) => {
            return (
              <View key={i} style={styles.daysRow}>
                {week.map((day, index) => {
                  const txt = format(day, 'EEEEE')
                  const isToday = day.getDate() === displayedDay.getDate() &&
                    day.getMonth() === displayedDay.getMonth() &&
                    day.getFullYear() === displayedDay.getFullYear();

                  function setDisplayedDay(day: Date) {
                    throw new Error('Function not implemented.')
                  }

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
    </SafeAreaView>
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


export default Stat
