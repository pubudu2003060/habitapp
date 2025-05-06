import React, { useState } from 'react'
import { Alert, Button, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signInInputType, signUpInputType, userType } from '../types/Types'
import { useuserStore } from '../store/UserStore'
import useUsersStore from '../store/UsersStore'

const SignUp = ({ navigation }: any) => {

    const [signInInput, setSignInInput] = useState<signUpInputType>({
        name:"",
        email: "",
        password: ""
    })

    const setUser = useuserStore(state => state.setUser)
    const isInUsers = useUsersStore(state => state.isInUsers)

    const signUp = () => {
        if (signInInput.email.trim() === "" || signInInput.password.trim() === "" || signInInput.name.trim() === "") {
            Alert.alert(
                "Please add email and password and name",
                "without email and password and name you cant signup",
                [
                    {
                        text: "ok",
                        onPress: () => console.log("Sign up confirmed")
                    }
                ]
            )
        } else {
            const newuser: userType = {
                id: 0,
                email: signInInput.email,
                password: signInInput.password,
                name: signInInput.name
            }
            const isUserIn = isInUsers(newuser)
            if (!isUserIn) {
                setUser(newuser)
            }
        }


    }

    return (
        <SafeAreaView>
            <View>
                <Text>SignUp</Text>
                <Text>welcome to HabitApp</Text>
                <View>
                    <TextInput
                        value={signInInput.name}
                        placeholder="Enter Name"
                        onChangeText={(text) => setSignInInput(prev => ({ ...prev, name: text }))}
                    />
                    <TextInput
                        value={signInInput.email}
                        placeholder="Enter Email"
                        onChangeText={(text) => setSignInInput(prev => ({ ...prev, email: text }))}
                    />
                    <TextInput
                        value={signInInput.password}
                        placeholder="Enter Password"
                        onChangeText={(text) => setSignInInput(prev => ({ ...prev, password: text }))}
                    />
                </View>
                <Text>I already have an </Text><TouchableOpacity onPress={() => { navigation.goBack() }}><Text>account</Text></TouchableOpacity>
                <Button title='Sign Up' onPress={signUp}></Button>
            </View>
        </SafeAreaView>
    )
}

export default SignUp
