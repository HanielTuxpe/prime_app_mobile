import BottomBar from "@/components/bottom-bar";
import Header from "@/components/header";
import React, { useEffect, useState, useRef } from "react";
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from "react-native";
import StudentCard from "@/components/student-card";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { useAlert } from "../../providers/AlertProvider";
import { LoaderScreen } from "@/components/loading-screen";
import { CameraView, useCameraPermissions } from "expo-camera";

const PerfilScreen: React.FC = () => {
    const { matricula } = useUser();
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState<any>(null);
    const URL_BASE = "https://prime-api-iawe.onrender.com";
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    // 🔹 Animación del láser
    const laserAnim = useRef(new Animated.Value(0)).current;



    useEffect(() => {
        if (!permission) return;
        if (!permission.granted) {
            requestPermission();
        }
    }, [permission]);

    const handleBarcodeScanned = ({ data, type }: { data: string; type: string }) => {
        if (scanned) return;
        setScanned(true);

        console.log("✅ QR detectado:", { type, data });

        // Mensaje institucional personalizado
        showAlert({
            title: "✅ Asistencia registrada",
            message: `Bienvenido, disfruta tu día.\n\nCódigo escaneado: ${data}`,
            type: "success",
        });
    };


    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(laserAnim, {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(laserAnim, {
                    toValue: 0,
                    duration: 2500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [laserAnim]);

    const translateY = laserAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 180], // movimiento vertical dentro del marco
    });


    useEffect(() => {
        if (matricula) {
            fetchStudent();
        }
    }, [matricula]);

    const fetchStudent = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${URL_BASE}/Fulldata/?matricula=${matricula}`);
            setStudent(res.data.data[0]);
            console.log("✅ Datos del alumno obtenidos:", res.data.data[0]);
        } catch (e) {
            showAlert({
                title: "Error",
                message: "No se pudo obtener información del alumno",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <LoaderScreen iconSource={require("@/assets/images/perfil.png")} />
        );
    }

    if (!student) {
        return (
            <View style={styles.container}>
                <Header />
                <Text style={styles.errorText}>No se encontró información del alumno.</Text>
                <BottomBar />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scroll}>
                <StudentCard
                    nombre={student.Nombre}
                    apaterno={student.APaterno}
                    amaterno={student.AMaterno}
                    carrera={student.NombreCarrera}
                    cuatrimestre={student.Cuatrimestre}
                    grupo={student.Grupo}
                />

                <View style={styles.qrSection}>
                    <Text style={styles.qrTitle}>ESCANEA TU CÓDIGO QR</Text>

                    <View style={styles.qrFrame}>
                        {/* Cámara */}
                        {permission?.granted ? (
                            <CameraView
                                style={StyleSheet.absoluteFill}
                                facing="back"
                                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                            />
                        ) : (
                            <View style={styles.permissionBox}>
                                <Text style={styles.permissionTitle}>Permiso de cámara</Text>
                                <Text style={styles.permissionText}>
                                    Necesitamos acceso a tu cámara para escanear el código QR.
                                </Text>
                                <Text onPress={requestPermission} style={styles.permissionButton}>
                                    Conceder permiso
                                </Text>
                            </View>
                        )}

                        {/* Láser animado */}
                        <Animated.View style={[styles.laser, { transform: [{ translateY }] }]} />

                        {/* Esquinas del marco */}
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>

                    <Text style={styles.qrLegend}>
                        Escanea tu QR para registrar tu asistencia al plantel
                    </Text>
                </View>

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
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 16,
        fontFamily: "Roboto_500Medium",
        color: "#7b0029",
    },
    scroll: { padding: 16, paddingBottom: 90 },
    errorText: { textAlign: "center", color: "#df2222", fontFamily: "Roboto_500Medium" },
    qrSection: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 80,
    },

    qrTitle: {
        fontSize: 22,
        fontFamily: "Roboto_700Bold",
        color: "#7b0029",
        marginBottom: 20,
        letterSpacing: 1,
    },

    qrFrame: {
        width: 340,
        height: 340,
        borderWidth: 2,
        borderColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "rgba(0,0,0,0.3)", // leve oscurecimiento para contraste
        borderRadius: 12,
    },

    laser: {
        position: "absolute",
        top: 0,
        left: 15,
        right: 15,
        height: 3,
        backgroundColor: "#E60073",
        shadowColor: "#E60073",
        shadowOpacity: 0.9,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
    },

    corner: {
        position: "absolute",
        width: 60,
        height: 60,
        borderColor: "#7b0029",
        borderRadius: 2,
    },

    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 5,
        borderLeftWidth: 5,
    },

    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 5,
        borderRightWidth: 5,
    },

    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 5,
        borderLeftWidth: 5,
    },

    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 5,
        borderRightWidth: 5,
    },

    qrLegend: {
        fontFamily: "Roboto_500Medium",
        fontSize: 15,
        color: "#7b0029",
        marginTop: 18,
        textAlign: "center",
        width: "80%",
    },

    // UI de permiso
    permissionBox: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    permissionTitle: {
        color: "#fff",
        fontFamily: "Roboto_700Bold",
        fontSize: 16,
        marginBottom: 6,
    },
    permissionText: {
        color: "#eee",
        fontFamily: "Roboto_400Regular",
        textAlign: "center",
        marginBottom: 12,
    },
    permissionButton: {
        color: "#fff",
        backgroundColor: "#7b0029",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        fontFamily: "Roboto_700Bold",
    },

});

export default PerfilScreen;
