import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, FlatList } from "react-native";
import Header from "@/components/header";
import BottomBar from "@/components/bottom-bar";
import axios from "axios";
import { LoaderScreen } from "@/components/loading-screen";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { useUser } from "@/context/UserContext";

const screenWidth = Dimensions.get("window").width - 40;
const URL_BASE = "https://prime-api-iawe.onrender.com";

const RendimientoScreen: React.FC = () => {
  const { matricula } = useUser();

  const [loading, setLoading] = useState(true);
  const [promedioGeneral, setPromedioGeneral] = useState(0);
  const [cuatrimestres, setCuatrimestres] = useState<number[]>([]);
  const [promedios, setPromedios] = useState<number[]>([]);
  const [tablaResumen, setTablaResumen] = useState<any[]>([]);
  const [tendencia, setTendencia] = useState<"sube" | "baja" | "igual">("igual");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [scatterCuatris, setScatterCuatris] = useState<any>({});
  const [currentScatterCuatri, setCurrentScatterCuatri] = useState<number | null>(null);
  const [materiaTooltip, setMateriaTooltip] = useState<any | null>(null);

  const calcularExtras = (item: any) => {
    let extras = 0;

    const parciales = [
      ["Parcial1", "Parcial1E1", "Parcial1E2", "Parcial1E3"],
      ["Parcial2", "Parcial2E1", "Parcial2E2", "Parcial2E3"],
      ["Parcial3", "Parcial3E1", "Parcial3E2", "Parcial3E3"],
    ];

    parciales.forEach(([normal, e1, e2, e3]) => {
      if (item[normal] === 0 || item[normal] < 6) {
        [item[e1], item[e2], item[e3]].forEach((score, idx) => {
          if (score > 6) extras += idx + 1;
        });
      }
    });

    return extras;
  };

  useEffect(() => {
    if (matricula) {
      fetchHistorial();
    }
  }, [matricula]);

  useEffect(() => {
    if (!currentScatterCuatri || !scatterCuatris) return;

    const keys = Object.keys(scatterCuatris).map(Number);
    const interval = setInterval(() => {
      const currentIndex = keys.indexOf(currentScatterCuatri);
      const nextIndex = (currentIndex + 1) % keys.length;
      setCurrentScatterCuatri(keys[nextIndex]);
    }, 6000);

    return () => clearInterval(interval);
  }, [scatterCuatris, currentScatterCuatri]);


  const fetchHistorial = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${URL_BASE}/historial`, {
        params: { matricula },
      });

      if (res.data.history) {
        procesarHistorial(res.data.history);
      }
    } catch (e) {
      console.error("❌ Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const procesarHistorial = (data: any[]) => {
    const grupos: Record<number, number[]> = {};

    data.forEach((item) => {
      const cuatri = Number(item.Cuatrimestre);
      const prom = Number(item.PromedioFinal);
      if (!grupos[cuatri]) grupos[cuatri] = [];
      grupos[cuatri].push(prom);
    });

    const cuatrisOrdenados = Object.keys(grupos)
      .map(Number)
      .sort((a, b) => a - b);

    const promediosPorCuatri = cuatrisOrdenados.map((c) => {
      const arr = grupos[c];
      return Number((arr.reduce((a, b) => a + b) / arr.length).toFixed(2));
    });

    setCuatrimestres(cuatrisOrdenados);
    setPromedios(promediosPorCuatri);

    // Promedio general
    const suma = promediosPorCuatri.reduce((a, b) => a + b, 0);
    setPromedioGeneral(Number((suma / promediosPorCuatri.length).toFixed(2)));

    // Tendencia
    if (promediosPorCuatri.length >= 2) {
      const ultimo = promediosPorCuatri[promediosPorCuatri.length - 1];
      const penultimo = promediosPorCuatri[promediosPorCuatri.length - 2];

      setTendencia(
        ultimo > penultimo ? "sube" : ultimo < penultimo ? "baja" : "igual"
      );
    }

    // Para la tabla
    const tabla = cuatrisOrdenados.map((c, i) => ({
      cuatri: c,
      promedio: promediosPorCuatri[i],
    }));

    setTablaResumen(tabla);

    // Agrupar por cuatrimestre para la gráfica Scatter
    const grouped: Record<number, any[]> = {};

    data.forEach((item) => {
      const extras = calcularExtras(item); // función abajo
      const materia = item.Materia || item.MateriaNombre || "Materia";

      const cuatri = Number(item.Cuatrimestre);

      if (!grouped[cuatri]) grouped[cuatri] = [];

      grouped[cuatri].push({
        materia,
        promedio: Number(item.PromedioFinal),
        extras,
      });
    });

    // Ordenar llaves
    const ordered = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b);

    // Guardar datos
    setScatterCuatris(grouped);
    setCurrentScatterCuatri(ordered[0]);

  };

  if (loading) {
    return <LoaderScreen iconSource={require("@/assets/images/rendimiento.png")} />;
  }

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* ==========================================
           ⭐ KPI SECTION
        ========================================== */}
        <Text style={styles.mainTitle}>Rendimiento Académico</Text>

        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{promedioGeneral}</Text>
            <Text style={styles.kpiLabel}>Promedio General</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>
              {Math.max(...promedios)}
            </Text>
            <Text style={styles.kpiLabel}>Mejor Cuatrimestre</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>
              {Math.min(...promedios)}
            </Text>
            <Text style={styles.kpiLabel}>Peor Cuatrimestre</Text>
          </View>
        </View>

        <Text style={styles.tendenciaText}>
          Tendencia:
          {tendencia === "sube" && " 📈 Mejorando"}
          {tendencia === "baja" && " 📉 Bajando"}
          {tendencia === "igual" && " ➖ Estable"}
        </Text>

        {/* ==========================================
           📊 GRÁFICA DE BARRAS
        ========================================== */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Promedio por Cuatrimestre</Text>

          <BarChart
            data={promedios.map((p, i) => ({
              value: p,
              label: cuatrimestres[i].toString(),
              promedio: p,
            }))}

            barWidth={30}
            spacing={16}
            barBorderRadius={8}
            yAxisThickness={0}
            xAxisThickness={0}
            maxValue={10}
            noOfSections={5}
            height={230}
            frontColor="#a90a3fd3"

            // Guarda el índice tocado
            onPress={(item: any, index: number) => {
              setSelectedIndex(index === selectedIndex ? null : index);
            }}


            renderTooltip={(item: any, index: number) => {
              if (selectedIndex !== index) return null;

              return (
                <View style={styles.tooltipWrapper}>
                  <View style={styles.tooltipBox}>
                    <Text style={styles.tooltipText}>
                      {item.promedio}
                    </Text>
                  </View>
                </View>
              );
            }}

          />

        </View>


        {/* ==========================================
           📈 GRÁFICA DE LÍNEA
        ========================================== */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Evolución del Desempeño</Text>

          <LineChart
            data={promedios.map((p) => ({ value: p }))}
            curved
            thickness={3}
            color="#A30052"
            dataPointsColor="#A30052"
            dataPointsRadius={4}
            yAxisThickness={0}
            xAxisThickness={0}
            noOfSections={5}
            maxValue={10}
            height={240}
            areaChart
            startFillColor="#A30052"
            endFillColor="#fff"
            startOpacity={0.4}
            endOpacity={0}
          />
        </View>

        {/* ==========================================
            📋 GRAFICA POR MATERIAS
        ========================================== */}

      </ScrollView>

      <BottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 16, paddingBottom: 120, alignItems: "center" },

  mainTitle: {
    fontSize: 20,
    fontFamily: "Roboto_700Bold",
    color: "#7b0029",
    marginBottom: 14,
  },

  /** KPIS **/
  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  kpiCard: {
    width: "32%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    elevation: 4,
  },
  kpiValue: {
    fontSize: 22,
    fontFamily: "Roboto_700Bold",
    color: "#7b0029",
  },
  kpiLabel: {
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
    color: "#444",
    marginTop: 2,
    textAlign: "center",
  },

  tendenciaText: {
    fontSize: 14,
    color: "#A30052",
    fontFamily: "Roboto_700Bold",
    marginBottom: 18,
  },

  /** CHART CARDS **/
  chartCard: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 25,
    elevation: 4,
  },
  chartTitle: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
    color: "#A30052",
    marginBottom: 10,
  },

  /** TABLE **/
  tableTitle: {
    fontSize: 18,
    fontFamily: "Roboto_700Bold",
    color: "#7b0029",
    marginTop: 10,
    marginBottom: 8,
  },
  tableContainer: {
    width: "95%",
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 3,
    marginBottom: 50,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#7b0029",
    padding: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tableHeaderText: {
    color: "#fff",
    fontFamily: "Roboto_700Bold",
    width: "50%",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  tableCell: {
    width: "50%",
    textAlign: "center",
    fontFamily: "Roboto_400Regular",
    color: "#444",
  },
  tooltipWrapper: {
    position: "absolute",
    top: 20,       // 🔥 sube el tooltip FUERA del área del gráfico
    left: 20,      // Ajusta horizontalmente
    right: -20,
    alignItems: "center",
  },

  tooltipBox: {
    backgroundColor: "#dc217eff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    elevation: 1,
    width: 50,
  },

  tooltipText: {
    color: "#fff",
    fontFamily: "Roboto_700Bold",
    fontSize: 13,
  },


});

export default RendimientoScreen;
