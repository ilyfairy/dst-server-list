import { ThemeDefinition } from "vuetify";

// 暗色主题
const dark: ThemeDefinition = {
  dark: true,
  variables: {
    "border-color": "#555555",
    "search-shadow-color": "rgba(40, 40, 40, 10)",
    "on-gray": "#DDDDDD",
    "dialog-card-bg": "#333333",
    yes: "#00BB00",
    no: "#CC0000",

    "modinfo-background1": "#1b2838",
    "modinfo-background2": "#222222",
    "modinfo-foreground1": "#EEE",
    "modinfo-foreground2": "#ACB2B8", // #ACB2B8
    "modinfo-link": "#FFF", // 链接未点击时的颜色
    "modinfo-link-hover": "#5aa9d6", // 链接悬浮时的颜色
    "modinfo-title": "#5aa9d6" // h1 h2 h3
  },
  colors: {},
};

export default dark;
