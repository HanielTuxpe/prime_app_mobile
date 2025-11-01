import { Slot, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, BackHandler } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Ocultar barra del sistema
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync("overlay-swipe");

    const backAction = () => {
      if (pathname.startsWith("/(tabs)")) {
        Alert.alert("Cerrar sesión", "¿Deseas volver a la pantalla de inicio de sesión?", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sí",
            style: "destructive",
            onPress: () => router.replace("./(auth)/login"),
          },
        ]);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [pathname]);

  return (
    <>
      <StatusBar hidden />
      <Slot />
    </>
  );
}
