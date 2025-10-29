import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface PDFGeneratorProps {
    onGenerateHistorial: () => void;
    onGenerateCuatrimestre: () => void;
}

const StudentPDFGenerator: React.FC<PDFGeneratorProps> = ({
    onGenerateHistorial,
    onGenerateCuatrimestre,
}) => {
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onGenerateHistorial}>
                <Text style={styles.buttonText}>Generar PDF del Historial</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={onGenerateCuatrimestre}>
                <Text style={styles.buttonText}>Generar PDF del Cuatrimestre</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginVertical: 10,
        flexWrap: "wrap",
    },
    button: {
        backgroundColor: "#7b0029",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginVertical: 5,
        elevation: 4,
    },
    buttonText: {
        color: "#fff",
        fontFamily: "Roboto_700Bold",
        textAlign: "center",
    },
});

export default StudentPDFGenerator;
