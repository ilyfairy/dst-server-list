import { defineStore } from "pinia";

const fontkey = "--font-default";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    font: null as null | string, // 全局字体
  }),
  getters: {},
  actions: {
    SetFont() {
      if (this.font && this.font != "") {
        document.documentElement.style.setProperty(fontkey, this.font);
      } else {
        document.documentElement.style.removeProperty(fontkey);
      }
    },
  },
  persist: {
    key: "settings",
    storage: window.localStorage,
  },
});
