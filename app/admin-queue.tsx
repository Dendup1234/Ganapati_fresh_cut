import { Ionicons } from "@expo/vector-icons";
import AdminBottomNav from "@/components/ui/AdminBottomNav";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const queueItems = [
    {
        number: 1,
        name: "Damchey",
        phone: "17272837",
        time: "5 min ago",
        service: "Hair Cut",
        score: 78,
    },
    {
        number: 2,
        name: "Karma Tashi",
        phone: "17272837",
        time: "1 min ago",
        service: "Hair Cut",
        score: 44,
    },
];

export default function AdminQueueScreen() {
    const [showWalkInModal, setShowWalkInModal] = useState(false);

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.screen}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>Booking</Text>

                    <View style={styles.actions}>
                        <Pressable
                            style={[styles.actionButton, styles.walkInButton]}
                            onPress={() => setShowWalkInModal(true)}
                        >
                            <Ionicons name="walk-outline" size={23} color="#ffffff" />
                            <Text style={styles.actionText}>Add Walk-In</Text>
                        </Pressable>

                        <Pressable style={[styles.actionButton, styles.stopButton]}>
                            <Ionicons name="close-circle-outline" size={23} color="#ffffff" />
                            <Text style={styles.actionText}>Stop Queue</Text>
                        </Pressable>
                    </View>

                    <View style={styles.summaryCard}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Total in Queue</Text>
                            <Text style={styles.summaryValue}>5</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Avg Wait Time</Text>
                            <Text style={styles.summaryValue}>18 min</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Status</Text>
                            <View style={styles.statusPill}>
                                <Text style={styles.statusText}>Active</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.segment}>
                        <Pressable style={[styles.segmentItem, styles.segmentActive]}>
                            <Ionicons name="cut-outline" size={21} color="#3b73d9" />
                            <Text style={[styles.segmentText, styles.segmentTextActive]}>
                                Barber
                            </Text>
                        </Pressable>
                        <Pressable style={styles.segmentItem}>
                            <Ionicons name="brush-outline" size={21} color="#6c7075" />
                            <Text style={styles.segmentText}>Beauty</Text>
                        </Pressable>
                    </View>

                    <View style={styles.cards}>
                        {queueItems.map((item) => (
                            <View key={item.name} style={styles.queueCard}>
                                <View style={styles.cardTop}>
                                    <View style={styles.numberBadge}>
                                        <Text style={styles.numberText}>{item.number}</Text>
                                    </View>
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.customerName}>{item.name}</Text>
                                        <Text style={styles.phone}>{item.phone}</Text>
                                    </View>
                                    <View style={styles.scoreRing}>
                                        <Text style={styles.scoreText}>{item.score}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardMeta}>
                                    <Text style={styles.time}>{item.time}</Text>
                                    <Text style={styles.service}>{item.service}</Text>
                                </View>

                                <View style={styles.cardActions}>
                                    <Pressable style={styles.doneButton}>
                                        <Ionicons
                                            name="checkmark-circle-outline"
                                            size={16}
                                            color="#ffffff"
                                        />
                                        <Text style={styles.doneText}>Done</Text>
                                    </Pressable>
                                    <Pressable style={styles.skipButton}>
                                        <Text style={styles.skipText}>Skip</Text>
                                    </Pressable>
                                    <Pressable style={styles.deleteButton}>
                                        <Ionicons name="trash-outline" size={16} color="#ffffff" />
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <AdminBottomNav active="queue" />
            </View>

            <Modal transparent visible={showWalkInModal} animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={styles.walkInDialog}>
                        <Text style={styles.dialogTitle}>Select Service Category</Text>

                        <View style={styles.dialogRadioGroup}>
                            <View style={styles.dialogRadioOption}>
                                <View style={styles.dialogRadio} />
                                <Text style={styles.dialogRadioText}>Barber</Text>
                            </View>
                            <View style={styles.dialogRadioOption}>
                                <View style={[styles.dialogRadio, styles.dialogRadioSelected]}>
                                    <View style={styles.dialogRadioDot} />
                                </View>
                                <Text style={styles.dialogRadioText}>Beauty</Text>
                            </View>
                        </View>

                        <Text style={styles.dialogQuestion}>Add person to the queue?</Text>

                        <View style={styles.dialogActions}>
                            <Pressable
                                style={styles.dialogAction}
                                onPress={() => setShowWalkInModal(false)}
                            >
                                <Text style={styles.dialogYes}>Yes</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.dialogAction, styles.dialogActionMuted]}
                                onPress={() => setShowWalkInModal(false)}
                            >
                                <Text style={styles.dialogNo}>No</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
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
        paddingHorizontal: 32,
        paddingTop: 76,
        paddingBottom: 112,
    },
    title: {
        color: "#111111",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 34,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    actionButton: {
        width: "45.5%",
        height: 52,
        borderRadius: 7,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    walkInButton: {
        backgroundColor: "#1db5b9",
    },
    stopButton: {
        backgroundColor: "#ff626a",
    },
    actionText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "800",
    },
    summaryCard: {
        height: 76,
        borderWidth: 1,
        borderColor: "#1db5b9",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 22,
        marginBottom: 30,
    },
    summaryItem: {
        alignItems: "center",
        minWidth: 66,
    },
    summaryLabel: {
        color: "#9aa0aa",
        fontSize: 12,
        marginBottom: 6,
    },
    summaryValue: {
        color: "#111111",
        fontSize: 16,
        fontWeight: "800",
    },
    statusPill: {
        minWidth: 44,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1db5b9",
    },
    statusText: {
        color: "#ffffff",
        fontSize: 11,
        fontWeight: "800",
    },
    segment: {
        alignSelf: "center",
        width: 238,
        height: 58,
        borderRadius: 29,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#dedede",
        padding: 7,
        marginBottom: 32,
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
    cards: {
        gap: 18,
    },
    queueCard: {
        minHeight: 158,
        borderWidth: 1,
        borderColor: "#a5a5a5",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 12,
    },
    cardTop: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 4,
    },
    numberBadge: {
        width: 34,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#dce9ff",
        marginRight: 10,
    },
    numberText: {
        color: "#3b73d9",
        fontSize: 12,
        fontWeight: "800",
    },
    cardInfo: {
        flex: 1,
    },
    customerName: {
        color: "#111111",
        fontSize: 16,
        marginBottom: 17,
    },
    phone: {
        color: "#9aa0aa",
        fontSize: 12,
    },
    scoreRing: {
        width: 42,
        height: 42,
        borderRadius: 21,
        borderWidth: 5,
        borderColor: "#b8b8b8",
        alignItems: "center",
        justifyContent: "center",
    },
    scoreText: {
        color: "#1db5b9",
        fontSize: 12,
        fontWeight: "700",
    },
    cardMeta: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 7,
    },
    time: {
        color: "#9aa0aa",
        fontSize: 12,
    },
    service: {
        color: "#f49a48",
        fontSize: 12,
    },
    cardActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    doneButton: {
        flex: 1,
        height: 32,
        borderRadius: 7,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#1db5b9",
    },
    doneText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "800",
    },
    skipButton: {
        width: 42,
        height: 32,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f49a48",
    },
    skipText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "800",
    },
    deleteButton: {
        width: 32,
        height: 32,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ff626a",
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 26,
        backgroundColor: "rgba(0, 0, 0, 0.42)",
    },
    walkInDialog: {
        width: "100%",
        borderRadius: 12,
        backgroundColor: "#ffffff",
        paddingHorizontal: 16,
        paddingTop: 18,
        paddingBottom: 18,
    },
    dialogTitle: {
        color: "#111111",
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 12,
    },
    dialogRadioGroup: {
        height: 58,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#dfe4ec",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 18,
    },
    dialogRadioOption: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },
    dialogRadio: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#b8bec8",
        alignItems: "center",
        justifyContent: "center",
    },
    dialogRadioSelected: {
        borderColor: "#3b73d9",
    },
    dialogRadioDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#3b73d9",
    },
    dialogRadioText: {
        color: "#111111",
        fontSize: 12,
    },
    dialogQuestion: {
        color: "#111111",
        fontSize: 11,
        marginBottom: 18,
    },
    dialogActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
    },
    dialogAction: {
        width: 94,
        height: 28,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    dialogActionMuted: {
        backgroundColor: "#e8f0ff",
    },
    dialogYes: {
        color: "#111111",
        fontSize: 10,
    },
    dialogNo: {
        color: "#1d4fbf",
        fontSize: 10,
        fontWeight: "700",
    },
});
