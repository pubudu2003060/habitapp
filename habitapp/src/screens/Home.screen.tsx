import React, { createContext, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import ShortStatus from '../components/home/ShortStatus';
import useColorStore from '../store/ColorStore';
import HabitToComplete from '../components/home/HabitToComplete';
import CompletionModel from '../components/home/CompletionModel';
import { habitType, ModelContextType } from '../types/Types';

export const modelContext = createContext<ModelContextType | undefined>(undefined)

const Home = () => {

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalHabit, setModalHabit] = useState<habitType>();

  const currentTheme = useColorStore(state => state.currentTheme);

  return (
    <modelContext.Provider value={{ modalVisible, setModalVisible, modalHabit, setModalHabit }}>
      <SafeAreaView style={{ backgroundColor: currentTheme.Background, flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ShortStatus />
          <HabitToComplete />
        </ScrollView>
        {modalHabit && (
          <CompletionModel modalVisible={modalVisible} setModalVisible={setModalVisible} habit={modalHabit} />
        )}
      </SafeAreaView>
    </modelContext.Provider >
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
  }
})

export default Home
