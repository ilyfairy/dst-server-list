import { defineStore } from "pinia";
import i18n from "@/i18n";
import { Language } from "@/scripts/units";

//进入页面自动设置语言
let lang = localStorage.getItem("lang");
if (!i18n.global.availableLocales.includes((lang as Language | null) ?? "cn")) {
  if (navigator.language != null) {
    switch (navigator.language.split("-")[0]) {
      case "zh":
        lang = "cn";
        break;
      case "en":
        lang = "en";
        break;
      case "jp":
        lang = "jp";
        break;
    }
  }
}
document.title = i18n.global.t("title");

export const useAppStore = defineStore("app", {
  state: () => ({
    lang: lang as Language,
    theme: "",
  }),
  actions: {
    switchLanguage(lang: Language) {
      this.lang = lang;
      localStorage.setItem("lang", lang);
      i18n.global.locale.value = lang;
      document.title = i18n.global.t("title");
    },
    switchTheme(theme: string) {
      this.theme = theme;
      localStorage.setItem("theme", theme);

      if (theme == "light") {
        localStorage.setItem("isDark", "false");
      } else if (theme == "dark") {
        localStorage.setItem("isDark", "true");
      }
    },
  },
});
