import React, { useEffect } from 'react'
import { ThemeProvider } from '../theme/ThemeProvider'
import { NavigationContainer } from '@react-navigation/native'
import { useuserStore } from '../store/UserStore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { userType } from '../types/Types'
import Stack from './Stack'
import Tabs from './BottmBar'

const Navigation = () => {

    const user = useuserStore(state => state.user)
    const setUser = useuserStore(state => state.setUser)

    useEffect(() => {
        const loadUsers = async () => {
            const userString = await AsyncStorage.getItem("@users")
            const userFromAsync: userType = userString ? JSON.parse(userString) : null
            setUser(userFromAsync)
        }
        loadUsers()
    }, [])


    return (
        <ThemeProvider>
            <NavigationContainer>
                {user === null ? <Stack></Stack> : <Tabs></Tabs>}
            </NavigationContainer>
        </ThemeProvider>
    )
}

export default Navigation
