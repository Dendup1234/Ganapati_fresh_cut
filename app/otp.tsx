import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const TEST_OTP = "5130";
const RESEND_PROMPT = "Didn't received code? ";

export default function OtpScreen() {
    const router = useRouter();
    const inputs = useRef<(TextInput | null)[]>([]);
    const [otp, setOtp] = useState(["5", "1", "3", ""]);

    const handleChange = (value: string, index: number) => {
        const nextValue = value.replace(/\D/g, "").slice(-1);
        const nextOtp = [...otp];
        nextOtp[index] = nextValue;
        setOtp(nextOtp);

        if (nextValue && index < inputs.current.length - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleVerify = () => {
        if (otp.join("") === TEST_OTP) {
            Alert.alert("Verified", "Email verification complete.", [
                { text: "Continue", onPress: () => router.replace("/login") },
            ]);
            return;
        }

        Alert.alert("Invalid code", "Use 5130 for the test OTP.");
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.content}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={18} color="#111827" />
                </Pressable>

                <Text style={styles.title}>OTP{"\n"}Verification</Text>
                <Text style={styles.subtitle}>
                    Enter the verification code we just sent on your email address.
                </Text>

                <View style={styles.otpRow}>
                    {otp.map((value, index) => (
                        <TextInput
                            key={index}
                            ref={(input) => {
                                inputs.current[index] = input;
                            }}
                            value={value}
                            onChangeText={(text) => handleChange(text, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            style={[
                                styles.otpInput,
                                value ? styles.otpInputActive : undefined,
                            ]}
                            textAlign="center"
                        />
                    ))}
                </View>

                <Pressable style={styles.primaryButton} onPress={handleVerify}>
                    <Text style={styles.primaryText}>Verify</Text>
                </Pressable>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>{RESEND_PROMPT}</Text>
                    <Pressable onPress={() => setOtp(["5", "1", "3", "0"])}>
                        <Text style={styles.footerLink}>Resend</Text>
                    </Pressable>
                </View>
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
        paddingHorizontal: 28,
        paddingTop: 56,
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
        marginBottom: 48,
    },
    otpRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 22,
    },
    otpInput: {
        flex: 1,
        height: 58,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: "#edf0f4",
        backgroundColor: "#f7f8fa",
        color: "#111827",
        fontSize: 18,
        fontWeight: "700",
    },
    otpInputActive: {
        borderColor: "#3b73d9",
        backgroundColor: "#ffffff",
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
    footerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 22,
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
