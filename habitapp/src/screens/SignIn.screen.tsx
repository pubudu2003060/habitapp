import React, { useEffect, useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signInInputType } from '../types/Types'

const SignIn = ({}) => {

    const [signInInput, setSignInInput] = useState<signInInputType>({
        email: "",
        password: ""
    })

    return (
        <SafeAreaView>
            <View>
                <Text>SignIn</Text>
                <Text>welcome to HabitApp</Text>
                <View>
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
                <Text>I already have an account</Text>
                <Button title='Sign In' onPress={() => {}}></Button>
            </View>
        </SafeAreaView>
    )
}

export default SignIn
