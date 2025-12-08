import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertProvider } from "../providers/AlertProvider";
import { UserProvider } from "../context/UserContext";

export default function RootLayout() {
  return (
    <AlertProvider>
      <UserProvider>
        <StatusBar hidden />
        <Slot />
      </UserProvider>
    </AlertProvider>
  );
}
