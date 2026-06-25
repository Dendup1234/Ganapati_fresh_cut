import { Ionicons } from "@expo/vector-icons";
import AdminBottomNav from "@/components/ui/AdminBottomNav";
import { useRouter } from "expo-router";
import React from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const services = [
    { name: "Haircut", variants: "4 Variants" },
    { name: "Waxing", variants: "5 Variants" },
    { name: "Hair Color", variants: "2 Variants" },
    { name: "Facial", variants: "5 Variants" },
    { name: "Massage", variants: "5 Variants" },
];

export default function AdminServicesScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.screen}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>Services</Text>

                    <View style={styles.summaryCard}>
                        <View style={styles.summaryColumn}>
                            <View style={styles.summaryTitle}>
                                <Ionicons name="cut-outline" size={24} color="#6f7378" />
                                <Text style={styles.summaryLabel}>Barber</Text>
                            </View>
                            <View style={styles.countBox}>
                                <Text style={styles.countText}>5</Text>
                            </View>
                        </View>

                        <View style={styles.summaryColumn}>
                            <View style={styles.summaryTitle}>
                                <Ionicons name="brush-outline" size={24} color="#6f7378" />
                                <Text style={styles.summaryLabel}>Beauty</Text>
                            </View>
                            <View style={styles.countBox}>
                                <Text style={styles.countText}>15</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        <Pressable
                            style={styles.smallButton}
                            onPress={() => router.push("/admin-add-service")}
                        >
                            <Text style={styles.smallButtonText}>+ Add Service</Text>
                        </Pressable>
                        <Pressable style={styles.smallButton}>
                            <Text style={styles.smallButtonText}>+ Add Service Category</Text>
                        </Pressable>
                    </View>

                    <View style={styles.segment}>
                        <Pressable style={[styles.segmentItem, styles.segmentActive]}>
                            <Ionicons name="layers-outline" size={20} color="#3b73d9" />
                            <Text style={[styles.segmentText, styles.segmentTextActive]}>
                                All
                            </Text>
                        </Pressable>
                        <Pressable style={styles.segmentItem}>
                            <Ionicons name="cut-outline" size={20} color="#6c7075" />
                            <Text style={styles.segmentText}>Barber</Text>
                        </Pressable>
                        <Pressable style={styles.segmentItem}>
                            <Ionicons name="brush-outline" size={20} color="#6c7075" />
                            <Text style={styles.segmentText}>Beauty</Text>
                        </Pressable>
                    </View>

                    <View style={styles.list}>
                        {services.map((service) => (
                            <View key={service.name} style={styles.serviceRow}>
                                <Text style={styles.serviceName}>{service.name}</Text>
                                <Text style={styles.variantText}>{service.variants}</Text>
                                <Pressable
                                    style={styles.editButton}
                                    onPress={() => router.push("/admin-edit-service")}
                                >
                                    <Ionicons
                                        name="create-outline"
                                        size={14}
                                        color="#ffffff"
                                    />
                                    <Text style={styles.editButtonText}>Edit Details</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <AdminBottomNav active="services" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    screen: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    content: {
        paddingHorizontal: 36,
        paddingTop: 70,
        paddingBottom: 112,
    },
    title: {
        color: "#111111",
        fontSize: 23,
        fontWeight: "800",
        marginBottom: 24,
    },
    summaryCard: {
        minHeight: 112,
        borderWidth: 1,
        borderColor: "#b7b7b7",
        borderRadius: 9,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginHorizontal: 18,
        marginBottom: 30,
    },
    summaryColumn: {
        alignItems: "center",
    },
    summaryTitle: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        marginBottom: 12,
    },
    summaryLabel: {
        color: "#6f7378",
        fontSize: 20,
    },
    countBox: {
        width: 38,
        height: 38,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#dce9ff",
    },
    countText: {
        color: "#3b73d9",
        fontSize: 22,
        fontWeight: "800",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    smallButton: {
        height: 34,
        minWidth: 96,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b73d9",
        paddingHorizontal: 10,
    },
    smallButtonText: {
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "800",
    },
    segment: {
        height: 58,
        borderRadius: 29,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#dedede",
        padding: 7,
        marginBottom: 28,
    },
    segmentItem: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    segmentActive: {
        backgroundColor: "#ffffff",
    },
    segmentText: {
        color: "#6c7075",
        fontSize: 12,
    },
    segmentTextActive: {
        color: "#3b73d9",
        fontWeight: "700",
    },
    list: {
        gap: 30,
        paddingHorizontal: 2,
    },
    serviceRow: {
        minHeight: 34,
        flexDirection: "row",
        alignItems: "center",
    },
    serviceName: {
        flex: 1,
        color: "#111111",
        fontSize: 14,
        fontWeight: "700",
    },
    variantText: {
        width: 76,
        color: "#575b61",
        fontSize: 10,
    },
    editButton: {
        width: 106,
        height: 30,
        borderRadius: 7,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "#1db5b9",
    },
    editButtonText: {
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "800",
    },
});
