import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

const backgroundImage = require("../assets/images/login_image.png");
const brandingImage = require("../assets/images/Branding.png");

export default function WelcomeScreen() {
    const router = useRouter();
    const { width, height } = useWindowDimensions();
    const backgroundShift = useRef(new Animated.Value(0)).current;
    const tileSize = Math.max(width, height) * 0.82;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(backgroundShift, {
                toValue: 1,
                duration: 18000,
                useNativeDriver: true,
            })
        );

        animation.start();

        return () => animation.stop();
    }, [backgroundShift]);

    const translate = backgroundShift.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -tileSize],
    });

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.screen}>
                <View style={styles.backgroundClip} pointerEvents="none">
                    <Animated.View
                        style={[
                            styles.backgroundTrack,
                            {
                                width: tileSize * 2,
                                transform: [
                                    { translateX: translate },
                                    { translateY: translate },
                                ],
                            },
                        ]}
                    >
                        {Array.from({ length: 9 }).map((_, index) => (
                            <Image
                                key={index}
                                source={backgroundImage}
                                style={{ width: tileSize, height: tileSize }}
                                resizeMode="cover"
                            />
                        ))}
                    </Animated.View>
                    <View style={styles.backgroundFade} />
                </View>

                <View style={styles.content}>
                    <Image source={brandingImage} style={styles.logo} resizeMode="contain" />

                    <View style={styles.actions}>
                        <Pressable
                            style={[styles.button, styles.loginButton]}
                            onPress={() => router.push("/login")}
                        >
                            <Text style={[styles.buttonText, styles.loginText]}>Login</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.button, styles.registerButton]}
                            onPress={() => router.push("/register")}
                        >
                            <Text style={[styles.buttonText, styles.registerText]}>
                                Register
                            </Text>
                        </Pressable>
                    </View>
                </View>
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
        overflow: "hidden",
        backgroundColor: "#ffffff",
    },
    backgroundClip: {
        ...StyleSheet.absoluteFillObject,
        overflow: "hidden",
    },
    backgroundTrack: {
        flexDirection: "row",
        flexWrap: "wrap",
        opacity: 0.52,
    },
    backgroundFade: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255, 255, 255, 0.55)",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 34,
        paddingTop: 150,
    },
    logo: {
        width: 218,
        height: 124,
        marginBottom: 42,
    },
    actions: {
        width: "100%",
        gap: 22,
    },
    button: {
        minHeight: 58,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    loginButton: {
        backgroundColor: "#3b73d9",
    },
    registerButton: {
        borderWidth: 1,
        borderColor: "#111827",
        backgroundColor: "rgba(255, 255, 255, 0.72)",
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "600",
    },
    loginText: {
        color: "#ffffff",
    },
    registerText: {
        color: "#111827",
    },
});
