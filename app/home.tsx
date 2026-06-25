import { Ionicons } from "@expo/vector-icons";
import BottomNav from "@/components/ui/BottomNav";
import { useRouter } from "expo-router";
import React from "react";
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

const services = [
    {
        name: "Haircut",
        image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=240&q=80",
    },
    {
        name: "Nails",
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=240&q=80",
    },
    {
        name: "Facial",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=240&q=80",
    },
    {
        name: "Spa",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=240&q=80",
    },
    {
        name: "Waxing",
        image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=240&q=80",
    },
    {
        name: "Makeup",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=240&q=80",
    },
    {
        name: "Shave",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=240&q=80",
    },
    {
        name: "Hair Color",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=240&q=80",
    },
    {
        name: "Head Massage",
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=240&q=80",
    },
    {
        name: "Massage",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=240&q=80",
    },
    {
        name: "Hair Wash",
        image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=240&q=80",
    },
    {
        name: "Skin Care",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=240&q=80",
    },
];

export default function HomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.screen}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <View style={styles.greeting}>
                            <Text style={styles.title}>Hello, Dendup</Text>
                            <Text style={styles.subtitle}>
                                Find the service you want, and{"\n"}treat yourself
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

                    <View style={styles.searchBox}>
                        <Ionicons name="search-outline" size={19} color="#6f7378" />
                        <TextInput
                            placeholder="Search"
                            placeholderTextColor="#676b70"
                            style={styles.searchInput}
                        />
                    </View>

                    <View style={styles.categoryBar}>
                        <Pressable style={[styles.categoryItem, styles.categoryActive]}>
                            <Ionicons name="layers-outline" size={20} color="#3b73d9" />
                            <Text style={[styles.categoryText, styles.categoryTextActive]}>
                                All
                            </Text>
                        </Pressable>
                        <Pressable style={styles.categoryItem}>
                            <Ionicons name="cut-outline" size={20} color="#5d6065" />
                            <Text style={styles.categoryText}>Barber</Text>
                        </Pressable>
                        <Pressable style={styles.categoryItem}>
                            <Ionicons name="brush-outline" size={20} color="#5d6065" />
                            <Text style={styles.categoryText}>Beauty</Text>
                        </Pressable>
                    </View>

                    <View style={styles.grid}>
                        {services.map((service) => (
                            <Pressable
                                key={service.name}
                                style={styles.service}
                                onPress={() =>
                                    router.push({
                                        pathname: "/service-profile",
                                        params: {
                                            name: service.name,
                                            image: service.image,
                                        },
                                    })
                                }
                            >
                                <Image source={{ uri: service.image }} style={styles.serviceImage} />
                                <Text style={styles.serviceText}>{service.name}</Text>
                            </Pressable>
                        ))}
                    </View>
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
});
