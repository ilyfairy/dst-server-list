import { defineStore } from "pinia";
import pinia from './index';

const smMediaQuery = window.matchMedia("(max-width: 600px)");
const mdMediaQuery = window.matchMedia("(max-width: 960px)");

export const useMediaQueryStore = defineStore('mediaQuery', {
  state: () => ({
    sm: smMediaQuery.matches,
    md: mdMediaQuery.matches,
  })
})


const store = useMediaQueryStore(pinia);

smMediaQuery.addEventListener("change", e => {
  store.sm = e.matches;
});
mdMediaQuery.addEventListener("change", e => {
  store.md = e.matches;
});