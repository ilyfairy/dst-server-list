<template>
  <v-navigation-drawer
    :model-value="isShow"
    @update:model-value="(v) => $emit('update:isShow', v)"
    temporary
    style="opacity: 0.9;"
    >
    <!-- color="#FFFFFFE0" -->

    <v-list class="pa-1 pt-4" dense>
      <v-list-item :title="$t('home.about')">
        <template v-slot:prepend>
          <v-icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>information-variant</title><path d="M13.5,4A1.5,1.5 0 0,0 12,5.5A1.5,1.5 0 0,0 13.5,7A1.5,1.5 0 0,0 15,5.5A1.5,1.5 0 0,0 13.5,4M13.14,8.77C11.95,8.87 8.7,11.46 8.7,11.46C8.5,11.61 8.56,11.6 8.72,11.88C8.88,12.15 8.86,12.17 9.05,12.04C9.25,11.91 9.58,11.7 10.13,11.36C12.25,10 10.47,13.14 9.56,18.43C9.2,21.05 11.56,19.7 12.17,19.3C12.77,18.91 14.38,17.8 14.54,17.69C14.76,17.54 14.6,17.42 14.43,17.17C14.31,17 14.19,17.12 14.19,17.12C13.54,17.55 12.35,18.45 12.19,17.88C12,17.31 13.22,13.4 13.89,10.71C14,10.07 14.3,8.67 13.14,8.77Z" /></svg>
          </v-icon>
        </template>
      </v-list-item>
    </v-list>

    <v-list class="mt-2">
      <v-list-item
        class="pa-5"
        v-for="i in items"
        :key="i.title"
        :href="i.url"
        target="_black"
      >
        <template v-slot:prepend>
          <v-icon v-if="i.svg_icon != null" v-html="i.svg_icon">
          </v-icon>
          <v-icon v-else>{{ i.icon }}</v-icon>
        </template>
        <v-list-item-title>{{ i.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import i18n from "@/i18n";
import icon from "/favicon.ico"


defineProps({
  isShow: Boolean,
});
defineEmits(["update:isShow"]);

const items : {
  title: string;
  url: string;
  icon?: string;
  svg_icon?: string;
}[] = [
  {
    title: "QQ Group",
    // icon: "mdi-qqchat",
    svg_icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>qqchat</title><path d="M3.18,13.54C3.76,12.16 4.57,11.14 5.17,10.92C5.16,10.12 5.31,9.62 5.56,9.22C5.56,9.19 5.5,8.86 5.72,8.45C5.87,4.85 8.21,2 12,2C15.79,2 18.13,4.85 18.28,8.45C18.5,8.86 18.44,9.19 18.44,9.22C18.69,9.62 18.84,10.12 18.83,10.92C19.43,11.14 20.24,12.16 20.82,13.55C21.57,15.31 21.69,17 21.09,17.3C20.68,17.5 20.03,17 19.42,16.12C19.18,17.1 18.58,18 17.73,18.71C18.63,19.04 19.21,19.58 19.21,20.19C19.21,21.19 17.63,22 15.69,22C13.93,22 12.5,21.34 12.21,20.5H11.79C11.5,21.34 10.07,22 8.31,22C6.37,22 4.79,21.19 4.79,20.19C4.79,19.58 5.37,19.04 6.27,18.71C5.42,18 4.82,17.1 4.58,16.12C3.97,17 3.32,17.5 2.91,17.3C2.31,17 2.43,15.31 3.18,13.54Z" /></svg>`,
    url: "https://jq.qq.com/?_wv=1027&k=TZHJaCBO",
  },
  {
    title: "Github",
    // icon: "mdi-github",
    svg_icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>github</title><path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" /></svg>`,
    url: "https://github.com/ilyfairy/DstServerQuery",
  },
];
</script>

<style scoped lang="scss">

</style>
