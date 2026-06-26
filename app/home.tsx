import { Ionicons } from "@expo/vector-icons";
import { currentUser } from "@/app/api/auth";
import {
    AdminService,
    ServiceCategory,
    listCategories,
    listServices,
} from "@/app/api/services";
import BottomNav from "@/components/ui/BottomNav";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const avatarImage =
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80";
const fallbackServiceImage =
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=240&q=80";

type CustomerService = AdminService & {
    categoryName: string;
};

const isCustomerCategory = (category: ServiceCategory) => {
    const name = category.name.toLowerCase();
    return name.includes("barber") || name.includes("beauty");
};

const getCategoryIcon = (categoryName: string) => {
    return categoryName.toLowerCase().includes("barber")
        ? "cut-outline"
        : "brush-outline";
};

export default function HomeScreen() {
    const router = useRouter();
    const [customerName, setCustomerName] = useState("Customer");
    const [creditScore, setCreditScore] = useState<number | null>(null);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [services, setServices] = useState<CustomerService[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadDashboard = async () => {
            setIsLoading(true);
            setError("");

            try {
                const [user, nextCategories] = await Promise.all([
                    currentUser(),
                    listCategories(),
                ]);
                const customerCategories = nextCategories.filter(
                    (category) => isCustomerCategory(category),
                );
                const serviceGroups = await Promise.all(
                    customerCategories.map(async (category) => {
                        const categoryServices = await listServices(category.id);
                        return categoryServices.map((service) => ({
                            ...service,
                            categoryName: category.name,
                        }));
                    }),
                );

                if (!mounted) {
                    return;
                }

                setCustomerName(user.username || "Customer");
                setCreditScore(user.credit_score ?? null);
                setCategories(customerCategories);
                setServices(serviceGroups.flat());
                setActiveCategoryId(customerCategories[0]?.id ?? null);
            } catch {
                if (mounted) {
                    setError("Unable to load services right now.");
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        loadDashboard();

        return () => {
            mounted = false;
        };
    }, []);

    const visibleServices = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLowerCase();

        return services.filter((service) => {
            const matchesCategory =
                !activeCategoryId || service.category_id === activeCategoryId;
            const matchesSearch =
                !normalizedSearch ||
                service.name.toLowerCase().includes(normalizedSearch);

            return matchesCategory && matchesSearch;
        });
    }, [activeCategoryId, searchQuery, services]);
    const activeCategory = useMemo(
        () =>
            categories.find((category) => category.id === activeCategoryId) ??
            null,
        [activeCategoryId, categories],
    );
    const selectedCategoryInactive = activeCategory?.active === false;

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.screen}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <View style={styles.greeting}>
                            <Text style={styles.title}>Hello, {customerName}</Text>
                            <Text style={styles.subtitle}>
                                Find the service you want, and{"\n"}treat yourself
                            </Text>
                        </View>

                        <View style={styles.scoreWrap}>
                            <View style={styles.scoreRing}>
                                <Text style={styles.scoreText}>
                                    {creditScore ?? "-"}
                                </Text>
                            </View>
                            <Image source={{ uri: avatarImage }} style={styles.avatar} />
                        </View>
                    </View>

                    <View style={styles.searchBox}>
                        <Ionicons name="search-outline" size={19} color="#6f7378" />
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search"
                            placeholderTextColor="#676b70"
                            style={styles.searchInput}
                        />
                    </View>

                    <View style={styles.categoryBar}>
                        {categories.map((category) => {
                            const active = activeCategoryId === category.id;

                            return (
                                <Pressable
                                    key={category.id}
                                    style={[
                                        styles.categoryItem,
                                        active ? styles.categoryActive : undefined,
                                    ]}
                                    onPress={() => setActiveCategoryId(category.id)}
                                >
                                    <Ionicons
                                        name={getCategoryIcon(category.name)}
                                        size={20}
                                        color={active ? "#3b73d9" : "#5d6065"}
                                    />
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            active
                                                ? styles.categoryTextActive
                                                : undefined,
                                        ]}
                                    >
                                        {category.name}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    {isLoading ? (
                        <ActivityIndicator color="#3b73d9" />
                    ) : error ? (
                        <Text style={styles.emptyText}>{error}</Text>
                    ) : selectedCategoryInactive ? (
                        <Text style={styles.emptyText}>
                            This service is inactive right now.
                        </Text>
                    ) : (
                        <View style={styles.grid}>
                            {visibleServices.map((service) => (
                                <Pressable
                                    key={service.id}
                                    style={styles.service}
                                    onPress={() =>
                                        router.push({
                                            pathname: "/service-profile",
                                            params: {
                                                name: service.name,
                                                image:
                                                    service.img ||
                                                    fallbackServiceImage,
                                            },
                                        })
                                    }
                                >
                                    <Image
                                        source={{
                                            uri: service.img || fallbackServiceImage,
                                        }}
                                        style={styles.serviceImage}
                                    />
                                    <Text style={styles.serviceText}>
                                        {service.name}
                                    </Text>
                                </Pressable>
                            ))}

                            {!visibleServices.length ? (
                                <Text style={styles.emptyText}>
                                    No services available
                                </Text>
                            ) : null}
                        </View>
                    )}
                </ScrollView>

                <BottomNav active="home" />
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
        paddingTop: 54,
        paddingBottom: 104,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    greeting: {
        flex: 1,
    },
    title: {
        color: "#111111",
        fontSize: 24,
        fontWeight: "800",
        marginBottom: 10,
    },
    subtitle: {
        color: "#6d7075",
        fontSize: 12,
        lineHeight: 16,
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
    searchBox: {
        height: 42,
        borderRadius: 21,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e4e4e4",
        paddingHorizontal: 13,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        height: "100%",
        marginLeft: 7,
        color: "#111111",
        fontSize: 12,
    },
    categoryBar: {
        height: 58,
        borderRadius: 29,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#dedede",
        padding: 6,
        marginBottom: 24,
    },
    categoryItem: {
        flex: 1,
        height: 46,
        borderRadius: 23,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    categoryActive: {
        backgroundColor: "#ffffff",
    },
    categoryText: {
        color: "#5d6065",
        fontSize: 12,
    },
    categoryTextActive: {
        color: "#3b73d9",
        fontWeight: "700",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: 20,
    },
    service: {
        width: "30.5%",
        alignItems: "center",
    },
    serviceImage: {
        width: 78,
        height: 78,
        borderRadius: 39,
        backgroundColor: "#eeeeee",
        marginBottom: 9,
    },
    serviceText: {
        color: "#111111",
        fontSize: 13,
        textAlign: "center",
    },
    emptyText: {
        width: "100%",
        color: "#6d7075",
        fontSize: 13,
        textAlign: "center",
        paddingVertical: 24,
    },
});
