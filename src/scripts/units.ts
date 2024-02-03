import i18n from "@/i18n";

export enum SearchType {
  Server,
  Player,
}

export type Language = typeof i18n.global.locale.value;

export type ModsLanguage = "Chinese" | "English";
