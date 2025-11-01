// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import { AlertProvider } from "../../providers/AlertProvider";

export default function AuthLayout() {
  return (
    <AlertProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AlertProvider>
  );
}
