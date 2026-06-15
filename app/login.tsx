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

export default function LoginScreen() {
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
                                style={{
                                    width: tileSize,
                                    height: tileSize,
                                }}
                                resizeMode="cover"
                            />
                        ))}
                    </Animated.View>
                    <View style={styles.backgroundFade} />
                </View>

                <View style={styles.content}>
                    <Image
                        source={brandingImage}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <View style={styles.actions}>
                        <Pressable style={[styles.button, styles.loginButton]}>
                            <Text style={[styles.buttonText, styles.loginText]}>Login</Text>
                        </Pressable>

                        <Pressable style={[styles.button, styles.registerButton]}>
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
        opacity: 0.48,
    },
    backgroundFade: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255, 255, 255, 0.58)",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 22,
        paddingTop: 130,
    },
    logo: {
        width: 176,
        height: 104,
        marginBottom: 28,
    },
    actions: {
        width: "100%",
        gap: 18,
    },
    button: {
        minHeight: 48,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
    },
    loginButton: {
        backgroundColor: "#3b73d9",
    },
    registerButton: {
        borderWidth: 1,
        borderColor: "#202124",
        backgroundColor: "rgba(255, 255, 255, 0.72)",
    },
    buttonText: {
        fontSize: 12,
        fontWeight: "600",
    },
    loginText: {
        color: "#ffffff",
    },
    registerText: {
        color: "#111111",
    },
});
