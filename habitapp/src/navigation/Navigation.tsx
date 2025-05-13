import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useUserStore } from '../store/UserStore';
import Stack from './Stack';
import Tabs from './BottmBar';

const Navigation = () => {
    const user = useUserStore(state => state.user);
    const loadUser = useUserStore(state => state.loadUser);

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <NavigationContainer>
            {user === null ? <Stack /> : <Tabs />}
        </NavigationContainer>
    );
};

export default Navigation;
