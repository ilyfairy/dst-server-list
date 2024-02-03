import { defineStore } from "pinia";

export const useAlertStore = defineStore("alert", {
  state: () => ({
    isShow: false,
    message: "",
    color: null as string | null,
  }),
  actions: {
    show(message: string, state: "success" | "error" | "warning" | "info" | null = null) {
      switch (state) {
        case "success":
          this.color = "green";
          break;
        case "error":
          this.color = "red";
          break;
        case "warning":
          this.color = "yellow";
          break;
        case "info":
          this.color = "blue";
          break;
        default:
          this.color = null;
          break;
      }
      //显示提示(Toast)
      this.isShow = false;
      setTimeout(() => {
        this.message = message;
        this.isShow = true;
      }, 10);
    },
  },
});
