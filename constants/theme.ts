import { Platform } from "react-native";

/**
 * 🎨 Paleta de colores institucional PRIME
 * Basada en los tonos oficiales: vino (#7b0029), fucsia (#E60073), dorado (#BC955B)
 * y complementos grises claros.
 */

export const Colors = {
  // Modo claro
  light: {
    text: "#333333",
    textSecondary: "#666666",
    background: "#FFFFFF",
    cardBackground: "#f3f3f3",
    primary: "#7b0029",       // vino institucional
    secondary: "#A30052",     // vino más brillante
    accent: "#E60073",        // fucsia PRIME
    gold: "#BC955B",          // dorado institucional
    success: "#28a745",
    warning: "#FFC107",
    danger: "#dc3545",
    border: "#E0E0E0",
    shadow: "rgba(0, 0, 0, 0.15)",
    tint: "#7b0029",
    icon: "#A30052",
    tabIconDefault: "#A30052",
    tabIconSelected: "#E60073",
  },

  // Modo oscuro
  dark: {
    text: "#ECEDEE",
    textSecondary: "#C2C2C2",
    background: "#151718",
    cardBackground: "#1E1F21",
    primary: "#E60073",
    secondary: "#A30052",
    accent: "#BC955B",
    gold: "#BC955B",
    success: "#4CAF50",
    warning: "#FFC107",
    danger: "#f44336",
    border: "#2C2C2E",
    shadow: "rgba(255, 255, 255, 0.1)",
    tint: "#E60073",
    icon: "#E60073",
    tabIconDefault: "#A30052",
    tabIconSelected: "#E60073",
  },
};

/**
 * 🅰️ Tipografías principales
 * Roboto en tres pesos: Regular, Medium, Bold.
 * Ya deben estar cargadas con useFonts() en _layout.tsx
 */
export const Fonts = {
  regular: "Roboto_400Regular",
  medium: "Roboto_500Medium",
  bold: "Roboto_700Bold",

  // En caso de necesitar variantes adicionales
  italic: "Roboto_400Regular_Italic",
};

/**
 * 📏 Medidas y estilo base
 */
export const Theme = {
  spacing: (factor: number) => factor * 8,

  radius: {
    sm: 6,
    md: 12,
    lg: 20,
    xl: 30,
  },

  shadow: {
    light: {
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
    },
    medium: {
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 8,
      elevation: 5,
    },
    strong: {
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 8,
    },
  },

  // Fuentes del sistema por plataforma (para fallback)
  systemFonts: Platform.select({
    ios: {
      sans: "system-ui",
      serif: "ui-serif",
      rounded: "ui-rounded",
      mono: "ui-monospace",
    },
    android: {
      sans: "Roboto",
      serif: "serif",
      rounded: "sans-serif",
      mono: "monospace",
    },
    web: {
      sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      serif: "Georgia, 'Times New Roman', serif",
      rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
      mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    default: {
      sans: "normal",
      serif: "serif",
      rounded: "normal",
      mono: "monospace",
    },
  }),
};
