import { Ionicons } from "@expo/vector-icons";
import BottomNav from "@/components/ui/BottomNav";
import React, { useState } from "react";
import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const brandingImage = require("../assets/images/Branding.png");

const initialNotifications = [
    {
        id: "next",
        icon: "time-outline" as const,
        iconColor: "#179b63",
        backgroundColor: "#ecfde5",
        borderColor: "#cbeeba",
        title: "You’re next!",
        message: "Please visit for: ",
        strong: "Makeup",
        time: "2 mins ago",
    },
    {
        id: "ahead",
        icon: "people-outline" as const,
        iconColor: "#ff9d00",
        backgroundColor: "#fff5c8",
        borderColor: "#f2dfa0",
        title: "3 customers ahead",
        message: "Your turn is coming soon",
        strong: "",
        time: "25 mins ago",
    },
    {
        id: "joined",
        icon: "notifications-outline" as const,
        iconColor: "#3b73d9",
        backgroundColor: "#ffffff",
        borderColor: "#e4e4e4",
        title: "Queue joined successfully",
        message: "Your service has been booked",
        strong: "",
        time: "1 hour ago",
    },
];

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState(initialNotifications);

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.screen}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <Image source={brandingImage} style={styles.logo} resizeMode="contain" />

                    <Pressable
                        style={styles.clearButton}
                        onPress={() => setNotifications([])}
                    >
                        <Text style={styles.clearText}>Clear all</Text>
                    </Pressable>

                    <View style={styles.cards}>
                        {notifications.map((notification) => (
                            <View
                                key={notification.id}
                                style={[
                                    styles.card,
                                    {
                                        backgroundColor: notification.backgroundColor,
                                        borderColor: notification.borderColor,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={notification.icon}
                                    size={24}
                                    color={notification.iconColor}
                                    style={styles.cardIcon}
                                />
                                <View style={styles.cardBody}>
                                    <Text style={styles.cardTitle}>{notification.title}</Text>
                                    <Text style={styles.cardMessage}>
                                        {notification.message}
                                        {notification.strong ? (
                                            <Text style={styles.strongText}>
                                                {notification.strong}
                                            </Text>
                                        ) : null}
                                    </Text>
                                    <Text style={styles.timeText}>{notification.time}</Text>
                                </View>
                            </View>
                        ))}

                        {notifications.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyTitle}>No notifications</Text>
                                <Text style={styles.emptyText}>
                                    Queue updates will appear here.
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </ScrollView>

                <BottomNav active="notifications" />
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
        paddingHorizontal: 40,
        paddingTop: 58,
        paddingBottom: 112,
    },
    logo: {
        width: 142,
        height: 82,
        alignSelf: "center",
        marginBottom: 18,
    },
    clearButton: {
        alignSelf: "flex-end",
        marginBottom: 14,
    },
    clearText: {
        color: "#ff5d6d",
        fontSize: 14,
        textDecorationLine: "underline",
    },
    cards: {
        gap: 18,
    },
    card: {
        minHeight: 124,
        borderRadius: 11,
        borderWidth: 1,
        flexDirection: "row",
        paddingTop: 24,
        paddingHorizontal: 22,
    },
    cardIcon: {
        marginRight: 24,
        marginTop: 1,
    },
    cardBody: {
        flex: 1,
    },
    cardTitle: {
        color: "#111111",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 16,
    },
    cardMessage: {
        color: "#55595f",
        fontSize: 14,
        lineHeight: 18,
        marginBottom: 18,
    },
    strongText: {
        color: "#111111",
        fontWeight: "800",
    },
    timeText: {
        color: "#8a8f96",
        fontSize: 12,
    },
    emptyState: {
        minHeight: 124,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: "#e4e4e4",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    emptyTitle: {
        color: "#111111",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 8,
    },
    emptyText: {
        color: "#6d7075",
        fontSize: 13,
        textAlign: "center",
    },
});
