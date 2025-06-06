import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signInInputType, userType } from '../types/Types'
import { useUserStore } from '../store/UserStore'
import useColorStore from '../store/ColorStore'
import CustomAlert from '../components/alert/CustomAlert'
import useCustomAlert from '../components/alert/UseCustomAlert'


const SignIn = ({ navigation }: any) => {
    const currentTheme = useColorStore(state => state.currentTheme);
    const primaryColors = useColorStore(state => state.primaryColors);

    const { alertConfig, showAlert, hideAlert } = useCustomAlert();

    const [signInInput, setSignInInput] = useState<signInInputType>({
        email: "",
        password: ""
    });

    const signInwithFirestore = useUserStore(state => state.signInUser)

    const signIn = async () => {
        try {
            const { email, password } = signInInput;

            if (!email.trim() || !password.trim()) {
                return showAlert(
                    "Missing Fields",
                    "Please enter both email and password."
                );
            }
            await signInwithFirestore(signInInput)
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                showAlert("SignIn Error", 'No user found with this email');
            }
            else if (error.code === 'auth/invalid-email') {
                showAlert("SignIn Error", 'Enter a valid Email');
            }
            else if (error.code === 'auth/invalid-credential') {
                showAlert("SignIn Error", 'Enter correct Email and Password');
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
                    <Text style={[styles.title, { color: currentTheme.PrimaryText }]}>Sign In</Text>
                    <Text style={[styles.subtitle, { color: currentTheme.SecondoryText }]}>Welcome back to HabitApp</Text>
                </View>
                <View style={styles.formContainer}>
                    <TextInput
                        style={[styles.input, {
                            borderColor: currentTheme.Border,
                            backgroundColor: currentTheme.Card,
                            color: currentTheme.PrimaryText
                        }]}
                        value={signInInput.email}
                        placeholder="Enter Email"
                        placeholderTextColor={currentTheme.SecondoryText}
                        autoCapitalize="none"
                        onChangeText={(text) => setSignInInput(prev => ({ ...prev, email: text.trim() }))}
                    />
                    <TextInput
                        style={[styles.input, {
                            borderColor: currentTheme.Border,
                            backgroundColor: currentTheme.Card,
                            color: currentTheme.PrimaryText
                        }]}
                        value={signInInput.password}
                        placeholder="Enter Password"
                        placeholderTextColor={currentTheme.SecondoryText}
                        secureTextEntry
                        onChangeText={(text) => setSignInInput(prev => ({ ...prev, password: text.trim() }))}
                    />
                </View>
                <View style={styles.signUpTextContainer}>
                    <Text style={{ color: currentTheme.SecondoryText }}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                        <Text style={{ color: primaryColors.Primary, fontWeight: '600' }}>Sign up</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.signInButton, { backgroundColor: primaryColors.Primary }]}
                        onPress={signIn}
                    >
                        <Text style={[styles.buttonText, { color: currentTheme.ButtonText }]}>Sign In</Text>
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
    signUpTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    buttonContainer: {
        marginVertical: 8,
    },
    signInButton: {
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

export default SignIn;