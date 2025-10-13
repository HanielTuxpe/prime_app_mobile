import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "@/components/header";
import BottomBar from "@/components/bottom-bar";

const RendimientoScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.text}>Aquí va el módulo de Rendimiento Académico</Text>
      </View>
      <BottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
    color: "#7b0029",
    textAlign: "center",
  },
});

export default RendimientoScreen;
