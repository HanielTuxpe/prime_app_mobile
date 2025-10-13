import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Colors, Fonts, Theme } from "../constants/theme";

const { width } = Dimensions.get("window");

const PrimeBanner: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Lado vino (izquierda con diagonal y zoom del logo) */}
            <View style={styles.leftContainer}>
                <LinearGradient
                    colors={["#7b0029", "#921F45"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBackground}
                >
                    <Image
                        source={require("../assets/images/prime-banner.jpeg")}
                        style={styles.image}
                        resizeMode="cover"
                    />

                    {/* Máscaras */}
                    <View style={styles.diagonalOverlayY} />
                    <View style={styles.diagonalOverlayX} />
                    <View style={styles.diagonalOverlay1} />
                    <View style={styles.diagonalOverlay2} />
                </LinearGradient>
            </View>

            {/* Lado dorado (texto institucional) */}
            <View style={styles.rightContainer}>
                <Text style={styles.text}>
                    PRIME es una plataforma integral para estudiantes y docentes
                    de la UTHH. Ofrece herramientas para monitoreo académico, reportes
                    expecificos y demás, mejorando la experiencia educativa
                    con tecnología accesible.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "95%",
        height: 120,
        alignSelf: "center",
        borderRadius: 18,
        overflow: "hidden",
        marginVertical: 20,
        backgroundColor: "#BC955B",
        elevation: 6,
    },

    leftContainer: {
        flex: 0.55,
        overflow: "hidden",
        position: "relative",
        borderTopLeftRadius: 18,
        borderBottomLeftRadius: 18,
    },

    gradientBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },

    image: {
        width: width * 0.38,
        height: "80%",
        opacity: 0.92,
        transform: [
            { scale: 1.2 },
            { translateX: -8 },
        ],
    },

    // Simula el corte diagonal hacia el lado dorado
    diagonalOverlayY: {
        position: "absolute",
        right: 7,
        top: 30,
        width: 15,
        height: "100%",
        backgroundColor: "#BC955B",
        transform: [{ skewY: "33deg" }],
    },

    diagonalOverlay1: {
        position: "absolute",
        right: -15,
        top: 30,
        width: 16,
        height: "100%",
        backgroundColor: "#BC955B",
        transform: [{ skewY: "33deg" }],
    },

    diagonalOverlay2: {
        position: "absolute",
        right: -15,
        top: -30,
        width: 16,
        height: "100%",
        backgroundColor: "#BC955B",
        transform: [{ skewY: "-33deg" }],
    },

    diagonalOverlayX: {
        position: "absolute",
        right: 7,
        top: -30,
        width: 15,
        height: "100%",
        backgroundColor: "#BC955B",
        transform: [{ skewY: "-33deg" }],
    },

    rightContainer: {
        flex: 0.5,
        backgroundColor: "#BC955B",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
    },

    text: {
        color: "#fff",
        fontSize: 12,
        lineHeight: 12,
        textAlign: "center",
        fontFamily: Fonts.bold,
        fontWeight: "bold",
    },
});

export default PrimeBanner;
