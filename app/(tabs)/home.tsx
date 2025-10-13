import BottomBar from "@/components/bottom-bar";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../context/UserContext"; // 👈 para usar la matrícula
import PrimeBanner from "@/components/prime-banner";
import Header from "@/components/header"; 

const HomeScreen: React.FC = () => {
    const [selected, setSelected] = useState("");
    const { matricula } = useUser();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

            {/* Header con logo y título */}
            <Header />

            <ScrollView contentContainerStyle={styles.container}>

                <PrimeBanner />

                {/* Calendario */}
                <View style={styles.calendarContainer}>
                    <Calendar
                        onDayPress={(day) => setSelected(day.dateString)}
                        markedDates={{
                            [selected]: { selected: true, selectedColor: "#7b0029" },
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
                </View>

                {/* Tarjeta inferior */}
                <LinearGradient colors={["#7b0029", "#E60073"]} style={styles.bottomCard}>
                    <Text style={styles.bottomText}>Módulos disponibles próximamente...</Text>
                </LinearGradient>
            </ScrollView>
            {/* Barra de navegación inferior */}
            < BottomBar />
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    logo: {
        width: 60,
        height: 60,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Roboto_700Bold",
        lineHeight: 18,
    },
    infoCard: {
        flexDirection: "row",
        backgroundColor: "#f9f3f3",
        borderRadius: 12,
        marginTop: 16,
        marginHorizontal: 20,
        padding: 14,
        alignItems: "center",
    },
    infoBadge: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginRight: 10,
        padding: 6,
        elevation: 3,
    },
    badgeImage: {
        width: 45,
        height: 45,
    },
    infoTitle: {
        color: "#A30052",
        fontSize: 18,
        fontFamily: "Roboto_700Bold",
    },
    infoText: {
        color: "#7b0029",
        fontSize: 12,
        textAlign: "justify",
        fontFamily: "Roboto_400Regular",
    },
    calendarContainer: {
        marginTop: 16,
        width: "90%",
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#fff",
        elevation: 4,
    },
    bottomCard: {
        width: "90%",
        height: 140,
        borderRadius: 16,
        marginTop: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    bottomText: {
        color: "#fff",
        fontFamily: "Roboto_700Bold",
    },
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#7b0029",
        paddingVertical: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 8,
    },
    tabItem: {
        alignItems: "center",
        justifyContent: "center",
    },
    tabText: {
        color: "#fff",
        fontSize: 10,
        fontFamily: "Roboto_400Regular",
        marginTop: 3,
    },
});

export default HomeScreen;
