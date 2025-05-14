import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useUserStore } from '../store/UserStore';
import Stack from './Stack';
import Tabs from './BottmBar';
import { useHabitStore } from '../store/HabitsStore';

const Navigation = () => {
    const user = useUserStore(state => state.user);
    const loadUser = useUserStore(state => state.loadUser);
    const loadHabits = useHabitStore(state => state.loadHabits)

    useEffect(() => {
        loadUser();
        if (user) {
            loadHabits(user.id);
        }
    }, []);

    return (
        <NavigationContainer>
            {user === null ? <Stack /> : <Tabs />}
        </NavigationContainer>
    );
};

export default Navigation;
