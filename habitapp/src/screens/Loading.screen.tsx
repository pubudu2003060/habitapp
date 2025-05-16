import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native';
import useColorStore from '../store/ColorStore';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const Loading = ({ navigation }: any) => {
  const currentTheme = useColorStore(state => state.currentTheme);
  const primaryColors = useColorStore(state => state.primaryColors);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        navigation.replace('SignIn');
      }, 3000);

      return () => clearTimeout(timer);
    }, [])
  );


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.Background }]}>
      <View style={styles.contentContainer}>
        <View style={styles.animationContainer}>
          <LottieView
            style={styles.animation}
            source={require('../assets/animations/loading.json')}
            autoPlay
            loop
          />
        </View>

        <View style={styles.textWrapper}>
          <Text style={[styles.loadingText, { color: primaryColors.Primary }]}>
            Habit<Text style={{ color: currentTheme.PrimaryText }}>Tracker</Text>
          </Text>
          <Text style={[styles.tagline, { color: currentTheme.SecondoryText }]}>
            Building better habits, one day at a time
          </Text>
        </View>

        <View style={styles.loadingWrapper}>
          <Text style={[styles.loadingIndicator, { color: currentTheme.SecondoryText }]}>
            loading<Text style={styles.dots}>...</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationContainer: {
    marginBottom: 30,
  },
  animation: {
    width: 240,
    height: 240,
    alignSelf: 'center',
  },
  textWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
  },
  loadingWrapper: {
    position: 'absolute',
    bottom: -100,
  },
  loadingIndicator: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  dots: {
    fontWeight: '900',
  }
});

export default Loading