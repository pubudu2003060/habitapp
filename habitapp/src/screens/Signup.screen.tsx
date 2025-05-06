import React, { useEffect } from 'react'
import { Text } from 'react-native'
import { useuserStore } from '../store/UserStore'
import AsyncStorage from '@react-native-async-storage/async-storage'



const Signup = () => {

    const { user } = useuserStore.getState()

    useEffect(() => {
        const loadUsers = () => {
            const userList = AsyncStorage.getItem("@users")
        }
        loadUsers()
    }, [user])

    return (
        <>
            <><Text>signup</Text></>
        </>
    )
}

export default Signup
