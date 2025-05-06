import React, { useState } from 'react'
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signInInputType, userType } from '../types/Types'
import { useuserStore } from '../store/UserStore'

const SignUp = ({ navigation }: any) => {

    const [signInInput, setSignInInput] = useState<signInInputType>({
        email: "",
        password: ""
    })

    const setUser = useuserStore(state => state.setUser)

        const signUp = () => {
            const newuser:userType = {
                id:0,
                email:signInInput.email,
                password:signInInput.password,
                name:""
            }
            setUser(newuser)
        }

    return (
        <SafeAreaView>
            <View>
                <Text>SignUp</Text>
                <Text>welcome to HabitApp</Text>
                <View>
                <TextInput
                        value={signInInput.email}
                        placeholder="Enter Name"
                        onChangeText={(text) => setSignInInput(prev => ({ ...prev, email: text }))}
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
                <Text>I donot have an </Text><TouchableOpacity onPress={() => { }}><Text>account</Text></TouchableOpacity>
                <Button title='Sign In' onPress={signUp}></Button>
            </View>
        </SafeAreaView>
    )
}

export default SignUp
