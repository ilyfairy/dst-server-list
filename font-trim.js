import Fontmin from "fontmin";
import fs from "fs";

function getCss(name, id) {
  return `.${name}::before { content: "\\${id}"; }`;
}

const chars = {
  "mdi-alert-circle": "\u{F0028}",
  "mdi-arrow-down": "\u{F0045}",
  "mdi-arrow-up": "\u{F005D}",
  "mdi-brightness-4": "\u{F00DD}",
  "mdi-checkbox-blank-outline": "\u{F0131}",
  "mdi-checkbox-marked": "\u{F0132}",
  "mdi-chevron-down": "\u{F0140}",
  "mdi-chevron-left": "\u{F0141}",
  "mdi-chevron-right": "\u{F0142}",
  "mdi-chevron-up": "\u{F0143}",
  "mdi-clock-outline": "\u{F0150}",
  "mdi-close": "\u{F0156}",
  "mdi-close-circle": "\u{F0159}",
  "mdi-lightbulb-on-10": "\u{F1A4E}",
  "mdi-lock": "\u{F033E}",
  "mdi-menu": "\u{F035C}",
  "mdi-menu-down": "\u{F035D}",
  "mdi-menu-left": "\u{F035E}",
  "mdi-menu-right": "\u{F035F}",
  "mdi-menu-up": "\u{F0360}",
  "mdi-page-first": "\u{F0600}",
  "mdi-page-last": "\u{F0601}",
  "mdi-server-network": "\u{F048D}",
  "mdi-star": "\u{F04CE}",
  "mdi-star-half-full": "\u{F04D0}",
  "mdi-star-outline": "\u{F04D2}",
  "mdi-theme-light-dark": "\u{F050E}",
  "mdi-transfer-down": "\u{F0DA1}",
  "mdi-translate": "\u{F05CA}",
};
let text = "";
let css = "";

for (const name in chars) {
  text += chars[name];
  css += getCss(name, chars[name].codePointAt(0).toString(16).toUpperCase()) + '\n';
}

const fontmin = new Fontmin()
  .use(
    Fontmin.glyph({
      text: text,
    }),
  )
  .src(String.raw`./node_modules/@mdi/font/fonts/materialdesignicons-webfont.ttf`)
  .run(function (err, files) {
    if (err) {
      throw err;
    }
    fs.writeFileSync("./public/fonts/MaterialDesignIcons-Regular.ttf", files[0].contents);
  });
fs.writeFileSync("./src/styles/mdi-icon-trim.scss", css);
