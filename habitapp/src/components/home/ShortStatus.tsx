import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { useUserStore } from '../../store/UserStore'
import PagerView from 'react-native-pager-view';
import { addDays, eachDayOfInterval, eachWeekOfInterval, format, subDays } from 'date-fns';

const ShortStatus = () => {
  const user = useUserStore(state => state.user)
  const [today] = useState(new Date())


  const dates = eachWeekOfInterval(
    {
      start: subDays(new Date(), 14),
      end: addDays(new Date(), 14)
    },
    {
      weekStartsOn:1
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
    <View style={{ height: 100 }}>
      <View >
        <Text >
          {today.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <Text >Hi, {user?.name}</Text>
      </View>

      <PagerView style={styles.pagerView} initialPage={0}>
        {
          dates.map((week, i) => {
            return (
              <View key={i}>
                <View style={{ flexDirection: "row",justifyContent:"space-around" ,alignItems:"center"}}>
                  {week.map((day) => {
                    const txt = format(day, 'EEEEE')
                    return (
                      <View>
                        <Text>{txt}</Text>
                         <Text>{day.getDate()}</Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            )
          })
        }
      </PagerView>

    </View>
  )
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

export default ShortStatus
