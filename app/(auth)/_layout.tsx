import { Stack } from "expo-router";
import { AlertProvider } from "../../providers/AlertProvider";

export default function Layout() {
  return (
    <AlertProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AlertProvider>
  );
}
