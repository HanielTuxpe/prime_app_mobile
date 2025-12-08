import { MaterialIcons } from "@expo/vector-icons";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Animated, Easing, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type AlertType = "success" | "error" | "info" | "warning";

type AlertAction = {
    label: string;
    onPress?: () => void;
    variant?: "primary" | "ghost";
};

type AlertOptions = {
    title?: string;
    message: string;
    type?: AlertType;
    autoCloseMs?: number;
    actions?: AlertAction[];
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
};


type AlertContextType = {
    showAlert: (opts: AlertOptions) => void;
    hideAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState<AlertOptions | null>(null);
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.95)).current;
    const autoTimer = useRef<number | null>(null);
    const icons: Record<AlertType, { name: keyof typeof MaterialIcons.glyphMap; color: string }> = {
        success: { name: "check-circle", color: "#099247" },
        error: { name: "error", color: "#df2222" },
        info: { name: "info", color: "#0A84FF" },
        warning: { name: "warning", color: "#F39C12" },
    };


    const animateIn = useCallback(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7 })
        ]).start();
    }, [opacity, scale]);

    const animateOut = useCallback((cb?: () => void) => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 140, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 0.95, duration: 140, useNativeDriver: true })
        ]).start(() => cb?.());
    }, [opacity, scale]);

    const hideAlert = useCallback(() => {
        if (autoTimer.current) {
            clearTimeout(autoTimer.current);
            autoTimer.current = null;
        }
        animateOut(() => {
            setVisible(false);
            setOptions(null);
        });
    }, [animateOut]);

    const showAlert = useCallback((opts: AlertOptions) => {
        if (autoTimer.current) {
            clearTimeout(autoTimer.current);
            autoTimer.current = null;
        }
        if (!opts.actions && (opts.confirmText || opts.cancelText)) {
            opts.actions = [];

            if (opts.cancelText) {
                opts.actions.push({
                    label: opts.cancelText,
                    variant: "ghost",
                });
            }
            if (opts.confirmText) {
                opts.actions.push({
                    label: opts.confirmText,
                    variant: "primary",
                    onPress: opts.onConfirm,
                });
            }
        }
        setOptions({
            type: "info",
            title: undefined,
            actions: [{ label: "Aceptar", variant: "primary" }],
            ...opts,
        });
        setVisible(true);
        requestAnimationFrame(animateIn);

        if (opts.autoCloseMs && opts.autoCloseMs > 0) {
            autoTimer.current = setTimeout(() => hideAlert(), opts.autoCloseMs);
        }

    }, [animateIn, hideAlert]);

    const value = useMemo(() => ({ showAlert, hideAlert }), [showAlert, hideAlert]);

    // Colores por tipo
    const palette: Record<AlertType, { main: string; text?: string }> = {
        success: { main: "#099247" },
        error: { main: "#df2222" },
        info: { main: "#0A84FF" },
        warning: { main: "#F39C12" },
    };

    const type = options?.type ?? "info";
    const color = palette[type].main;

    return (
        <AlertContext.Provider value={value}>
            {children}

            <Modal
                transparent
                visible={visible}
                animationType="none"
                onRequestClose={hideAlert}
                statusBarTranslucent
            >
                <Animated.View style={[styles.overlay, { opacity }]}>
                    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                        <View style={styles.iconWrapper}>
                            <MaterialIcons
                                name={icons[type].name}
                                size={48}
                                color={icons[type].color}
                            />
                        </View>

                        {/* Cabecera */}
                        {!!options?.title && (
                            <Text style={[styles.title, { color }]}>{options.title}</Text>
                        )}
                        {/* Mensaje */}
                        {!!options?.message && (
                            <Text style={styles.message}>{options.message}</Text>
                        )}

                        {/* Acciones */}
                        <View style={styles.actionsRow}>
                            {(options?.actions ?? [{ label: "Aceptar", variant: "primary" }]).map((a, idx) => {
                                const isPrimary = a.variant !== "ghost";
                                return (
                                    <TouchableOpacity
                                        key={`${a.label}-${idx}`}
                                        activeOpacity={0.9}
                                        onPress={() => { a.onPress?.(); hideAlert(); }}
                                        style={[styles.btn, isPrimary ? styles.btnPrimary : styles.btnGhost, isPrimary ? { backgroundColor: "#7b0029" } : { borderColor: "#7b0029" }]}
                                    >
                                        <Text style={[styles.btnText, isPrimary ? { color: "#fff" } : { color: "#7b0029" }]}>
                                            {a.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Animated.View>
                </Animated.View>
            </Modal>
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const ctx = useContext(AlertContext);
    if (!ctx) throw new Error("useAlert debe usarse dentro de <AlertProvider />");
    return ctx;
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    card: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        ...Platform.select({
            ios: { shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } },
            android: { elevation: 8 },
        }),
    },
    title: {
        fontSize: 18,
        fontFamily: "Roboto_700Bold",
        marginBottom: 6,
        textAlign: "center",
    },
    message: {
        fontSize: 15,
        fontFamily: "Roboto_400Regular",
        color: "#333",
        textAlign: "center",
        marginBottom: 16,
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 12,
    },
    btn: {
        minWidth: 110,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 22,
        alignItems: "center",
        borderWidth: 1.5,
    },
    btnPrimary: {},
    btnGhost: { backgroundColor: "#fff" },
    btnText: {
        fontSize: 15,
        fontFamily: "Roboto_700Bold",
    },
    iconWrapper: {
        alignItems: "center",
        marginBottom: 12,
    },

});
