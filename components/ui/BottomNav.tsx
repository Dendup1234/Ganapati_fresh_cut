import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type NavKey = "home" | "queue" | "notifications" | "settings";

type NavItem = {
    key: NavKey;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: Href;
};

type Props = {
    active: NavKey;
};

const items: NavItem[] = [
    { key: "home", label: "Home", icon: "home-outline", route: "/home" },
    { key: "queue", label: "Queue", icon: "file-tray-outline", route: "/queue" },
    {
        key: "notifications",
        label: "Notifications",
        icon: "business-outline",
        route: "/notifications",
    },
    { key: "settings", label: "Settings", icon: "options-outline", route: "/settings" },
];

export default function BottomNav({ active }: Props) {
    const router = useRouter();

    return (
        <View style={styles.wrap}>
            <View style={styles.bar}>
                {items.map((item) => {
                    const isActive = item.key === active;

                    return (
                        <Pressable
                            key={item.key}
                            style={styles.item}
                            onPress={() => router.replace(item.route)}
                        >
                            <Ionicons
                                name={item.icon}
                                size={24}
                                color={isActive ? "#3b73d9" : "#4f5359"}
                            />
                            <Text
                                style={[
                                    styles.label,
                                    isActive ? styles.labelActive : undefined,
                                ]}
                            >
                                {item.label}
                            </Text>
                            <View
                                style={[
                                    styles.dot,
                                    isActive ? styles.dotActive : undefined,
                                ]}
                            />
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 18,
        paddingBottom: 12,
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        borderTopWidth: 1,
        borderTopColor: "#e7e7e7",
    },
    bar: {
        minHeight: 70,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    item: {
        width: 72,
        minHeight: 58,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        color: "#4f5359",
        fontSize: 10,
        marginTop: 3,
    },
    labelActive: {
        color: "#3b73d9",
        fontWeight: "700",
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginTop: 5,
        backgroundColor: "transparent",
    },
    dotActive: {
        backgroundColor: "#3b73d9",
    },
});
