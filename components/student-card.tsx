import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface StudentCardProps {
    nombre: string;
    apaterno: string;
    amaterno: string;
    carrera: string;
    cuatrimestre: string;
    grupo: string;
    estatus?: string; // Ejemplo: "EXCELENCIA"
    iconoEstatus?: any; // Recurso local del ícono/medalla
}

export default function StudentCard({
    nombre,
    apaterno,
    amaterno,
    carrera,
    cuatrimestre,
    grupo,
    estatus,
    iconoEstatus,
}: StudentCardProps) {
    return (
        <LinearGradient
            colors={["#7b0029", "#A30052"]}
            style={styles.cardContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >

            {/* Datos del alumno */}
            <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                    <Text style={styles.label}>NOMBRE COMPLETO DEL ALUMNO</Text>
                    <Text style={styles.name}>
                        {nombre} {apaterno} {amaterno}
                    </Text>

                    <View style={styles.groupRow}>
                        <Text style={styles.subLabel}>CUATRIMESTRE: </Text>
                        <Text style={styles.value}>{cuatrimestre}°</Text>
                        <Text style={styles.subLabel}>   GRUPO: </Text>
                        <Text style={styles.value}>{grupo}</Text>
                    </View>

                    <Text style={styles.career}>{carrera}</Text>
                </View>

                {/* Estatus */}
                {estatus && (
                    <View style={styles.statusContainer}>
                        {iconoEstatus && (
                            <Image
                                source={iconoEstatus}
                                style={styles.statusIcon}
                                resizeMode="contain"
                            />
                        )}
                        <Text style={styles.statusText}>{estatus}</Text>
                    </View>
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    logo: {
        width: 50,
        height: 40,
        marginRight: 8,
    },
    headerText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 18,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    infoLeft: {
        flex: 1,
        paddingRight: 10,
    },
    label: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "600",
        marginBottom: 2,
    },
    name: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
    },
    groupRow: {
        flexDirection: "row",
        marginBottom: 4,
    },
    subLabel: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 12,
    },
    value: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "400",
    },
    career: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "400",
    },
    statusContainer: {
        alignItems: "center",
    },
    statusIcon: {
        width: 45,
        height: 45,
        marginBottom: 3,
    },
    statusText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
    },
});
