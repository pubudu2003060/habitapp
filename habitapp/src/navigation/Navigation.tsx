import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useUserStore } from '../store/UserStore';
import Stack from './Stack';
import Tabs from './BottmBar';
import { useHabitStore } from '../store/HabitsStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lastDateType } from '../types/Types';
import { isFirstTime } from '../Services/HabitService';

export const isTimeToReset = (period: string, lastReset: Date): boolean => {
    const now = new Date();
    if (period === 'daily') {
        return (
            now.getFullYear() > lastReset.getFullYear() &&
            now.getMonth() > lastReset.getMonth() ||
            now.getDate() > lastReset.getDate()
        );
    } else if (period === 'weekly') {
        const toStartOfWeek = (date: Date): Date => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - d.getDay());
            return d;
        };
        const lastWeek = toStartOfWeek(new Date(lastReset));
        const thisWeek = toStartOfWeek(new Date(now));
        return thisWeek.getTime() > lastWeek.getTime();
    } else if (period === 'monthly') {
        return (
            now.getFullYear() > lastReset.getFullYear() ||
            now.getMonth() > lastReset.getMonth()
        );
    }
    return false;
};

const Navigation = () => {

    const user = useUserStore(state => state.user);
    const loadUser = useUserStore(state => state.loadUser);
    const loadHabits = useHabitStore(state => state.loadHabits)
    const resetCompletionHabits = useHabitStore(state => state.resetCompletionHabits)

    isFirstTime()

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
            const lastReset: lastDateType = lastResetData ? JSON.parse(lastResetData) : {};
            console.log(lastReset)
            const checkAndReset = async (period: 'daily' | 'weekly' | 'monthly') => {
                const last = lastReset[period] ? new Date(lastReset[period]) : new Date();
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
