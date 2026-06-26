import { getService, AdminService } from "@/app/api/services";
import { createToken } from "@/app/api/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
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
    const params = useLocalSearchParams<{
        categoryId?: string;
        categoryName?: string;
        serviceId?: string;
        name?: string;
        image?: string;
    }>();
    const categoryId = Number(params.categoryId);
    const serviceId = Number(params.serviceId);
    const serviceName = params.name ?? "Makeup";
    const [service, setService] = useState<AdminService | null>(null);
    const [loading, setLoading] = useState(Boolean(categoryId && serviceId));
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState("");
    const image = service?.img || params.image || fallbackImage;
    const title = service?.name ?? serviceName;
    const price = service?.price ?? "200";
    const description =
        service?.description ||
        `Enhance your natural beauty with our professional ${title.toLowerCase()} services. Whether it's for a wedding, party, or special occasion, our skilled artists tailor each look to your style.`;

    useEffect(() => {
        let mounted = true;

        const loadService = async () => {
            if (!categoryId || !serviceId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const nextService = await getService(categoryId, serviceId);

                if (mounted) {
                    setService(nextService);
                }
            } catch {
                if (mounted) {
                    setError("Unable to load this service right now.");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadService();

        return () => {
            mounted = false;
        };
    }, [categoryId, serviceId]);

    const handleJoinQueue = async () => {
        const targetServiceId = service?.id ?? serviceId;

        if (!targetServiceId) {
            Alert.alert("Service unavailable", "Please try again from home.");
            return;
        }

        setJoining(true);

        try {
            const token = await createToken(targetServiceId);

            router.replace({
                pathname: "/queue",
                params: {
                    tokenId: token.id.toString(),
                    serviceId: targetServiceId.toString(),
                    serviceName: token.service?.name ?? title,
                    categoryName: params.categoryName ?? "",
                    estimatedTime: service?.estimated_time ?? "",
                },
            });
        } catch {
            Alert.alert("Unable to join queue", "Please try again.");
        } finally {
            setJoining(false);
        }
    };

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
                    {loading ? (
                        <ActivityIndicator color="#1db5b9" />
                    ) : error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : null}

                    <Text style={styles.title}>{title}</Text>

                    <View style={styles.metaRow}>
                        <Ionicons name="time-outline" size={18} color="#4d535a" />
                        <Text style={styles.metaText}>
                            {service?.estimated_time
                                ? `${service.estimated_time} mins estimated`
                                : "Queue available"}
                        </Text>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>Nu. {price}</Text>
                        <Pressable
                            style={styles.queueLink}
                            onPress={() =>
                                router.push({
                                    pathname: "/queue",
                                    params: {
                                        serviceId: (service?.id ?? serviceId).toString(),
                                        serviceName: title,
                                        categoryName: params.categoryName ?? "",
                                        estimatedTime: service?.estimated_time ?? "",
                                    },
                                })
                            }
                        >
                            <Text style={styles.queueLinkText}>view queue</Text>
                            <Ionicons name="chevron-forward" size={16} color="#111111" />
                        </Pressable>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>About Service</Text>
                    <Text style={styles.description}>{description}</Text>

                    <Pressable
                        style={[styles.joinButton, joining && styles.joinButtonMuted]}
                        onPress={handleJoinQueue}
                        disabled={joining || loading}
                    >
                        <Text style={styles.joinButtonText}>
                            {joining ? "Joining..." : "Join Queue"}
                        </Text>
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
    joinButtonMuted: {
        backgroundColor: "#9aa0aa",
    },
    joinButtonText: {
        color: "#ffffff",
        fontSize: 13,
        fontWeight: "700",
    },
    errorText: {
        color: "#ff626a",
        fontSize: 13,
        marginBottom: 12,
    },
});
