// components/OnboardingSlider.tsx
import PrimaryButton from "@/components/ui/PrimaryButton";
import React, { useRef, useState } from "react";

import {
    Dimensions,
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";



const { width } = Dimensions.get("window");

export type Slide = {
    id: string;
    title: string;
    description: string;
    image: any; // require("..."), or { uri: string }
};

type Props = {
    slides: Slide[];
    onDone?: () => void; // called on last slide button press
};

const OnboardingSlider: React.FC<Props> = ({ slides, onDone }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const listRef = useRef<FlatList<Slide>>(null);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            listRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            onDone?.();
        }
    };

    const renderItem = ({ item }: { item: Slide }) => (
        <View style={[styles.slide, { width }]}>
            {/* Logo - replace with your own if you like */}
            <Text style={styles.logo}>Beauty Spot</Text>

            <Image source={item.image} style={styles.image} resizeMode="contain" />

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <FlatList
                    ref={listRef}
                    data={slides}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                />

                {/* Dots */}
                <View style={styles.dotsContainer}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex && styles.dotActive,
                            ]}
                        />
                    ))}
                </View>

                {/* Button */}
                <PrimaryButton
                    label={
                        currentIndex === slides.length - 1 ? "GET STARTED" : "NEXT"
                    }
                    onPress={handleNext}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    slide: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 40,
    },
    logo: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 24,
    },
    image: {
        width: "100%",
        height: 230,
        marginBottom: 32,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        textAlign: "center",
        color: "#555",
        paddingHorizontal: 8,
    },
    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#ccc",
        marginHorizontal: 4,
    },
    dotActive: {
        width: 16,
        backgroundColor: "#007bff",
    },
});

export default OnboardingSlider;
