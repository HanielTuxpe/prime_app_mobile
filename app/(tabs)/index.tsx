import { Redirect } from "expo-router";
import { useUser } from "@/context/UserContext";

export default function Index() {
  const { matricula } = useUser();

  if (!matricula) {
    return <Redirect href="/(auth)/Login" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
