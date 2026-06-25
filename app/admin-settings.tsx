import { Ionicons } from "@expo/vector-icons";
import AdminBottomNav from "@/components/ui/AdminBottomNav";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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

const brandingImage = require("../assets/images/Branding.png");

const menuItems = [
    {
        label: "Account Settings",
        icon: "settings-outline" as const,
        color: "#2f343b",
    },
    {
        label: "Shop Settings",
        icon: "storefront-outline" as const,
        color: "#2f343b",
    },
    {
        label: "Contact Support",
        icon: "call-outline" as const,
        color: "#2f343b",
    },
];

export default function AdminSettingsScreen() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("Admin");
    const [phone, setPhone] = useState("17123456");
    const avatarInitial = useMemo(() => name.trim().charAt(0).toUpperCase() || "A", [name]);

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.screen}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <Image source={brandingImage} style={styles.logo} resizeMode="contain" />

                    <Pressable
                        style={styles.editButton}
                        onPress={() => setIsEditing((value) => !value)}
                    >
                        <Ionicons
                            name={isEditing ? "checkmark-outline" : "create-outline"}
                            size={17}
                            color="#3b73d9"
                        />
                        <Text style={styles.editText}>{isEditing ? "Save" : "Edit"}</Text>
                    </Pressable>

                    <View style={styles.profile}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{avatarInitial}</Text>
                        </View>
                        {isEditing ? (
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Name"
                                placeholderTextColor="#9aa3b2"
                                style={styles.nameInput}
                            />
                        ) : (
                            <Text style={styles.name}>{name}</Text>
                        )}
                    </View>

                    <View style={styles.contactSection}>
                        <View style={styles.contactRow}>
                            <View style={[styles.contactIcon, styles.phoneIcon]}>
                                <Ionicons name="call-outline" size={22} color="#187d35" />
                            </View>
                            <View style={styles.contactText}>
                                <Text style={styles.contactLabel}>Phone</Text>
                                {isEditing ? (
                                    <TextInput
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                        placeholder="Phone"
                                        placeholderTextColor="#9aa3b2"
                                        style={styles.contactInput}
                                    />
                                ) : (
                                    <Text style={styles.contactValue}>{phone}</Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.contactDivider} />

                        <View style={styles.contactRow}>
                            <View style={[styles.contactIcon, styles.emailIcon]}>
                                <Ionicons name="mail-outline" size={22} color="#7b6400" />
                            </View>
                            <View style={styles.contactText}>
                                <Text style={styles.contactLabel}>Email</Text>
                                <Text style={styles.contactValue}>admin@beautyspot.com</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.menuCard}>
                        {menuItems.map((item, index) => (
                            <View key={item.label}>
                                <Pressable style={styles.menuRow}>
                                    <Ionicons name={item.icon} size={21} color={item.color} />
                                    <Text style={styles.menuText}>{item.label}</Text>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={20}
                                        color="#5d646d"
                                    />
                                </Pressable>
                                {index < menuItems.length - 1 ? (
                                    <View style={styles.menuDivider} />
                                ) : null}
                            </View>
                        ))}

                        <View style={styles.menuDivider} />

                        <Pressable
                            style={styles.menuRow}
                            onPress={() => router.replace("/login")}
                        >
                            <Ionicons name="log-out-outline" size={22} color="#ff4b4b" />
                            <Text style={styles.logoutText}>Logout</Text>
                            <Ionicons name="chevron-forward" size={20} color="#ff4b4b" />
                        </Pressable>
                    </View>
                </ScrollView>

                <AdminBottomNav active="settings" />
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
        paddingHorizontal: 32,
        paddingTop: 54,
        paddingBottom: 112,
    },
    logo: {
        width: 192,
        height: 94,
        alignSelf: "center",
        marginBottom: 4,
    },
    editButton: {
        alignSelf: "flex-end",
        minHeight: 32,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginBottom: 4,
        paddingHorizontal: 6,
    },
    editText: {
        color: "#3b73d9",
        fontSize: 12,
        fontWeight: "700",
    },
    profile: {
        alignItems: "center",
        marginBottom: 46,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 1,
        borderColor: "#d7d7d7",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        marginBottom: 9,
    },
    avatarText: {
        color: "#000000",
        fontSize: 48,
        lineHeight: 52,
    },
    name: {
        color: "#111111",
        fontSize: 14,
    },
    nameInput: {
        minWidth: 150,
        height: 36,
        borderWidth: 1,
        borderColor: "#dfe4ec",
        borderRadius: 8,
        color: "#111111",
        fontSize: 14,
        textAlign: "center",
        paddingHorizontal: 12,
    },
    contactSection: {
        marginBottom: 44,
    },
    contactRow: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 58,
    },
    contactIcon: {
        width: 50,
        height: 44,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 26,
    },
    phoneIcon: {
        backgroundColor: "#ecfde5",
    },
    emailIcon: {
        backgroundColor: "#fff3c8",
    },
    contactText: {
        flex: 1,
    },
    contactLabel: {
        color: "#111111",
        fontSize: 12,
        marginBottom: 5,
    },
    contactValue: {
        color: "#6f737a",
        fontSize: 12,
    },
    contactInput: {
        height: 32,
        borderWidth: 1,
        borderColor: "#dfe4ec",
        borderRadius: 7,
        color: "#111111",
        fontSize: 12,
        paddingHorizontal: 10,
    },
    contactDivider: {
        height: 1,
        backgroundColor: "#ececec",
        marginLeft: 76,
    },
    menuCard: {
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 22,
        overflow: "hidden",
        backgroundColor: "#ffffff",
    },
    menuRow: {
        minHeight: 64,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    menuText: {
        flex: 1,
        color: "#20242a",
        fontSize: 13,
        marginLeft: 16,
    },
    logoutText: {
        flex: 1,
        color: "#ff4b4b",
        fontSize: 13,
        marginLeft: 16,
    },
    menuDivider: {
        height: 1,
        backgroundColor: "#ececec",
        marginLeft: 58,
    },
});
