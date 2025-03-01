import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import VitePluginVueDevTools from "vite-plugin-vue-devtools";
import path from "path";
import legacy from "@vitejs/plugin-legacy";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or 'modern'
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        dir: "dist",
        entryFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
        chunkFileNames: "assets/[name].[ext]",
        manualChunks: () => "main.js",
      },
    },
    chunkSizeWarningLimit: 1536,
  },
  server: {
    host: "127.0.0.1",
    port: 4000,
  },
  plugins: [
    vueJsx(),
    // legacy({
    //   // 兼容旧浏览器
    //   targets: ["defaults", "chrome 70"],
    //   renderLegacyChunks: true,
    //   additionalLegacyPolyfills: ["regenerator-runtime/runtime", "core-js/proposals/global-this"],
    //   polyfills: [
    //     "es.global-this",
    //     "es.symbol",
    //     "es.array.filter",
    //     "es.promise",
    //     "es.promise.finally",
    //     "es/map",
    //     "es/set",
    //     "es.array.for-each",
    //     "es.object.define-properties",
    //     "es.object.define-property",
    //     "es.object.get-own-property-descriptor",
    //     "es.object.get-own-property-descriptors",
    //     "es.object.keys",
    //     "es.object.to-string",
    //     "web.dom-collections.for-each",
    //     "esnext.global-this",
    //     "esnext.string.match-all",
    //   ],
    // }),
    vue(),
    vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
    VitePluginVueDevTools(),
  ],
  resolve: {
    alias: {
      // 得设置@别名才能使用'@/store'这种路径
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // "@": path.join(__dirname, "src"),
    },
  },
  envPrefix: [
    "BASE", // 这样才能访问BASE前缀的环境变量
    "API",
    "WEB",
  ],
});
