import BottomBar from "@/components/bottom-bar";
import Header from "@/components/header";
import { LoaderScreen } from "@/components/loading-screen";
import NotificacionCard from "@/components/notificacion-card";
import { useUser } from "@/context/UserContext";
import { marcarComoLeida, useNotifications } from "@/hooks/useNotifications";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const NotificacionesScreen: React.FC = () => {
    const { matricula } = useUser();
    const Notificaciones_Icon = require("@/assets/images/notificacion.png");
    const safeMatricula = matricula ?? "";

    const { notificaciones, loading, fetchNotis } = useNotifications(safeMatricula);

    // 🔥 Estado de pestaña seleccionada
    const [selectedTab, setSelectedTab] = useState<"recibidas" | "leidas">("recibidas");

    if (loading) {
        return <LoaderScreen iconSource={Notificaciones_Icon} />;
    }

    // 🔎 Filtrar según pestaña
    const notisRecibidas = notificaciones.filter((n: any) => !n.leida);
    const notisLeidas = notificaciones.filter((n: any) => n.leida);

    const listadoActual = selectedTab === "recibidas" ? notisRecibidas : notisLeidas;

    return (
        <View style={styles.container}>
            <Header />

            {/* 🔥 TABS con estilo PRIME (relleno rosita + división) */}
            <View style={styles.tabsBar}>

                {/* RECIBIDAS */}
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        selectedTab === "recibidas" && styles.tabButtonActive
                    ]}
                    onPress={() => setSelectedTab("recibidas")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            selectedTab === "recibidas" && styles.tabTextActive
                        ]}
                    >
                        Recibidas
                    </Text>
                </TouchableOpacity>

                {/* DIVISIÓN VERTICAL */}
                <View style={styles.tabDivider} />

                {/* LEÍDAS */}
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        selectedTab === "leidas" && styles.tabButtonActive
                    ]}
                    onPress={() => setSelectedTab("leidas")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            selectedTab === "leidas" && styles.tabTextActive
                        ]}
                    >
                        Leídas
                    </Text>
                </TouchableOpacity>

            </View>


            {/* 🔥 LISTA DE NOTIFICACIONES */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
            >
                {listadoActual.length === 0 ? (
                    <NotificacionCard
                        titulo="Sin notificaciones"
                        descripcion={
                            selectedTab === "recibidas"
                                ? "No tienes notificaciones nuevas."
                                : "No tienes notificaciones leídas."
                        }
                        fecha=""
                        leida={true}
                    />
                ) : (
                    listadoActual.map((item: any) => (
                        <NotificacionCard
                            key={item.id}
                            titulo={item.titulo}
                            descripcion={item.mensaje}
                            fecha={new Date(item.fecha).toLocaleDateString("es-MX", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                            leida={item.leida}
                            onMarkRead={
                                !item.leida
                                    ? async () => {
                                        await marcarComoLeida(item.id);
                                        fetchNotis();
                                    }
                                    : undefined
                            }
                        />
                    ))
                )}
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
        marginTop: 8,
    },

    tabsBar: {
        flexDirection: "row",
        width: "100%",
        backgroundColor: "#f7e5ec",
        alignItems: "center",
    },

    tabButton: {
        width: "50%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        backgroundColor: "#f7e5ec",
    },

    tabButtonActive: {
        backgroundColor: "#ffb2d9ff",
    },

    tabText: {
        fontSize: 16,
        color: "#A30052",
        fontFamily: "Roboto_700Bold",
    },

    tabTextActive: {
        color: "#A30052",
    },

    tabDivider: {
        width: 4,
        height: "100%",
        backgroundColor: "#d6c2ca",
    },

});

export default NotificacionesScreen;
