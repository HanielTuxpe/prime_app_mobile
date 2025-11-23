// app/(auth)/_layout.tsx
import { useUser } from "@/context/UserContext";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { AlertProvider } from "../../providers/AlertProvider";

export default function AuthLayout() {

  const { matricula } = useUser();

  if (matricula) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <AlertProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AlertProvider>
  );
}
