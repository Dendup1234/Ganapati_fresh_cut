import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const serviceImage =
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=240&q=80";

export default function AdminEditServiceScreen() {
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
                    <Text style={styles.headerTitle}>Service Details</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <Text style={styles.serviceType}>Massage</Text>
                <Image source={{ uri: serviceImage }} style={styles.image} />

                <Text style={styles.label}>Name</Text>
                <TextInput value="Olive Oil Massage" style={styles.input} />

                <Text style={styles.label}>Price</Text>
                <TextInput value="300" keyboardType="number-pad" style={styles.input} />

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
                <TextInput value="Massage" style={styles.input} />

                <Text style={styles.label}>Estimated Time</Text>
                <TextInput value="01 : 30" style={styles.input} />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    multiline
                    textAlignVertical="top"
                    value="Enhance your natural beauty with our professional makeup services. Whether it’s for a wedding, party, or special occasion, our skilled artists tailor each look to your style."
                    style={styles.descriptionInput}
                />

                <Pressable style={styles.primaryButton}>
                    <Ionicons name="create-outline" size={16} color="#ffffff" />
                    <Text style={styles.buttonText}>Edit service</Text>
                </Pressable>

                <Pressable style={styles.removeButton}>
                    <Ionicons name="trash-outline" size={16} color="#ffffff" />
                    <Text style={styles.buttonText}>Remove service</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#ffffff" },
    content: {
        paddingHorizontal: 18,
        paddingTop: 48,
        paddingBottom: 30,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
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
    serviceType: {
        color: "#111111",
        fontSize: 13,
        marginBottom: 18,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 45,
        alignSelf: "center",
        marginBottom: 22,
    },
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
    descriptionInput: {
        height: 88,
        borderWidth: 1,
        borderColor: "#dfe4ec",
        borderRadius: 5,
        color: "#9aa0aa",
        fontSize: 12,
        lineHeight: 16,
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
    removeButton: {
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
