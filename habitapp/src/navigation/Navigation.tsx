import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useUserStore } from '../store/UserStore';
import Stack from './Stack';
import Tabs from './BottmBar';
import { useHabitStore } from '../store/HabitsStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isTimeToReset = (period: string, lastReset: Date): boolean => {
    const now = new Date();

    if (period === 'daily') {
        return (
            now.toDateString() !== lastReset.toDateString() &&
            now.getHours() >= 12
        );
    } else if (period === 'weekly') {
        const lastWeek = new Date(lastReset);
        lastWeek.setDate(lastWeek.getDate() - lastWeek.getDay());
        const thisWeek = new Date(now);
        thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
        return thisWeek > lastWeek;
    } else if (period === 'monthly') {
        return (
            now.getMonth() !== lastReset.getMonth() ||
            now.getFullYear() !== lastReset.getFullYear()
        );
    }

    return false;
};

const Navigation = () => {
    const user = useUserStore(state => state.user);
    const loadUser = useUserStore(state => state.loadUser);
    const loadHabits = useHabitStore(state => state.loadHabits)
    const resetCompletionHabits = useHabitStore(state => state.resetCompletionHabits)

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (user) {
            loadHabits(user.id);
        }
    }, [user]);

    useEffect(() => {
        const reset = async () => {
            const lastResetData = await AsyncStorage.getItem("@lastReset");
            const lastReset = lastResetData ? JSON.parse(lastResetData) : {};
            const checkAndReset = async (period: 'daily' | 'weekly' | 'monthly') => {
                const last = lastReset[period] ? new Date(lastReset[period]) : new Date(0);
                if (isTimeToReset(period, last)) {
                    await resetCompletionHabits(period);
                }
            };
            await Promise.all([
                checkAndReset('daily'),
                checkAndReset('weekly'),
                checkAndReset('monthly'),
            ]);
        }
        reset()
    }, [])

    return (
        <NavigationContainer>
            {user === null ? <Stack /> : <Tabs />}
        </NavigationContainer>
    );
};

export default Navigation;
