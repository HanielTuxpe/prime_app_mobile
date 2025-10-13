import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAlert } from "../../providers/AlertProvider";

const VerificationScreen: React.FC = () => {
    const [codigo, setCode] = useState(["", "", "", "", "", ""]);
    const inputs = useRef<(TextInput | null)[]>([]);
    const { matricula, email } = useLocalSearchParams<{ matricula: string; email?: string }>();
    const URL_Base = `https://prime-api-iawe.onrender.com`
    const { showAlert } = useAlert();
    const router = useRouter();

    const handleChange = (text: string, index: number) => {
        const newCode = [...codigo];
        newCode[index] = text;
        setCode(newCode);

        // avanzar automáticamente
        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleVerify = async () => {
        console.log("Código ingresado:", codigo.join(""));
        console.log("Matrícula:", matricula);
        const code = codigo.join("");
        try {
            const response = await axios.post(`${URL_Base}/CodigoVerificacion`, { matricula, code });

            if (response.status === 200) {
                showAlert({
                    title: "Acceso exitoso",
                    message: "Bienvenido de nuevo",
                    type: "success",
                    autoCloseMs: 1000,
                });
                router.replace({ pathname: "/(tabs)", params: { matricula } });
            }
        } catch (error: any) {
            console.log("Error en login:", error.response?.data || error.message);
            showAlert({
                title: "Error en login",
                message: error.response?.data?.error || "Ocurrió un error inesperado. Intenta de nuevo.",
                type: "error",
                autoCloseMs: 2000,
            });

        }
    };

    const handleResend = async () => {
        console.log("Reenviar código a:", email);

        try {
            const response = await axios.post(`${URL_Base}/resendToken`, { email });

            if (response.status === 200) {
                showAlert({
                    title: "Código reenviado con éxito",
                    message: "Tu nuevo código ha sido enviado a tu correo.",
                    type: "success",
                    autoCloseMs: 1000,
                });
            }
        } catch (error: any) {
            showAlert({
                title: "Error en login",
                message: error.response?.data?.error || "Ocurrió un error inesperado. Intenta de nuevo.",
                type: "error",
                autoCloseMs: 2000,
            });
        }
    }

    return (
        <LinearGradient
            colors={["#a8093eff", "#ff2592ff"]}
            style={styles.container}
        >

            {/* Círculo difuminado */}
            <LinearGradient
                colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0)"]}
                style={styles.circle}
            />

            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image
                    source={require("../../assets/images/uthh.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <KeyboardAvoidingView
                style={styles.innerContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {/* Texto */}
                <Text style={styles.title}>Código de Verificación</Text>

                <Text style={styles.subtitle}>
                    Se ha enviado un código al correo institucional: {email}
                </Text>

                {/* Inputs de 6 dígitos */}
                <View style={styles.codeContainer}>
                    {codigo.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { inputs.current[index] = ref; }}
                            style={styles.codeInput}
                            keyboardType="numeric"
                            maxLength={1}
                            value={digit}
                            onChangeText={(text) => handleChange(text, index)}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === "Backspace" && codigo[index] === "") {
                                    // si está vacío y no es el primero, retrocede
                                    if (index > 0) {
                                        inputs.current[index - 1]?.focus();
                                    }
                                }
                            }}
                        />
                    ))}
                </View>

                {/* Reenviar */}
                <TouchableOpacity onPress={handleResend}>
                    <Text style={styles.resend}>Reenviar Código</Text>
                </TouchableOpacity>

                {/* Card inferior con botón */}
                <TouchableOpacity onPress={handleVerify}>
                    <LinearGradient
                        colors={["#7b0029", "#E60073"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Verificar</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
    },
    innerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 130,
        backgroundColor: "#fff",
        width: "100%",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    circle: {
        position: "absolute",
        top: 80,
        width: 250,
        height: 250,
        borderRadius: 120,
    },
    logoContainer: {
        marginBottom: 30,
        alignItems: "center",
    },
    logo: {
        top: 110,
        width: 180,
        height: 180,
    },
    title: {
        paddingTop: 30,
        fontSize: 35,
        fontWeight: "bold",
        fontFamily: "Roboto_700Bold",
        color: "#d1064aff",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        width: "80%",
        fontFamily: "Roboto_400Regular",
        color: "#7b0029",
        marginBottom: 30,
    },
    codeContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    codeInput: {
        width: 45,
        height: 55,
        borderWidth: 2,
        borderColor: "#7b0029",
        borderRadius: 10,
        textAlign: "center",
        fontSize: 20,
        color: "#000000ff",
        marginVertical: 30,
        marginHorizontal: 5,
        backgroundColor: "rgba(255,255,255,0.1)",
        fontFamily: "Roboto_700Bold",
    },
    resend: {
        fontSize: 18,
        marginBottom: 50,
        color: "#7b0029",
        fontFamily: "Roboto_400Regular",
        textDecorationLine: "underline",
    },
    card: {
        backgroundColor: "#fff",
        width: "100%",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        alignItems: "center",
        paddingVertical: 30,
        position: "absolute",
        bottom: 0,
    },
    button: {
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 60,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Roboto_700Bold",
    },
});

export default VerificationScreen;
