import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useUserStore } from '../store/UserStore';
import Stack from './Stack';
import Tabs from './BottmBar';
import { useHabitStore } from '../store/HabitsStore';
import { useCompletedTasksStore } from '../store/CompletedTaskStore';

const Navigation = () => {

    const user = useUserStore(state => state.user);
    const loadUser = useUserStore(state => state.loadUser);
    const loadHabits = useHabitStore(state => state.loadHabits)
    const loadCompletedTasks = useCompletedTasksStore(state => state.loadCompletedTasks)

    useEffect(() => {
        if (user?.id) {
            loadCompletedTasks(user?.id)
        }
    }, [user])

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (user) {
            loadHabits(user.id);
        }
    }, [user]);


    return (
        <NavigationContainer>
            {user === null ? <Stack /> : <Tabs />}
        </NavigationContainer>
    );
};

export default Navigation;
