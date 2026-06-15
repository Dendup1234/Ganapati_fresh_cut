
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
    label: string;
    onPress: () => void;
    style?: ViewStyle;
};

const PrimaryButton: React.FC<Props> = ({ label, onPress, style }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: "100%",
        minHeight: 52,
        paddingVertical: 15,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b73d9",
    },
    label: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.8,
    },
});

export default PrimaryButton;
