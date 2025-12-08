import { MaterialIcons } from "@expo/vector-icons"; // Expo icons
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { validateMatricula, validatePassword } from "../../utils/validation";



const LoginScreen: React.FC = () => {
    const router = useRouter();
    const [matricula, setMatricula] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const URL_Base = `https://prime-api-iawe.onrender.com`
    const { showAlert } = useAlert();

    const handleLogin = async () => {

        const matriculaResult = validateMatricula(matricula);
        const passwordResult = validatePassword(password);
        
        if (!matriculaResult.valid) {
            showAlert({
                title: "Validación",
                message: matriculaResult.message,
                type: "warning",
                autoCloseMs: 2500,
            });
            return;
        }

        if (!passwordResult.valid) {
            showAlert({
                title: "Validación",
                message: passwordResult.message,
                type: "warning",
                autoCloseMs: 2500,
            });
            return;
        }

        try {
            console.log("Iniciando login con:", { matricula, password });
            const response = await axios.post(`${URL_Base}/access`, {
                matricula,
                password,
                userType: "estudiante",
            });

            if (response.status === 200) {
                showAlert({
                    title: "Acceso exitoso",
                    message: "Te hemos enviado un cógidp a tu correo institucional.",
                    type: "success",
                    autoCloseMs: 1000,
                });
                const email = response.data.user.Email;
                router.push({ pathname: "/(auth)/code-verification", params: { matricula, email } });

            }
        } catch (error: any) {
            showAlert({
                title: "Error en login",
                message: error.response?.data?.error || "Ocurrió un error inesperado. Intenta de nuevo.",
                type: "error",
                autoCloseMs: 2000,
            });
        }
    };

    return (
        <LinearGradient
            colors={["#7b0029", "#d10069ff", "#E60073"]}
            style={styles.container}
        >

            {/* Círculo difuminado detrás del logo */}
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

                {/* Inputs */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <MaterialIcons
                            name="account-circle"
                            size={20}
                            color="#fff"
                            style={styles.icon}
                        />
                        <TextInput
                            accessibilityLabel="input-matricula"
                            testID="input-matricula"
                            placeholder="Matrícula"
                            placeholderTextColor="#fff"
                            value={matricula}
                            onChangeText={(text) => {
                                // Solo números, máximo 8 dígitos
                                if (/^\d*$/.test(text) && text.length <= 8) {
                                    setMatricula(text);
                                }
                            }}
                            style={styles.input}
                            keyboardType="numeric"
                            maxLength={8} // seguridad extra
                            autoCapitalize="none"
                        />

                    </View>
                    <View style={styles.inputWrapper}>
                        <MaterialIcons
                            name="lock"
                            size={20}
                            color="#fff"
                            style={styles.icon}
                        />
                        <TextInput
                            accessibilityLabel="input-password"
                            testID="input-password"
                            placeholder="Contraseña"
                            placeholderTextColor="#fff"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            secureTextEntry={!showPassword}   // 👈 aquí usamos el estado
                        />
                        <TouchableOpacity
                            accessibilityLabel="btn-login"
                            testID="btn-login"
                            onPress={() => setShowPassword(!showPassword)}>
                            <MaterialIcons
                                name={showPassword ? "visibility" : "visibility-off"}
                                size={20}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Card inferior con botón */}
                <View style={styles.card}>
                    <TouchableOpacity onPress={handleLogin}>
                        <LinearGradient
                            colors={["#7b0029", "#E60073"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Acceder</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    innerContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    circle: {
        position: "absolute",
        top: 110,
        width: 250,
        height: 250,
        borderRadius: 125,
    },
    logoContainer: {
        marginBottom: 50,
        alignItems: "center",
    },
    logo: {
        top: 150,
        width: 180,
        height: 180,
    },
    inputContainer: {
        width: "85%",
        marginBottom: 150,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 20,
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#fff",
        fontFamily: "Roboto_400Regular",
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
        height: 150,
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

export default LoginScreen;
