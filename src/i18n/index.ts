import { I18nOptions, createI18n } from "vue-i18n";

import en from "./en.json";
import cn from "./cn.json";
import jp from "./jp.json";

const resources = {
  en: { ...en },
  cn: { ...cn },
  jp: { ...jp },
};

const lang = localStorage.getItem("lang") ?? "cn";

const i18n = createI18n({
  locale: lang,
  fallbackLocale: "en",
  legacy: false,
  globalInjection: true,
  messages: resources,
});

export default i18n;
