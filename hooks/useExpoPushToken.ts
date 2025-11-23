import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function useExpoPushToken(matricula: any, BASE_URL: any) {
    useEffect(() => {
        if (!matricula) return; // Aún no hay sesión

        const registerToken = async () => {
            try {
                // 1. Permisos de notificaciones
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== "granted") {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus !== "granted") {
                    console.log("❌ Permisos de notificaciones denegados");
                    return;
                }

                // 2. Obtener token de Expo
                const token = (await Notifications.getExpoPushTokenAsync()).data;
                console.log("📲 Expo push token:", token);

                // 3. Android: canal de notificaciones
                if (Platform.OS === "android") {
                    Notifications.setNotificationChannelAsync("default", {
                        name: "default",
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: "#FF231F7C",
                    });
                }

                // 4. Enviar token al backend
                await fetch(`${BASE_URL}/saveExpoToken`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        matricula: matricula,
                        expoToken: token,
                    }),
                });

                console.log("✅ Token enviado al backend");

            } catch (error) {
                console.error("❌ Error al registrar Expo token:", error);
            }
        };

        registerToken();
    }, [matricula]);
}
