import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const BottomBar: React.FC = () => {
    const router = useRouter();
    const path = usePathname();

    const tabs = [
        { route: "/(tabs)/home", label: "Home", icon: require("../assets/images/home.png") },
        { route: "/(tabs)/notificaciones", icon: require("../assets/images/notificacion.png") },
        { route: "/(tabs)/perfil", icon: require("../assets/images/perfil.png") },
        { route: "/(tabs)/historial", icon: require("../assets/images/calificaciones.png") },
        { route: "/(tabs)/rendimiento", icon: require("../assets/images/rendimiento.png") },
    ];

    const homeTab = tabs[0];
    const otherTabs = tabs.slice(1);

    const renderTab = (tab: (typeof tabs)[0], active: boolean) => (
        <TouchableOpacity
            key={tab.route}
            style={styles.tabItem}
            onPress={() => router.push(tab.route as never)}
        >
            <LinearGradient
                colors={
                    active
                        ? ["#7b0029", "#E60073"]
                        : ["#f7f3f4", "#e5d7dc"]
                }
                style={styles.iconCircle}
            >
                <Image
                    source={tab.icon}
                    style={[styles.icon, active && { tintColor: "#fff" }]}
                />
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.tabBar}>
            {/* Home a la izquierda */}
            <TouchableOpacity
                style={styles.homeButton}
                onPress={() => router.push(homeTab.route as never)}
            >
                <LinearGradient
                    colors={["#7b0029", "#E60073"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.homeGradient}
                >
                    <Image source={homeTab.icon} style={styles.homeIcon} />
                    <Text style={styles.homeText}>Home</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Contenedor de los demás íconos */}
            <View style={styles.otherTabsContainer}>
                {otherTabs.map((tab, i) => (
                    <React.Fragment key={tab.route}>
                        {renderTab(tab, path === tab.route)}
                        {/* Separador entre íconos excepto el último */}
                        {i < otherTabs.length - 1 && <View style={styles.divider} />}
                    </React.Fragment>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f3f3f3",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: 85,
        paddingHorizontal: 10,
        paddingBottom: 5,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },
    homeButton: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    homeGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 10,
        height: 50,
    },
    homeIcon: {
        width: 25,
        height: 25,
        tintColor: "#fff",
        marginRight: 8,
    },
    homeText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Roboto_700Bold",
        fontWeight: "bold",
    },
    otherTabsContainer: {
        flex: 2,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "#e8e6e6",
        borderRadius: 50,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    tabItem: {
        alignItems: "center",
        justifyContent: "center",
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        width: 28,
        height: 28,
        tintColor: "#A30052",
    },
    divider: {
        width: 1.5,
        height: 40,
        backgroundColor: "rgba(0,0,0,0.1)",
    },
});

export default BottomBar;
