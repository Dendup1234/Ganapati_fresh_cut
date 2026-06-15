import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function ChangePasswordScreen() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [securePassword, setSecurePassword] = useState(true);
    const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

    const handleChangePassword = () => {
        if (!password || password !== confirmPassword) {
            Alert.alert("Password mismatch", "Please enter matching passwords.");
            return;
        }

        Alert.alert("Password changed", "You can now login with your new password.", [
            { text: "Login", onPress: () => router.replace("/login") },
        ]);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.keyboard}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={18} color="#111827" />
                    </Pressable>

                    <Text style={styles.title}>Create New{"\n"}Password</Text>
                    <Text style={styles.subtitle}>
                        Your new password must be different from your previous password.
                    </Text>

                    <View style={styles.form}>
                        <View style={styles.passwordWrap}>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="New password"
                                placeholderTextColor="#9aa3b2"
                                secureTextEntry={securePassword}
                                style={[styles.input, styles.passwordInput]}
                            />
                            <Pressable
                                style={styles.eyeButton}
                                onPress={() => setSecurePassword((value) => !value)}
                            >
                                <Ionicons
                                    name={securePassword ? "eye-off" : "eye"}
                                    size={17}
                                    color="#7b8494"
                                />
                            </Pressable>
                        </View>

                        <View style={styles.passwordWrap}>
                            <TextInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm new password"
                                placeholderTextColor="#9aa3b2"
                                secureTextEntry={secureConfirmPassword}
                                style={[styles.input, styles.passwordInput]}
                            />
                            <Pressable
                                style={styles.eyeButton}
                                onPress={() => setSecureConfirmPassword((value) => !value)}
                            >
                                <Ionicons
                                    name={secureConfirmPassword ? "eye-off" : "eye"}
                                    size={17}
                                    color="#7b8494"
                                />
                            </Pressable>
                        </View>
                    </View>

                    <Pressable style={styles.primaryButton} onPress={handleChangePassword}>
                        <Text style={styles.primaryText}>Reset Password</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    keyboard: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 28,
        paddingTop: 56,
        paddingBottom: 32,
    },
    backButton: {
        width: 34,
        height: 34,
        borderWidth: 1,
        borderColor: "#e5e9f0",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 28,
    },
    title: {
        color: "#10131a",
        fontSize: 28,
        lineHeight: 34,
        fontWeight: "800",
        marginBottom: 8,
    },
    subtitle: {
        color: "#8d96a6",
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 36,
    },
    form: {
        gap: 18,
        marginBottom: 24,
    },
    input: {
        height: 52,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: "#edf0f4",
        backgroundColor: "#f7f8fa",
        paddingHorizontal: 18,
        color: "#111827",
        fontSize: 13,
    },
    passwordWrap: {
        position: "relative",
    },
    passwordInput: {
        paddingRight: 48,
    },
    eyeButton: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 48,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryButton: {
        height: 52,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b73d9",
    },
    primaryText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "700",
    },
});
