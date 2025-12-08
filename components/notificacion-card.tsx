import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NotificacionCardProps {
    titulo: string;
    descripcion?: string;
    fecha: string;
    icono?: any;
    leida?: boolean;
    onMarkRead?: () => void;
}

const NotificacionCard: React.FC<NotificacionCardProps> = ({
    titulo,
    descripcion,
    fecha,
    icono,
    leida,
    onMarkRead
}) => {
    return (
        <View style={styles.wrapper}>
            <LinearGradient
                colors={["#7b0029", "#A30052"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.card}
            >
                {/* ICONO */}
                <View style={styles.iconContainer}>
                    <Image
                        source={icono || require("@/assets/images/notificacion.png")}
                        style={styles.icon}
                    />
                </View>

                {/* TEXTO */}
                <View style={styles.textContainer}>
                    <Text style={styles.titulo}>{titulo}</Text>
                    <Text style={styles.descripcion}>{descripcion}</Text>
                    <Text style={styles.fecha}>{fecha}</Text>
                </View>

                {/* BOTÓN ABAJO DERECHA */}
                {!leida && onMarkRead && (
                    <TouchableOpacity style={styles.button} onPress={onMarkRead}>
                        <Text style={styles.buttonText}>Marcar como leída</Text>
                    </TouchableOpacity>
                )}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 10,
        marginVertical: 6,
    },
    card: {
        flexDirection: "row",
        alignItems: "flex-start",
        borderRadius: 16,
        padding: 12,
        paddingBottom: 40, // espacio para el botón
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        position: "relative"
    },
    iconContainer: {
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 50,
        padding: 10,
        marginRight: 12,
    },
    icon: {
        width: 28,
        height: 28,
        tintColor: "#fff",
    },
    textContainer: {
        flex: 1,
    },
    titulo: {
        fontFamily: "Roboto_700Bold",
        fontSize: 15,
        color: "#fff",
        marginBottom: 2,
    },
    descripcion: {
        fontFamily: "Roboto_400Regular",
        fontSize: 13,
        color: "#fff",
    },
    fecha: {
        fontFamily: "Roboto_400Regular",
        fontSize: 12,
        color: "#ffe8f0",
        marginTop: 4,
        textAlign: "right",
    },

    button: {
        position: "absolute",
        bottom: 8,
        right: 12,
        backgroundColor: "rgba(255,255,255,0.25)",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
    }
});

export default NotificacionCard;
