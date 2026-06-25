import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
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

const DUMMY_EMAIL = "test@example.com";
const DUMMY_PASSWORD = "password123";
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";
const REGISTER_PROMPT = "Don't have an account? ";
const googleIcon = require("../assets/images/icons8-google-48.png");

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [securePassword, setSecurePassword] = useState(true);

    const handleLogin = () => {
        if (
            email.trim().toLowerCase() === ADMIN_EMAIL &&
            password === ADMIN_PASSWORD
        ) {
            router.replace("/admin-home");
            return;
        }

        if (
            email.trim().toLowerCase() === DUMMY_EMAIL &&
            password === DUMMY_PASSWORD
        ) {
            router.replace("/home");
            return;
        }

        Alert.alert(
            "Invalid login",
            "Use test@example.com/password123 or admin@example.com/admin123."
        );
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
                    <Text style={styles.title}>Welcome back! Glad to see you, Again!</Text>

                    <View style={styles.form}>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor="#9aa3b2"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                        />

                        <View style={styles.passwordWrap}>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter your password"
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
                    </View>

                    <Pressable
                        style={styles.forgotButton}
                        onPress={() => router.push("/forgot-password")}
                    >
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </Pressable>

                    <Pressable style={styles.primaryButton} onPress={handleLogin}>
                        <Text style={styles.primaryText}>Login</Text>
                    </Pressable>

                    <View style={styles.dividerRow}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>Or Login with</Text>
                        <View style={styles.divider} />
                    </View>

                    <Pressable style={styles.googleButton}>
                        <Image source={googleIcon} style={styles.googleIcon} />
                    </Pressable>

                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>{REGISTER_PROMPT}</Text>
                        <Pressable onPress={() => router.push("/register")}>
                            <Text style={styles.footerLink}>Register Now</Text>
                        </Pressable>
                    </View>
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
        paddingTop: 104,
        paddingBottom: 32,
    },
    title: {
        color: "#10131a",
        fontSize: 24,
        lineHeight: 30,
        fontWeight: "800",
        marginBottom: 30,
    },
    form: {
        gap: 20,
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
    forgotButton: {
        alignSelf: "center",
        marginTop: 18,
        marginBottom: 22,
    },
    forgotText: {
        color: "#6b7280",
        fontSize: 11,
        fontWeight: "500",
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
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 26,
        marginBottom: 18,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#edf0f4",
    },
    dividerText: {
        color: "#6b7280",
        fontSize: 11,
        marginHorizontal: 10,
    },
    googleButton: {
        width: 88,
        height: 52,
        borderWidth: 1,
        borderColor: "#e7eaf0",
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: "#ffffff",
    },
    googleIcon: {
        width: 24,
        height: 24,
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 28,
    },
    footerText: {
        color: "#111827",
        fontSize: 12,
    },
    footerLink: {
        color: "#2867c9",
        fontSize: 12,
        fontWeight: "700",
    },
});
