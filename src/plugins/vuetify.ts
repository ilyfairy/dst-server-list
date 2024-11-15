// Styles

// import "@mdi/font/css/materialdesignicons.css"; # 不再使用这个, 取而代之的是自定义的裁剪字体
// import "vuetify/styles";
import "@/styles/main.scss";
import "@/style.scss";

// // @ts-expect-error Missing type definitions
// import colors from "vuetify/lib/util/colors";

// Vuetify
import { createVuetify } from "vuetify";
import light from "@/themes/light";
import dark from "@/themes/dark";
import { useAppStore } from "@/store/app";
import pinia from "@/store/index";
import { VIcon } from "vuetify/components";

const appStore = useAppStore(pinia);

//获取储存的主题
let loadTheme: "light" | "dark" = "light";
if (localStorage.getItem("theme")?.toLowerCase() == "dark") {
  loadTheme = "dark";
}

appStore.theme = loadTheme;

export default createVuetify({
  theme: {
    defaultTheme: loadTheme,
    themes: {
      light,
      dark,
    },
  },
  aliases: {
    MainIcon: VIcon,
  },
  defaults: {
    MainIcon: {
      style: "color: #707570",
    },
    VCard: {
      rounded: "md",
    },
    VTextField: {
      rounded: "lg",
    },
    VAppBar: {
      VIcon: {
        style: "color: #707570",
      },
    },
    VToolbar: {
      VIcon: {
        style: "color: #707570",
      },
    },
    VField: {
      rounded: "lg",
      variant: "filled",
      color: "#70757055",
      // style: 'background-color: pink;'
    },
    VDataTableServer: {
      VSelect: {
        style: "",
        class: "rounded-lg",
      },
      VDataTableFooter: {
        VIcon: {
          size: "24px", // 页脚图标默认大小
        },
      },
      VPagination: {
        VIcon: {
          size: "24px", // 图标默认大小
        },
      },
      VIcon: {
        // 数据表格默认图标样式
        style: "color: #707570; width: 16px!important; height: 16px!important;",
        size: "16px", // v-icon图标默认大小import { useAppStore } from './../store/app';
      },
    },
  },
});
