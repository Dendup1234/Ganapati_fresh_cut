import { Ionicons } from "@expo/vector-icons";
import AdminBottomNav from "@/components/ui/AdminBottomNav";
import React, { useState } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

const metrics = [
    { label: "Queue Length", value: "5", icon: "people-outline" as const },
    { label: "Today’s Revenue", value: "Nu 2,400", icon: "bar-chart-outline" as const },
    { label: "Completed Today", value: "12", icon: "checkmark-circle-outline" as const },
    { label: "Avg Waiting Time", value: "30 mins", icon: "time-outline" as const },
];

type AdminListTab = "queue" | "blacklisted";

export default function AdminHomeScreen() {
    const [barberActive, setBarberActive] = useState(true);
    const [beautyActive, setBeautyActive] = useState(true);
    const [activeListTab, setActiveListTab] = useState<AdminListTab>("queue");

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.screen}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>Hello, Admin</Text>

                    <View style={styles.metricsGrid}>
                        {metrics.map((metric) => (
                            <View key={metric.label} style={styles.metricCard}>
                                <View style={styles.metricTitleRow}>
                                    <Ionicons name={metric.icon} size={16} color="#3b73d9" />
                                    <Text style={styles.metricLabel}>{metric.label}</Text>
                                </View>
                                <Text style={styles.metricValue}>{metric.value}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.serviceControls}>
                        <View style={styles.serviceRow}>
                            <Text style={styles.serviceLabel}>Barber services</Text>
                            <Text style={styles.inactiveLabel}>Set Inactive</Text>
                            <Switch
                                value={barberActive}
                                onValueChange={setBarberActive}
                                trackColor={{ false: "#d8d8d8", true: "#20b7bb" }}
                                thumbColor="#ffffff"
                            />
                            <Pressable style={styles.notifyButton}>
                                <Ionicons name="notifications-outline" size={18} color="#ffffff" />
                                <Text style={styles.notifyText}>Notify Users</Text>
                            </Pressable>
                        </View>

                        <View style={styles.serviceRow}>
                            <Text style={styles.serviceLabel}>Barber services</Text>
                            <Text style={styles.inactiveLabel}>Set Inactive</Text>
                            <Switch
                                value={beautyActive}
                                onValueChange={setBeautyActive}
                                trackColor={{ false: "#d8d8d8", true: "#20b7bb" }}
                                thumbColor="#ffffff"
                            />
                            <Pressable style={styles.notifyButton}>
                                <Ionicons name="notifications-outline" size={18} color="#ffffff" />
                                <Text style={styles.notifyText}>Notify Users</Text>
                            </Pressable>
                        </View>
                    </View>

                    <Pressable style={styles.closeButton}>
                        <Ionicons name="storefront-outline" size={21} color="#ffffff" />
                        <Text style={styles.closeButtonText}>Close Shop</Text>
                    </Pressable>

                    <View style={styles.segment}>
                        <Pressable
                            style={[
                                styles.segmentItem,
                                activeListTab === "queue" ? styles.segmentActive : undefined,
                            ]}
                            onPress={() => setActiveListTab("queue")}
                        >
                            <Ionicons
                                name="people-outline"
                                size={18}
                                color={activeListTab === "queue" ? "#3b73d9" : "#6c7075"}
                            />
                            <Text
                                style={[
                                    styles.segmentText,
                                    activeListTab === "queue"
                                        ? styles.segmentTextActive
                                        : undefined,
                                ]}
                            >
                                Queue
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.segmentItem,
                                activeListTab === "blacklisted"
                                    ? styles.segmentActive
                                    : undefined,
                            ]}
                            onPress={() => setActiveListTab("blacklisted")}
                        >
                            <Ionicons
                                name="person-remove-outline"
                                size={18}
                                color={activeListTab === "blacklisted" ? "#3b73d9" : "#6c7075"}
                            />
                            <Text
                                style={[
                                    styles.segmentText,
                                    activeListTab === "blacklisted"
                                        ? styles.segmentTextActive
                                        : undefined,
                                ]}
                            >
                                Black Listed
                            </Text>
                        </Pressable>
                    </View>

                    {activeListTab === "queue" ? (
                        <View style={styles.queueCard}>
                            <View style={styles.queueBadge}>
                                <Text style={styles.queueBadgeText}>1</Text>
                            </View>
                            <View style={styles.queueInfo}>
                                <Text style={styles.queueName}>Damchey</Text>
                                <Text style={styles.queueService}>Haircut (Beauty)</Text>
                                <Text style={styles.queueTime}>2 min ago</Text>
                            </View>
                            <Pressable style={styles.checkButton}>
                                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                            </Pressable>
                        </View>
                    ) : (
                        <View style={styles.blacklistCard}>
                            <View style={styles.queueBadge}>
                                <Text style={styles.queueBadgeText}>1</Text>
                            </View>
                            <View style={styles.queueInfo}>
                                <Text style={styles.queueName}>Damchey</Text>
                                <Text style={styles.blacklistReason}>
                                    Reason: Repeated no-shows
                                </Text>
                                <Text style={styles.queueTime}>Since 2025-11-09</Text>
                            </View>
                            <View style={styles.blacklistScoreRing}>
                                <Text style={styles.blacklistScoreText}>42</Text>
                            </View>
                        </View>
                    )}

                    <Pressable style={styles.walkInButton}>
                        <Ionicons name="walk-outline" size={24} color="#ffffff" />
                        <Text style={styles.walkInText}>Add Walk-In</Text>
                    </Pressable>
                </ScrollView>

                <AdminBottomNav active="home" />
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
        paddingHorizontal: 28,
        paddingTop: 58,
        paddingBottom: 112,
    },
    title: {
        color: "#111111",
        fontSize: 23,
        fontWeight: "800",
        marginBottom: 18,
    },
    metricsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: 34,
        marginBottom: 40,
    },
    metricCard: {
        width: "43.5%",
        minHeight: 96,
        borderWidth: 1,
        borderColor: "#9e9e9e",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    metricTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 14,
    },
    metricLabel: {
        color: "#111111",
        fontSize: 12,
    },
    metricValue: {
        color: "#111111",
        fontSize: 13,
    },
    serviceControls: {
        gap: 28,
        marginBottom: 22,
    },
    serviceRow: {
        minHeight: 34,
        flexDirection: "row",
        alignItems: "center",
    },
    serviceLabel: {
        flex: 1,
        color: "#111111",
        fontSize: 16,
    },
    inactiveLabel: {
        color: "#111111",
        fontSize: 9,
        marginRight: 4,
        alignSelf: "flex-start",
    },
    notifyButton: {
        width: 112,
        height: 34,
        borderRadius: 7,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        backgroundColor: "#f49a48",
        marginLeft: 14,
    },
    notifyText: {
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "700",
    },
    closeButton: {
        alignSelf: "center",
        width: 168,
        height: 38,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        backgroundColor: "#ff626a",
        marginBottom: 16,
    },
    closeButtonText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "700",
    },
    segment: {
        alignSelf: "center",
        width: 222,
        height: 54,
        borderRadius: 27,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#dedede",
        padding: 7,
        marginBottom: 24,
    },
    segmentItem: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    segmentActive: {
        backgroundColor: "#ffffff",
    },
    segmentText: {
        color: "#6c7075",
        fontSize: 11,
    },
    segmentTextActive: {
        color: "#3b73d9",
        fontWeight: "700",
    },
    queueCard: {
        minHeight: 80,
        borderWidth: 1,
        borderColor: "#9e9e9e",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        marginBottom: 16,
    },
    blacklistCard: {
        minHeight: 88,
        borderWidth: 1,
        borderColor: "#9e9e9e",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        marginBottom: 16,
    },
    queueBadge: {
        width: 34,
        height: 22,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#dce9ff",
        marginRight: 10,
        alignSelf: "flex-start",
        marginTop: 14,
    },
    queueBadgeText: {
        color: "#3b73d9",
        fontSize: 12,
        fontWeight: "800",
    },
    queueInfo: {
        flex: 1,
    },
    queueName: {
        color: "#111111",
        fontSize: 16,
        marginBottom: 7,
    },
    queueService: {
        color: "#6d7075",
        fontSize: 12,
        marginBottom: 4,
    },
    blacklistReason: {
        color: "#6d7075",
        fontSize: 12,
        marginBottom: 4,
    },
    queueTime: {
        color: "#8a8f96",
        fontSize: 10,
    },
    checkButton: {
        width: 26,
        height: 26,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b73d9",
    },
    blacklistScoreRing: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 5,
        borderColor: "#d0d0d0",
        alignItems: "center",
        justifyContent: "center",
    },
    blacklistScoreText: {
        color: "#ff626a",
        fontSize: 13,
        fontWeight: "700",
    },
    walkInButton: {
        height: 50,
        borderRadius: 7,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        backgroundColor: "#1db5b9",
    },
    walkInText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "800",
    },
});
