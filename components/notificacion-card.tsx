import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NotificacionCardProps {
    titulo: string;
    descripcion: string;
    fecha: string;
    icono?: any;
    onPress?: () => void;
}

const NotificacionCard: React.FC<NotificacionCardProps> = ({
    titulo,
    descripcion,
    fecha,
    icono,
    onPress,
}) => {
    return (
        <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.8}>
            <LinearGradient
                colors={["#7b0029", "#A30052"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.card}
            >
                <View style={styles.iconContainer}>
                    {icono ? (
                        <Image source={icono} style={styles.icon} />
                    ) : (
                        <Image
                            source={require("@/assets/images/notificacion.png")}
                            style={styles.icon}
                        />
                    )}
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.titulo}>{titulo}</Text>
                    <Text style={styles.descripcion}>{descripcion}</Text>
                    <Text style={styles.fecha}>{fecha}</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchable: {
        marginHorizontal: 10,
        marginVertical: 6,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        padding: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
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
});

export default NotificacionCard;
