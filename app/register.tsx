import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

const googleIcon = require("../assets/images/icons8-google-48.png");

export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

                    <Text style={styles.title}>Hello! Register to get started</Text>

                    <View style={styles.form}>
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Username"
                            placeholderTextColor="#9aa3b2"
                            style={styles.input}
                        />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            placeholderTextColor="#9aa3b2"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                        />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            placeholderTextColor="#9aa3b2"
                            secureTextEntry
                            style={styles.input}
                        />
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm password"
                            placeholderTextColor="#9aa3b2"
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>

                    <Pressable
                        style={styles.primaryButton}
                        onPress={() => router.push("/otp")}
                    >
                        <Text style={styles.primaryText}>Register</Text>
                    </Pressable>

                    <View style={styles.dividerRow}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>Or Register with</Text>
                        <View style={styles.divider} />
                    </View>

                    <Pressable style={styles.googleButton}>
                        <Image source={googleIcon} style={styles.googleIcon} />
                    </Pressable>

                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Pressable onPress={() => router.replace("/login")}>
                            <Text style={styles.footerLink}>Login Now</Text>
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
        paddingTop: 56,
        paddingBottom: 30,
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
        fontSize: 24,
        lineHeight: 30,
        fontWeight: "800",
        marginBottom: 28,
    },
    form: {
        gap: 18,
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
    primaryButton: {
        height: 52,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b73d9",
        marginTop: 24,
    },
    primaryText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "700",
    },
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 28,
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
