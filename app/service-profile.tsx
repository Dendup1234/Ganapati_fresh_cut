import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const fallbackImage =
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=90";

export default function ServiceProfileScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ name?: string; image?: string }>();
    const serviceName = params.name ?? "Makeup";
    const image = params.image ?? fallbackImage;

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                style={styles.screen}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.heroWrap}>
                    <Image source={{ uri: image }} style={styles.heroImage} />
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={30} color="#ffffff" />
                    </Pressable>
                    <View style={styles.dots}>
                        <View style={styles.dotActive} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                </View>

                <View style={styles.body}>
                    <Text style={styles.title}>{serviceName}</Text>

                    <View style={styles.metaRow}>
                        <Ionicons name="time-outline" size={18} color="#4d535a" />
                        <Text style={styles.metaText}>3 people in queue</Text>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>Nu. 200</Text>
                        <Pressable style={styles.queueLink}>
                            <Text style={styles.queueLinkText}>view queue</Text>
                            <Ionicons name="chevron-forward" size={16} color="#111111" />
                        </Pressable>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>About Service</Text>
                    <Text style={styles.description}>
                        Enhance your natural beauty with our professional {serviceName.toLowerCase()} services. Whether it&apos;s for a wedding, party, or special occasion, our skilled artists tailor each look to your style.
                    </Text>

                    <Pressable style={styles.joinButton}>
                        <Text style={styles.joinButtonText}>Join Queue</Text>
                    </Pressable>
                </View>
            </ScrollView>
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
        paddingBottom: 40,
    },
    heroWrap: {
        height: 338,
        position: "relative",
        backgroundColor: "#e9e9e9",
    },
    heroImage: {
        width: "100%",
        height: "100%",
    },
    backButton: {
        position: "absolute",
        top: 34,
        left: 22,
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    dots: {
        position: "absolute",
        bottom: 16,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    dotActive: {
        width: 30,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#ffa21a",
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: "#ffffff",
    },
    body: {
        paddingHorizontal: 28,
        paddingTop: 24,
    },
    title: {
        color: "#111111",
        fontSize: 24,
        fontWeight: "800",
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        marginBottom: 16,
    },
    metaText: {
        color: "#20242a",
        fontSize: 14,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    price: {
        color: "#111111",
        fontSize: 15,
    },
    queueLink: {
        flexDirection: "row",
        alignItems: "center",
    },
    queueLinkText: {
        color: "#111111",
        fontSize: 12,
    },
    divider: {
        height: 1,
        backgroundColor: "#d7d7d7",
        marginBottom: 18,
    },
    sectionTitle: {
        color: "#111111",
        fontSize: 20,
        fontWeight: "500",
        marginBottom: 18,
    },
    description: {
        color: "#111111",
        fontSize: 14,
        lineHeight: 20,
    },
    joinButton: {
        height: 58,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1db5b9",
        marginTop: 54,
    },
    joinButtonText: {
        color: "#ffffff",
        fontSize: 13,
        fontWeight: "700",
    },
});
