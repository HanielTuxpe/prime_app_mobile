import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import BottomBar from "./bottom-bar";
import Header from "./header";

interface LoaderScreenProps {
    iconSource: ImageSourcePropType; // ✅ Imagen recibida como parámetro
    gradientColors?: string[];       // Opcional: puedes cambiar el fondo
}

export const LoaderScreen: React.FC<LoaderScreenProps> = ({
    iconSource,
    gradientColors = ["#7b0029", "#A30052"],
}) => {
    const fadeAnim = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.6,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <LinearGradient colors={["#dfdfdfff", "#ffffffff"]} style={styles.loaderContainer}>
                <Animated.View style={[styles.iconContainer, { opacity: fadeAnim }]}>
                    <Image source={iconSource} style={styles.icon} resizeMode="contain" />
                </Animated.View>
                <ActivityIndicator size="large" color="#fff" style={{ marginTop: 25 }} />
            </LinearGradient>
            <BottomBar />
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "rgba(255, 255, 255, 0.12)",
    },
    icon: {
        width: 80,
        height: 80,
    },
});
