import { useRouter } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.content}>
                <Text style={styles.title}>Login successful</Text>
                <Text style={styles.subtitle}>
                    Dummy user is signed in for testing.
                </Text>
                <Pressable style={styles.button} onPress={() => router.replace("/login")}>
                    <Text style={styles.buttonText}>Logout</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 28,
    },
    title: {
        color: "#10131a",
        fontSize: 26,
        fontWeight: "800",
        marginBottom: 10,
    },
    subtitle: {
        color: "#6b7280",
        fontSize: 14,
        marginBottom: 24,
        textAlign: "center",
    },
    button: {
        width: "100%",
        height: 52,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b73d9",
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "700",
    },
});
