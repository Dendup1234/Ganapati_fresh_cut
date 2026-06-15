import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
} from "react-native";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");

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

                    <Text style={styles.title}>Forgot{"\n"}Password?</Text>
                    <Text style={styles.subtitle}>
                        Enter your email address and we will send you a verification code.
                    </Text>

                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        placeholderTextColor="#9aa3b2"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={styles.input}
                    />

                    <Pressable
                        style={styles.primaryButton}
                        onPress={() => router.push("/reset-otp")}
                    >
                        <Text style={styles.primaryText}>Send Code</Text>
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
    input: {
        height: 52,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: "#edf0f4",
        backgroundColor: "#f7f8fa",
        paddingHorizontal: 18,
        color: "#111827",
        fontSize: 13,
        marginBottom: 24,
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
