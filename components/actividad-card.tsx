import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ActividadModalProps {
    visible: boolean;
    onClose: () => void;
    actividades: any[] | null; // 👈 ahora es array
    obtenerColorMateria: (materia: string) => string; // 👈 pasamos el método del HomeScreen
}

const ActividadModal: React.FC<ActividadModalProps> = ({
    visible,
    onClose,
    actividades,
    obtenerColorMateria,
}) => {
    if (!actividades || actividades.length === 0) return null;

    // Fecha del día (todas las actividades comparten fecha)
    const fecha = moment(actividades[0].FechaEntrega)
        .year(2025)
        .format("dddd, D [de] MMMM [de] YYYY");

    return (
        <Modal
            visible={visible}
            transparent
            statusBarTranslucent
            animationType="fade"
        >
            {/* Fondo gris */}
            <View style={styles.backdropRoot}>
                <Pressable style={styles.backdropFill} onPress={onClose} />

                {/* Contenido */}
                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.scroll}>
                        {/* Fecha */}
                        <Text style={styles.fecha}>{fecha}</Text>

                        {/* Múltiples actividades */}
                        {actividades.map((actividad, index) => {
                            const colorMateria = obtenerColorMateria(actividad.NomMateria);

                            return (
                                <View key={index} style={styles.actividadWrapper}>

                                    {/* Header de materia */}
                                    <View style={[styles.materiaHeader, { backgroundColor: colorMateria }]}>
                                        <Text style={styles.materiaHeaderText}>
                                            {actividad.NomMateria}
                                        </Text>
                                    </View>

                                    {/* Card */}
                                    <View style={styles.card}>

                                        <View
                                            style={[
                                                styles.puntajeTag,
                                                { backgroundColor: colorMateria },
                                            ]}
                                        >
                                            <Text style={styles.puntajeText}>
                                                {actividad.Puntaje} puntos
                                            </Text>
                                        </View>

                                        <Text style={styles.descripcion}>
                                            {actividad.Descripcion}
                                        </Text>

                                        <Text style={styles.infoExtra}>
                                            ID: {actividad.IdActividad}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>

                    {/* Botón cerrar */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <LinearGradient
                            colors={["#7b0029", "#A30052"]}
                            style={styles.closeGradient}
                        >
                            <Text style={styles.closeText}>Cerrar</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdropRoot: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    backdropFill: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
    },

    modalContainer: {
        width: "90%",
        maxHeight: "85%",
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 20,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        zIndex: 2,
    },

    scroll: {
        paddingBottom: 20,
    },

    fecha: {
        textAlign: "center",
        color: "#7b0029",
        fontFamily: "Roboto_700Bold",
        fontSize: 16,
        marginBottom: 18,
        textTransform: "capitalize",
    },

    actividadWrapper: {
        marginBottom: 20,
    },

    materiaHeader: {
        padding: 10,
        borderRadius: 6,
        alignItems: "center",
        marginBottom: 10,
    },

    materiaHeaderText: {
        color: "#fff",
        fontFamily: "Roboto_700Bold",
        fontSize: 15,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 14,
        elevation: 3,
    },

    materia: {
        color: "#7b0029",
        fontFamily: "Roboto_700Bold",
        fontSize: 15,
        marginBottom: 6,
    },

    puntajeTag: {
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        marginBottom: 10,
    },

    puntajeText: {
        color: "#fff",
        fontFamily: "Roboto_700Bold",
        fontSize: 12,
    },

    descripcion: {
        fontFamily: "Roboto_400Regular",
        fontSize: 13,
        color: "#333",
        marginBottom: 6,
    },

    infoExtra: {
        fontFamily: "Roboto_400Regular",
        fontSize: 12,
        color: "#888",
    },

    closeButton: {
        marginTop: 10,
        alignSelf: "center",
    },

    closeGradient: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 20,
    },

    closeText: {
        color: "#fff",
        fontFamily: "Roboto_700Bold",
    },
});

export default ActividadModal;
