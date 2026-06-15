// components/OnboardingSlider.tsx
import PrimaryButton from "@/components/ui/PrimaryButton";
import React, { useRef, useState } from "react";

import {
    FlatList,
    Image,
    ImageSourcePropType,
    DimensionValue,
    NativeScrollEvent,
    NativeSyntheticEvent,
    SafeAreaView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

const brandingImage = require("../../assets/images/Branding.png");

export type Slide = {
    id: string;
    title: string;
    description: string;
    image: ImageSourcePropType;
    imageHeight?: number;
    imageWidth?: DimensionValue;
};

type Props = {
    slides: Slide[];
    onDone?: () => void;
};

const OnboardingSlider: React.FC<Props> = ({ slides, onDone }) => {
    const { width } = useWindowDimensions();
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
            <View style={styles.logoWrap}>
                <Image source={brandingImage} style={styles.logo} resizeMode="contain" />
            </View>

            <View style={styles.imageWrap}>
                <Image
                    source={item.image}
                    style={[
                        styles.image,
                        {
                            height: item.imageHeight ?? 190,
                            width: item.imageWidth ?? "82%",
                        },
                    ]}
                    resizeMode="contain"
                />
            </View>

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
        backgroundColor: "#ffffff",
        paddingBottom: 58,
    },
    slide: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 34,
        paddingTop: 26,
    },
    logoWrap: {
        minHeight: 112,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    logo: {
        width: 190,
        height: 108,
    },
    imageWrap: {
        width: "100%",
        minHeight: 185,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    image: {
        maxWidth: "100%",
    },
    title: {
        color: "#26262b",
        fontSize: 15,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 18,
    },
    description: {
        color: "#15151a",
        fontSize: 12,
        lineHeight: 15,
        textAlign: "center",
        paddingHorizontal: 3,
    },
    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 30,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#d9d6ce",
        marginHorizontal: 3,
    },
    dotActive: {
        backgroundColor: "#3b73d9",
    },
});

export default OnboardingSlider;
