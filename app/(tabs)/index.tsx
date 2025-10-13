import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useUser } from "../../context/UserContext";
import HomeScreen from "./home"; // tu pantalla principal real

export default function IndexScreen() {
  const { matricula } = useLocalSearchParams<{ matricula?: string }>();
  const { setMatricula } = useUser();

  useEffect(() => {
    if (matricula) {
      setMatricula(matricula);
      console.log("✅ Matrícula guardada en contexto:", matricula);
    }
  }, [matricula]);

  return <HomeScreen />;
}
