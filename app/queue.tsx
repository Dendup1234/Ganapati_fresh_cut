import { Ionicons } from "@expo/vector-icons";
import BottomNav from "@/components/ui/BottomNav";
import React, { useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const queueMembers = [
    "Pema Dorji",
    "Sonam Wangmo",
    "Kinzang Choden",
    "Tenzin Namgay",
    "Dechen Lhamo",
    "Thinley Dorji",
    "Tshering Dema",
    "Ugyen Norbu",
    "Nima Zangmo",
    "Dorji Wangchuk",
    "Tanishaa",
    "Damchey",
    "Karma Tashi",
    "Dendup Tshering",
    "Singye Tashi",
    "Pem Zam",
    "Namgay Pelden",
    "Jigme Tenzin",
];

export default function QueueScreen() {
    const [showExitDialog, setShowExitDialog] = useState(false);

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.screen}>
                <View style={styles.header}>
                    <View style={styles.greeting}>
                        <Text style={styles.title}>Hello, Dendup</Text>
                        <Text style={styles.subtitle}>
                            You are 13th in line for the haircut
                        </Text>
                    </View>

                    <View style={styles.scoreWrap}>
                        <View style={styles.scoreRing}>
                            <Text style={styles.scoreText}>78</Text>
                        </View>
                        <Image
                            source={{
                                uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80",
                            }}
                            style={styles.avatar}
                        />
                    </View>
                </View>

                <View style={styles.categoryBar}>
                    <Pressable style={[styles.categoryItem, styles.categoryActive]}>
                        <Ionicons name="cut-outline" size={20} color="#3b73d9" />
                        <Text style={[styles.categoryText, styles.categoryTextActive]}>
                            Barber
                        </Text>
                    </Pressable>
                    <Pressable style={styles.categoryItem}>
                        <Ionicons name="brush-outline" size={20} color="#6c7075" />
                        <Text style={styles.categoryText}>Beauty</Text>
                    </Pressable>
                </View>

                <View style={styles.listSection}>
                    <ScrollView
                        style={styles.queueList}
                        contentContainerStyle={styles.queueListContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {queueMembers.map((member, index) => {
                            const position = index + 1;
                            const isCurrentUser = member === "Karma Tashi";

                            return (
                                <View
                                    key={`${member}-${position}`}
                                    style={[
                                        styles.queueRow,
                                        isCurrentUser ? styles.queueRowActive : undefined,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.positionText,
                                            isCurrentUser ? styles.queueTextActive : undefined,
                                        ]}
                                    >
                                        {position}.
                                    </Text>
                                    <Text
                                        style={[
                                            styles.memberText,
                                            isCurrentUser ? styles.queueTextActive : undefined,
                                        ]}
                                    >
                                        {member}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>

                    <Pressable style={styles.smallQueueIcon}>
                        <Ionicons name="options-outline" size={20} color="#5d6065" />
                    </Pressable>
                </View>

                <View style={styles.stats}>
                    <View style={styles.statRow}>
                        <View style={styles.statIconBox}>
                            <Ionicons name="timer-outline" size={24} color="#3b73d9" />
                        </View>
                        <View style={styles.statTextWrap}>
                            <Text style={styles.statValue}>
                                35<Text style={styles.statUnit}>mins</Text>
                            </Text>
                            <Text style={styles.statLabel}>Estimated Time</Text>
                        </View>
                    </View>

                    <View style={styles.statRow}>
                        <View style={styles.statIconBox}>
                            <Ionicons name="people-outline" size={24} color="#3b73d9" />
                        </View>
                        <View style={styles.statTextWrap}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>Customers ahead</Text>
                        </View>
                    </View>
                </View>

                <Pressable
                    style={styles.exitButton}
                    onPress={() => setShowExitDialog(true)}
                >
                    <Text style={styles.exitButtonText}>Exit Queue</Text>
                </Pressable>

                <BottomNav active="queue" />
            </View>

            <Modal transparent visible={showExitDialog} animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={styles.dialog}>
                        <Text style={styles.dialogText}>
                            Are you sure you want to cancel? You may need to wait again.
                        </Text>
                        <View style={styles.dialogActions}>
                            <Pressable
                                style={styles.dialogButton}
                                onPress={() => setShowExitDialog(false)}
                            >
                                <Text style={styles.dialogYes}>Yes</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.dialogButton, styles.dialogButtonMuted]}
                                onPress={() => setShowExitDialog(false)}
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
        paddingHorizontal: 28,
        paddingTop: 52,
        paddingBottom: 96,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    greeting: {
        flex: 1,
    },
    title: {
        color: "#111111",
        fontSize: 22,
        fontWeight: "800",
        marginBottom: 10,
    },
    subtitle: {
        color: "#6d7075",
        fontSize: 12,
    },
    scoreWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },
    scoreRing: {
        width: 58,
        height: 58,
        borderRadius: 29,
        borderWidth: 5,
        borderColor: "#28b8bd",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
    },
    scoreText: {
        color: "#28b8bd",
        fontSize: 15,
        fontWeight: "600",
    },
    avatar: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#e8e8e8",
    },
    categoryBar: {
        alignSelf: "center",
        width: 206,
        height: 48,
        borderRadius: 24,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#dedede",
        padding: 5,
        marginBottom: 22,
    },
    categoryItem: {
        flex: 1,
        height: 38,
        borderRadius: 19,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
    },
    categoryActive: {
        backgroundColor: "#ffffff",
    },
    categoryText: {
        color: "#6c7075",
        fontSize: 12,
    },
    categoryTextActive: {
        color: "#3b73d9",
        fontWeight: "700",
    },
    listSection: {
        height: 150,
        position: "relative",
        marginHorizontal: -28,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#eeeeee",
        marginBottom: 48,
    },
    queueList: {
        flex: 1,
    },
    queueListContent: {
        paddingHorizontal: 54,
        paddingVertical: 10,
    },
    queueRow: {
        minHeight: 24,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    queueRowActive: {
        borderWidth: 1,
        borderColor: "#e3e7ee",
        backgroundColor: "#f8f9fb",
    },
    positionText: {
        width: 40,
        color: "#c4c5ca",
        fontSize: 17,
        textAlign: "right",
        marginRight: 16,
    },
    memberText: {
        flex: 1,
        color: "#c4c5ca",
        fontSize: 17,
    },
    queueTextActive: {
        color: "#3b73d9",
    },
    smallQueueIcon: {
        position: "absolute",
        top: 14,
        right: 10,
        width: 28,
        height: 28,
        borderWidth: 1,
        borderColor: "#aeb4bd",
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
    },
    stats: {
        alignSelf: "center",
        gap: 20,
        marginBottom: 56,
    },
    statRow: {
        width: 210,
        flexDirection: "row",
        alignItems: "center",
    },
    statIconBox: {
        width: 50,
        height: 50,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#dce9ff",
        marginRight: 14,
    },
    statTextWrap: {
        flex: 1,
    },
    statValue: {
        color: "#111111",
        fontSize: 32,
        lineHeight: 34,
        fontWeight: "800",
    },
    statUnit: {
        fontSize: 16,
        fontWeight: "800",
    },
    statLabel: {
        color: "#111111",
        fontSize: 10,
    },
    exitButton: {
        height: 54,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ff626a",
    },
    exitButtonText: {
        color: "#ffffff",
        fontSize: 13,
        fontWeight: "700",
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 42,
        backgroundColor: "rgba(0, 0, 0, 0.38)",
    },
    dialog: {
        width: "100%",
        borderRadius: 12,
        backgroundColor: "#ffffff",
        paddingTop: 26,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    dialogText: {
        color: "#111111",
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 22,
    },
    dialogActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
    },
    dialogButton: {
        minWidth: 64,
        height: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    dialogButtonMuted: {
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
