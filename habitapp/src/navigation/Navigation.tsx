import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useuserStore } from '../store/UserStore';
import Stack from './Stack';
import Tabs from './BottmBar';
import useUsersStore from '../store/UsersStore';

const Navigation = () => {
    const user = useuserStore(state => state.user);
    const loadUser = useuserStore(state => state.loadUser);
    const loadUsers = useUsersStore(state => state.loadUsers)

    useEffect(() => {
        loadUser();
        loadUsers()
    }, []);

    return (
        <NavigationContainer>
            {user === null ? <Stack /> : <Tabs />}
        </NavigationContainer>
    );
};

export default Navigation;
