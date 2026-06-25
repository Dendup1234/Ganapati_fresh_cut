import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function AdminAddServiceScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={22} color="#111111" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Add New Service</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <Text style={styles.label}>Name</Text>
                <TextInput
                    placeholder="Armpit Waxing"
                    placeholderTextColor="#b0b6bf"
                    style={styles.input}
                />

                <Text style={styles.label}>Price</Text>
                <TextInput
                    placeholder="30"
                    placeholderTextColor="#b0b6bf"
                    keyboardType="number-pad"
                    style={styles.input}
                />

                <Text style={styles.label}>Category</Text>
                <View style={styles.radioGroup}>
                    <View style={styles.radioOption}>
                        <View style={styles.radio} />
                        <Text style={styles.radioText}>Barber</Text>
                    </View>
                    <View style={styles.radioOption}>
                        <View style={[styles.radio, styles.radioSelected]}>
                            <View style={styles.radioDot} />
                        </View>
                        <Text style={styles.radioText}>Beauty</Text>
                    </View>
                </View>

                <Text style={styles.label}>Service Type</Text>
                <View style={styles.selectInput}>
                    <Text style={styles.placeholderText}>Waxing</Text>
                    <Ionicons name="chevron-down" size={18} color="#687076" />
                </View>

                <Text style={styles.label}>Estimated Time</Text>
                <TextInput
                    placeholder="00 : 30"
                    placeholderTextColor="#b0b6bf"
                    style={[styles.input, styles.timeInput]}
                />

                <Text style={styles.label}>Image</Text>
                <View style={styles.uploadBox}>
                    <Ionicons name="cloud-upload-outline" size={28} color="#3b73d9" />
                    <Text style={styles.uploadTitle}>select your file</Text>
                    <Text style={styles.uploadHelp}>png, pdf, jpg, docx accepted</Text>
                    <Pressable style={styles.browseButton}>
                        <Text style={styles.browseText}>browse</Text>
                    </Pressable>
                </View>

                <Text style={styles.label}>Description</Text>
                <TextInput
                    multiline
                    textAlignVertical="top"
                    style={styles.descriptionInput}
                />

                <Pressable style={styles.primaryButton}>
                    <Ionicons name="add-circle-outline" size={16} color="#ffffff" />
                    <Text style={styles.buttonText}>Add Service</Text>
                </Pressable>

                <Pressable style={styles.cancelButton} onPress={() => router.back()}>
                    <Ionicons name="close-circle-outline" size={16} color="#ffffff" />
                    <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#ffffff" },
    content: {
        paddingHorizontal: 14,
        paddingTop: 48,
        paddingBottom: 30,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },
    backButton: { width: 36, height: 36, justifyContent: "center" },
    headerTitle: {
        flex: 1,
        color: "#111111",
        fontSize: 16,
        fontWeight: "800",
        textAlign: "center",
    },
    headerSpacer: { width: 36 },
    label: {
        color: "#111111",
        fontSize: 12,
        marginBottom: 6,
    },
    input: {
        height: 38,
        borderWidth: 1,
        borderColor: "#dfe4ec",
        borderRadius: 5,
        paddingHorizontal: 10,
        color: "#111111",
        fontSize: 12,
        marginBottom: 14,
    },
    timeInput: {
        width: 82,
    },
    radioGroup: {
        height: 58,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#c9ced8",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 14,
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    radio: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#b8bec8",
        alignItems: "center",
        justifyContent: "center",
    },
    radioSelected: {
        borderColor: "#3b73d9",
    },
    radioDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#3b73d9",
    },
    radioText: { color: "#111111", fontSize: 12 },
    selectInput: {
        height: 38,
        borderWidth: 1,
        borderColor: "#dfe4ec",
        borderRadius: 5,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    placeholderText: { color: "#b0b6bf", fontSize: 12 },
    uploadBox: {
        height: 170,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#9097a3",
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    uploadTitle: { color: "#111111", fontSize: 14, marginTop: 10 },
    uploadHelp: { color: "#b0b6bf", fontSize: 10, marginTop: 5 },
    browseButton: {
        width: 54,
        height: 22,
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b73d9",
        marginTop: 10,
    },
    browseText: { color: "#ffffff", fontSize: 9, fontWeight: "800" },
    descriptionInput: {
        height: 88,
        borderWidth: 1,
        borderColor: "#dfe4ec",
        borderRadius: 5,
        color: "#111111",
        fontSize: 12,
        padding: 10,
        marginBottom: 12,
    },
    primaryButton: {
        height: 36,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "#3b73d9",
        marginBottom: 10,
    },
    cancelButton: {
        height: 36,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "#ff626a",
    },
    buttonText: { color: "#ffffff", fontSize: 12, fontWeight: "800" },
});
