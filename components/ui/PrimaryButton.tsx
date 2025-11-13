
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
        paddingVertical: 14,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
    },
    label: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default PrimaryButton;
