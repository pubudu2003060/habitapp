import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PagerView from 'react-native-pager-view'
import { SafeAreaView } from 'react-native-safe-area-context'

const Explore = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PagerView style={styles.pagerView} initialPage={0}>
        <View key="1">
          <Text>First page</Text>
        </View>
        <View key="2">
          <Text>Second page</Text>
        </View>
        <View key="3">
          <Text>3 page</Text>
        </View>
        <View key="4">
          <Text>4 page</Text>
        </View>
      </PagerView>
    </SafeAreaView>


  )
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    height:300
  },
});

export default Explore
