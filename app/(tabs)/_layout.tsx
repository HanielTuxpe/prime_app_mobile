import { Slot, usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, BackHandler } from "react-native";
import { UserProvider } from "../../context/UserContext";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const backAction = () => {
      // Si estamos dentro del grupo (tabs), mostrar alerta para regresar al login
      if (pathname.startsWith("/(tabs)")) {
        Alert.alert(
          "Cerrar sesión",
          "¿Deseas volver a la pantalla de inicio de sesión?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Sí",
              style: "destructive",
              onPress: () => {
                // 🔹 Reemplaza toda la navegación y limpia el stack
                router.replace("../(auth)/login");
              },
            },
          ]
        );
        return true; // evita comportamiento por defecto
      }
      return false; // permite retroceso normal fuera de tabs
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [pathname]);

  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
