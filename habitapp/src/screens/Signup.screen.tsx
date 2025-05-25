import React, { useState } from 'react';
import {  Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signUpInputType } from '../types/Types';
import useColorStore from '../store/ColorStore';
import { useUserStore } from '../store/UserStore';
import CustomAlert from '../components/alert/CustomAlert'
import useCustomAlert from '../components/alert/UseCustomAlert'

const SignUp = ({ navigation }: any) => {
    const currentTheme = useColorStore(state => state.currentTheme);
    const primaryColors = useColorStore(state => state.primaryColors);

     const { alertConfig, showAlert, hideAlert } = useCustomAlert();

    const [signUpInput, setSignUpInput] = useState<signUpInputType>({
        name: "",
        email: "",
        password: ""
    });

    const signUpwithFireStore = useUserStore(state => state.signUpUser)

    const signUp = async () => {
        try {
            const { name, email, password } = signUpInput;
            if (!name.trim() || !email.trim() || !password.trim()) {
                return showAlert("Missing fields", "Please fill in all fields");
            }
            await signUpwithFireStore(signUpInput)
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                showAlert("SignUp Error", "This email is already in use.");
            } else if (error.code === 'auth/weak-password') {
                showAlert("SignUp Error", "Password should be at least 6 characters.");
            }
            else if (error.code === 'auth/invalid-email') {
               showAlert("SignUp Error", 'Enter a valid Email');
            }
            else {
               showAlert("SignUp Error", error.message || "Something went wrong.");
            }
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.Background }]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: currentTheme.PrimaryText }]}>Sign Up</Text>
                    <Text style={[styles.subtitle, { color: currentTheme.SecondoryText }]}>Welcome to HabitApp</Text>
                </View>
                <View style={styles.formContainer}>
                    <TextInput
                        style={[styles.input, {
                            borderColor: currentTheme.Border,
                            backgroundColor: currentTheme.Card,
                            color: currentTheme.PrimaryText
                        }]}
                        value={signUpInput.name}
                        placeholder="Enter Name"
                        placeholderTextColor={currentTheme.SecondoryText}
                        onChangeText={(text) => setSignUpInput(prev => ({ ...prev, name: text.trim() }))}
                    />
                    <TextInput
                        style={[styles.input, {
                            borderColor: currentTheme.Border,
                            backgroundColor: currentTheme.Card,
                            color: currentTheme.PrimaryText
                        }]}
                        value={signUpInput.email}
                        placeholder="Enter Email"
                        placeholderTextColor={currentTheme.SecondoryText}
                        autoCapitalize="none"
                        onChangeText={(text) => setSignUpInput(prev => ({ ...prev, email: text.trim() }))}
                    />
                    <TextInput
                        style={[styles.input, {
                            borderColor: currentTheme.Border,
                            backgroundColor: currentTheme.Card,
                            color: currentTheme.PrimaryText
                        }]}
                        value={signUpInput.password}
                        placeholder="Enter Password"
                        placeholderTextColor={currentTheme.SecondoryText}
                        secureTextEntry
                        onChangeText={(text) => setSignUpInput(prev => ({ ...prev, password: text.trim() }))}
                    />
                </View>
                <View style={styles.loginTextContainer}>
                    <Text style={{ color: currentTheme.SecondoryText }}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Text style={{ color: primaryColors.Primary, fontWeight: '600' }}>Login</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.signUpButton, { backgroundColor: primaryColors.Primary }]}
                        onPress={signUp}
                    >
                        <Text style={[styles.buttonText, { color: currentTheme.ButtonText }]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
             <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={hideAlert}
      />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 36,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
    },
    formContainer: {
        marginBottom: 24,
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    loginTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    buttonContainer: {
        marginVertical: 8,
    },
    signUpButton: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    }
});

export default SignUp;
