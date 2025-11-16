import BottomBar from "@/components/bottom-bar";
import Header from "@/components/header";
import StudentPDFGenerator from "@/components/student-pdf-generator";
import StudentCard from "@/components/student-card";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useUser } from "../../context/UserContext";
import { useAlert } from "../../providers/AlertProvider";
import * as WebBrowser from "expo-web-browser";
import { LoaderScreen } from "@/components/loading-screen";

const URL_BASE = "";

const HistorialScreen: React.FC = () => {
    const { matricula } = useUser();
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState<any>(null);
    const [cuatrimestresData, setCuatrimestresData] = useState<any>({});
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [periodos, setPeriodos] = useState<any>({});
    const [promedios, setPromedios] = useState<any>({});
    const URL_BASE = "https://prime-api-iawe.onrender.com";

    const MEDALLA_PLATA = require("@/assets/images/MEDALLA_PLATA.png");
    const MEDALLA_MORADO = require("@/assets/images/MEDALLA_MORADO.png");
    const MEDALLA_VERDE = require("@/assets/images/MEDALLA_VERDE.png");
    const MEDALLA_ROJA = require("@/assets/images/MEDALLA_ROJA.png");
    const Calificaciones_Icon = require("@/assets/images/calificaciones.png");


    const cuatrimestreMap: Record<string, string> = {
        "1": "1er Cuatrimestre",
        "2": "2do Cuatrimestre",
        "3": "3er Cuatrimestre",
        "4": "4to Cuatrimestre",
        "5": "5to Cuatrimestre",
        "6": "6to Cuatrimestre",
        "7": "7mo Cuatrimestre",
        "8": "8vo Cuatrimestre",
        "9": "9no Cuatrimestre",
    };

    useEffect(() => {
        if (matricula) {
            fetchStudent();
            fetchHistorial();
        }
    }, [matricula]);

    const fetchStudent = async () => {
        try {
            const res = await axios.get(`${URL_BASE}/Fulldata/?matricula=${matricula}`);
            setStudent(res.data.data[0]);
            console.log("✅ Datos del alumno obtenidos:", res.data.data[0]);
        } catch (e) {
            showAlert({ title: "Error", message: "No se pudo obtener información del alumno", type: "error" });
        }
    };

    const fetchHistorial = async () => {
        try {
            const res = await axios.get(`${URL_BASE}/fullHistorial/?matricula=${matricula}`);
            if (res.data?.data) formatData(res.data.data);
        } catch (e) {
            showAlert({ title: "Error", message: "Error al obtener historial académico", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    interface GradeResult {
        tipo: 'OR' | 'E1' | 'E2' | 'E3' | 'N/A';
        cal: number;
    }

    interface FormattedData {
        materias: {
            materia: string;
            p1: GradeResult;
            p2: GradeResult;
            p3: GradeResult;
            final: number;
        }[];
        sum: number;
        count: number;
    }

    interface SubjectData {
        Cuatrimestre: string;
        Parcial1: number;
        Parcial1E1: number;
        Parcial1E2: number;
        Parcial1E3: number;
        Parcial2: number;
        Parcial2E1: number;
        Parcial2E2: number;
        Parcial2E3: number;
        Parcial3: number;
        Parcial3E1: number;
        Parcial3E2: number;
        Parcial3E3: number;
        PromedioFinal: number;
        Materia: string;
        Periodo: string;
    }

    const formatData = (data: SubjectData[]) => {
        const formatted: Record<string, FormattedData> = {};
        const promediosTemp: Record<string, string> = {};
        const periodosTemp: Record<string, string> = {};

        data.forEach((item) => {
            const cuatri = cuatrimestreMap[item.Cuatrimestre] || item.Cuatrimestre;
            const getBest = (normal: number, e1: number, e2: number, e3: number): GradeResult => {
                if (normal >= 6) return { tipo: "OR", cal: normal };
                if (e1 >= 6) return { tipo: "E1", cal: e1 };
                if (e2 >= 6) return { tipo: "E2", cal: e2 };
                if (e3 >= 6) return { tipo: "E3", cal: e3 };
                return { tipo: "N/A", cal: normal };
            };

            const p1 = getBest(item.Parcial1, item.Parcial1E1, item.Parcial1E2, item.Parcial1E3);
            const p2 = getBest(item.Parcial2, item.Parcial2E1, item.Parcial2E2, item.Parcial2E3);
            const p3 = getBest(item.Parcial3, item.Parcial3E1, item.Parcial3E2, item.Parcial3E3);

            if (!formatted[cuatri]) {
                formatted[cuatri] = { materias: [], sum: 0, count: 0 };
                periodosTemp[cuatri] = item.Periodo;
            }

            formatted[cuatri].materias.push({
                materia: item.Materia,
                p1,
                p2,
                p3,
                final: item.PromedioFinal,
            });
            formatted[cuatri].sum += item.PromedioFinal;
            formatted[cuatri].count += 1;
        });

        Object.keys(formatted).forEach((c) => {
            promediosTemp[c] = (formatted[c].sum / formatted[c].count).toFixed(2);
        });

        setCuatrimestresData(formatted);
        setPromedios(promediosTemp);
        setPeriodos(periodosTemp);
        setSelectedSemester(Object.keys(formatted).pop() || "");
    };

    const handleGenerateBoleta = async () => {
        try {
            const response = await fetch(`${URL_BASE}/generateBoletaPDF`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student,
                    cuatrimestre: selectedSemester,
                    materias: cuatrimestresData[selectedSemester].materias,
                    promedio: promedios[selectedSemester],
                    periodo: periodos[selectedSemester],
                }),
            });

            const data = await response.json();
            if (!data.success) throw new Error("Error al generar PDF");
            console.log("✅ Boleta generada:", data);

            const url = `${URL_BASE}/downloadBoletaPDF/?file=${encodeURIComponent(data.fileName)}`;
            await WebBrowser.openBrowserAsync(url);
        } catch (error) {
            console.error("❌ Error al generar boleta:", error);
            showAlert({
                title: "Error",
                message: "Ocurrió un problema al generar el PDF de la boleta.",
                type: "error",
            });
        }
    };

    const handleGenerateHistorial = async () => {
        try {
            const response = await fetch(`${URL_BASE}/generateHistorialPDF`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student,
                    cuatrimestresData,
                    promedios,
                    periodos,
                }),
            });

            if (!response.ok) throw new Error("No se pudo generar el historial");

            const blob = await response.blob();
            const pdfUrl = URL.createObjectURL(blob);
            await WebBrowser.openBrowserAsync(pdfUrl);
        } catch (error) {
            console.error("❌ Error al generar historial:", error);
            showAlert({
                title: "Error",
                message: "Ocurrió un problema al generar el PDF del historial.",
                type: "error",
            });
        }
    };

    if (loading) {
        return (
            <LoaderScreen iconSource={Calificaciones_Icon}/>
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

    // Función para determinar la medalla según el promedio
    const getEstatusImage = (promedio: number) => {
        if (promedio >= 9) return { src: MEDALLA_PLATA, alt: "Excelente" };
        if (promedio >= 8) return { src: MEDALLA_MORADO, alt: "Bueno" };
        if (promedio >= 7) return { src: MEDALLA_VERDE, alt: "Regular" };
        return { src: MEDALLA_ROJA, alt: "Necesita mejorar" };
    };

    const currentData = cuatrimestresData[selectedSemester];

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scroll}>
                {/* 🔹 Tarjeta del alumno */}
                {selectedSemester && promedios[selectedSemester] && (
                    (() => {
                        const promedioCuatri = parseFloat(promedios[selectedSemester]);
                        const estatus = getEstatusImage(promedioCuatri);
                        return (
                            <StudentCard
                                nombre={student.Nombre}
                                apaterno={student.APaterno}
                                amaterno={student.AMaterno}
                                carrera={student.NombreCarrera}
                                cuatrimestre={student.Cuatrimestre}
                                grupo={student.Grupo}
                                estatus={estatus.alt}
                                iconoEstatus={estatus.src}
                            />
                        );
                    })()
                )}
                {/* 🔹 Selector de cuatrimestre */}
                <Text style={styles.selectLabel}>Selecciona un cuatrimestre:</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={selectedSemester}
                        onValueChange={(value) => setSelectedSemester(value)}
                        style={styles.picker}
                    >
                        {Object.keys(cuatrimestresData).map((cuatri) => (
                            <Picker.Item
                                key={cuatri}
                                label={`${cuatri} (${periodos[cuatri] || "N/A"})`}
                                value={cuatri}
                            />
                        ))}
                    </Picker>
                </View>

                <StudentPDFGenerator
                    onGenerateHistorial={handleGenerateHistorial}
                    onGenerateCuatrimestre={handleGenerateBoleta}
                />

                {/* 🔹 Tabla dinámica */}
                {currentData && (
                    <View style={styles.card}>
                        <Text style={styles.cuatriTitle}>
                            {selectedSemester} ({periodos[selectedSemester] || "N/A"})
                        </Text>

                        <View style={styles.tableHeader}>
                            <Text style={[styles.th, { flex: 2 }]}>Materia</Text>
                            <Text style={styles.th}>P1</Text>
                            <Text style={styles.th}>P2</Text>
                            <Text style={styles.th}>P3</Text>
                            <Text style={styles.th}>PF</Text>
                        </View>

                        {/*------------------ Renderizado de filas de materias ------------------*/}

                        {currentData.materias.map((m: { materia: string; p1: GradeResult; p2: GradeResult; p3: GradeResult; final: number }, i: number) => (
                            <View key={i} style={[styles.row, i % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                                <Text style={[styles.cell, { flex: 2 }]}>{m.materia}</Text>
                                <Text style={styles.cell}>{m.p1.cal} {m.p1.tipo}</Text>
                                <Text style={styles.cell}>{m.p2.cal} {m.p2.tipo}</Text>
                                <Text style={styles.cell}>{m.p3.cal} {m.p3.tipo}</Text>
                                <Text style={styles.cell}>{m.final}</Text>
                            </View>
                        ))}

                        <Text style={styles.promedio}>Promedio: {promedios[selectedSemester]}</Text>
                    </View>
                )}
            </ScrollView>
            <BottomBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    scroll: { padding: 16, paddingBottom: 90 },
    studentCard: {
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 10,
        alignItems: "center",
        marginBottom: 10,
    },
    studentName: { color: "#fff", fontSize: 18, fontFamily: "Roboto_700Bold", textAlign: "center" },
    studentCareer: { color: "#fff", fontSize: 14, textAlign: "center", marginTop: 4 },
    studentGroup: { color: "#fff", fontSize: 13, textAlign: "center", marginTop: 4 },
    selectLabel: { fontSize: 15, color: "#7b0029", fontFamily: "Roboto_700Bold", textAlign: "center" },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#A30052",
        borderRadius: 8,
        marginVertical: 10,
        overflow: "hidden",
    },
    picker: { color: "#7b0029", fontSize: 14 },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 4,
        padding: 10,
        marginBottom: 16,
    },
    cuatriTitle: { fontSize: 16, fontFamily: "Roboto_700Bold", color: "#7b0029", marginBottom: 6 },
    tableHeader: { flexDirection: "row", backgroundColor: "#7b0029", paddingVertical: 6 },
    th: { flex: 1, color: "#fff", textAlign: "center", fontFamily: "Roboto_700Bold", fontSize: 12 },
    row: { flexDirection: "row", paddingVertical: 4, paddingHorizontal: 2 },
    rowEven: { backgroundColor: "#f9f3f3" },
    rowOdd: { backgroundColor: "#fff" },
    cell: { flex: 1, textAlign: "center", fontSize: 12, color: "#222" },
    promedio: { textAlign: "right", color: "#7b0029", fontFamily: "Roboto_700Bold", marginTop: 6 },
    loaderContainer: { flex: 1, alignItems: "center" },
    errorText: { textAlign: "center", color: "#df2222", fontFamily: "Roboto_500Medium" },
});

export default HistorialScreen;
