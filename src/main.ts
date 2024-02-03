import "core-js";
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./plugins/router";
import i18n from "./i18n";
import pinia from './store/index';
import "linqes";

loadFonts();

const app = createApp(App)
  .use(pinia)
  .use(vuetify)
  .use(router)
  .use(i18n);

app.mount("#app");
