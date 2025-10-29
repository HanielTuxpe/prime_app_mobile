import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAlert } from "../providers/AlertProvider";

interface HeaderProps {
    title?: string;
    subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
    title = "Plataforma de Rendimiento",
    subtitle = "Integral y Monitoreo Educativo",
}) => {
    const router = useRouter();
    const { showAlert } = useAlert();

    const handleLogout = () => {
        showAlert({
            type: "warning",
            title: "Cerrar sesión",
            message: "¿Deseas cerrar tu sesión y salir de PRIME?",
            confirmText: "Sí, salir",
            cancelText: "Cancelar",
            onConfirm: async () => {
                try {
                    await AsyncStorage.clear(); // 🔹 Limpia datos guardados (matrícula, token, etc.)
                    router.replace("../(auth)/login"); // 🔹 Redirige al login
                    showAlert({
                        type: "success",
                        title: "Sesión cerrada",
                        message: "Has cerrado sesión correctamente.",
                        autoCloseMs: 2500,
                    });
                } catch (error) {
                    showAlert({
                        type: "error",
                        title: "Error",
                        message: "No se pudo cerrar la sesión. Intenta nuevamente.",
                    });
                    console.error("Error al cerrar sesión:", error);
                }
            },
        });
    };

    return (
        <LinearGradient
            colors={["#7b0029", "#c32a77ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
        >
            {/* Logo */}
            <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* Título */}
            <View style={{ flex: 1, marginLeft: 8, alignItems: "center" }}>
                <Text style={styles.headerTitle}>
                    {title}
                    {"\n"}
                    {subtitle}
                </Text>
            </View>

            {/* Botón de cierre */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <MaterialIcons name="logout" size={26} color="#fff" />
            </TouchableOpacity>
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
        fontSize: 16,
        fontFamily: "Roboto_700Bold",
        lineHeight: 18,
        textAlign: "center",
        fontWeight: "bold",
    },
    logoutButton: {
        padding: 8,
    },
});

export default Header;
