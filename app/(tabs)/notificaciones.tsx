import BottomBar from "@/components/bottom-bar";
import Header from "@/components/header";
import NotificacionCard from "@/components/notificacion-card";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const NotificacionesScreen: React.FC = () => {
    const notificaciones = [
        {
            titulo: "Nueva calificación publicada",
            descripcion: "Tu profesor ha actualizado tus calificaciones en Matemáticas.",
            fecha: "4 Nov 2025",
        },
        {
            titulo: "Recordatorio de entrega",
            descripcion: "No olvides entregar tu proyecto final antes del 10 de Noviembre.",
            fecha: "3 Nov 2025",
        },
        {
            titulo: "Aviso de rendimiento",
            descripcion: "Tu promedio ha mejorado en este cuatrimestre. ¡Buen trabajo!",
            fecha: "1 Nov 2025",
        },
    ];

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView style={styles.content}>
                {notificaciones.map((item, index) => (
                    <NotificacionCard
                        key={index}
                        titulo={item.titulo}
                        descripcion={item.descripcion}
                        fecha={item.fecha}
                    />
                ))}
            </ScrollView>
            <BottomBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        flex: 1,
        marginTop: 10,
    },
});

export default NotificacionesScreen;
