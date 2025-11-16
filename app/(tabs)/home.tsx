import BottomBar from "@/components/bottom-bar";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import PrimeBanner from "@/components/prime-banner";
import Header from "@/components/header";
import moment from "moment";
import ActividadModal from "@/components/actividad-card";

const URL_BASE = "https://prime-api-iawe.onrender.com";

interface MarkedDate {
  selected?: boolean;
  marked?: boolean;
  selectedColor?: string;
  dotColor?: string;
  activeOpacity?: number;
}

type MarkedDates = Record<string, MarkedDate>;

interface CalendarMonth {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

const COLORES_DISPONIBLES = [
  "#921F45", "#4CAF50", "#FF5722", "#3F51B5", "#795548",
  "#009688", "#9C27B0", "#FF9800", "#2196F3", "#E91E63",
  "#607D8B", "#CDDC39", "#00BCD4", "#FFC107", "#8BC34A"
];

const colorPorMateria: Record<string, string> = {};

function obtenerColorMateria(nombre: string): string {
  if (colorPorMateria[nombre]) return colorPorMateria[nombre];
  const nuevoColor = COLORES_DISPONIBLES[
    Object.keys(colorPorMateria).length % COLORES_DISPONIBLES.length
  ];
  colorPorMateria[nombre] = nuevoColor;
  return nuevoColor;
}

const HomeScreen: React.FC = () => {
  const [selected, setSelected] = useState<string>("");
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [isLoading, setIsLoading] = useState(false);
  const [actividadesMes, setActividadesMes] = useState<any[]>([]);
  const [actividadesDia, setActividadesDia] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { matricula } = useUser();

  const getMesAPI = (month: number): number | null => {
    const mapa: Record<number, number> = {
      10: 1,
      11: 2,
      12: 3,
    };
    return mapa[month] || null;
  };

  const fetchActividades = async (month: number) => {
    if (!matricula) return;

    setIsLoading(true);
    try {
      const mesAPI = getMesAPI(month);
      if (!mesAPI) {
        setMarkedDates({});
        return;
      }

      const response = await axios.get(`${URL_BASE}/actividadesXAlumno`, {
        params: { Matricula: matricula, Mes: mesAPI },
      });

      const data = response.data?.data || [];
      setActividadesMes(data);

      const newMarks: MarkedDates = {};
      data.forEach((actividad: any) => {
        const fecha = moment(actividad.FechaEntrega).year(2025).format("YYYY-MM-DD");
        newMarks[fecha] = { marked: true, dotColor: "#5aa10f" };
      });

      if (selected) {
        newMarks[selected] = {
          ...(newMarks[selected] || {}),
          selected: true,
          selectedColor: "#7b0029",
        };
      }

      setMarkedDates(newMarks);
    } catch (error: any) {
      console.error("❌ Error al obtener actividades:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthChange = (monthObj: CalendarMonth) => {
    const month = monthObj.month;
    if (month >= 10 && month <= 12) {
      fetchActividades(month);
    } else {
      setMarkedDates({});
      setActividadesMes([]);
    }
    setActividadesDia([]);
  };

  const handleDayPress = (day: any) => {
    setSelected(day.dateString);

    const actividades = actividadesMes.filter((act) => {
      const fechaEntrega = moment(act.FechaEntrega).year(2025).format("YYYY-MM-DD");
      return fechaEntrega === day.dateString;
    });

    if (actividades.length > 0) {
      setActividadesDia(actividades);
      setModalVisible(true);
    } else {
      setActividadesDia([]);
      setModalVisible(false);
    }
  };

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    fetchActividades(currentMonth);
  }, [matricula]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />
      
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <PrimeBanner />

          <View style={styles.calendarContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#7b0029" style={{ marginVertical: 30 }} />
            ) : (
              <Calendar
                onDayPress={handleDayPress}
                onMonthChange={handleMonthChange}
                markedDates={{
                  ...markedDates,
                  [selected]: {
                    ...(markedDates[selected] || {}),
                    selected: true,
                    selectedColor: "#7b0029",
                  },
                }}
                theme={{
                  backgroundColor: "#fff",
                  calendarBackground: "#fff",
                  textSectionTitleColor: "#7b0029",
                  selectedDayBackgroundColor: "#7b0029",
                  selectedDayTextColor: "#fff",
                  todayTextColor: "#E60073",
                  arrowColor: "#7b0029",
                  monthTextColor: "#7b0029",
                  textMonthFontFamily: "Roboto_700Bold",
                  textDayFontFamily: "Roboto_400Regular",
                  textDayHeaderFontFamily: "Roboto_700Bold",
                }}
              />
            )}
          </View>

          <ActividadModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            actividades={actividadesDia}
            obtenerColorMateria={obtenerColorMateria}
          />

        </ScrollView>
      <BottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: "center",
    paddingBottom: 100,
    flex: 1,
  },
  calendarContainer: {
    marginTop: 16,
    width: "90%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 4,
  },
});

export default HomeScreen;
