import { ThemeDefinition } from "vuetify";

// 亮色主题
const light: ThemeDefinition = {
  dark: false,
  variables: {
    // 自定义前缀--v-的css变量
    "border-color": "#EEEEEE",
    // 'border-opacity': 1,
    "search-shadow-color": "rgba(145, 158, 171, 0.30)",
    "on-gray": "#333333",
    "dialog-card-bg": "#FFF4E6",
    yes: "#00BB00",
    no: "#CC0000",

    "modinfo-background1": "#fdfceb",
    "modinfo-background2": "#fbfecb", // 例如,边框颜色
    "modinfo-foreground1": "#1b2838",
    "modinfo-foreground2": "#616364", // #ACB2B8
    "modinfo-link": "#5aa9d6", // 链接未点击时的颜色
    "modinfo-link-hover": "#3676ff", // 链接悬浮时的颜色
    "modinfo-title": "#1b2838" // h1 h2 h3
  },
  colors: {
    // 自定义前缀--v-theme的css变量
    background: "#FFFFFF",
    surface: "#FFFFFF",
    primary: "#6200EE",
    "primary-darken-1": "#3700B3",
    secondary: "#03DAC6",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
    // inputBorder: "#f00",
  },
};

export default light;
