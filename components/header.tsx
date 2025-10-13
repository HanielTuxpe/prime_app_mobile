import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface HeaderProps {
    title?: string;
    subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
    title = "Plataforma de Rendimiento",
    subtitle = "Integral y Monitoreo Educativo",
}) => {
    return (
        <LinearGradient colors={["#7b0029", "#c32a77ff"]}  start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }} style={styles.header}>
            <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />
            <View style={{ flex: 1, marginLeft: 8, alignItems: "center", }}>
                <Text style={styles.headerTitle}>
                    {title}
                    {"\n"}
                    {subtitle}
                </Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    logo: {
        width: 60,
        height: 60,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Roboto_700Bold",
        lineHeight: 18,
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default Header;
