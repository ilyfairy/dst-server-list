<template>
  <v-navigation-drawer
    :model-value="isShow"
    @update:model-value="(v) => $emit('update:isShow', v)"
    temporary
    style="opacity: 0.9;"
    >
    <!-- color="#FFFFFFE0" -->

    <v-list class="pa-1 pt-4" dense>
      <v-list-item prepend-icon="mdi-information-variant" :title="$t('home.about')">
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
          <v-icon>{{ i.icon }}</v-icon>
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

const items = [
  {
    title: "QQ Group",
    icon: "mdi-qqchat",
    url: "https://jq.qq.com/?_wv=1027&k=TZHJaCBO",
  },
  {
    title: "Github",
    icon: "mdi-github",
    url: "https://github.com/ilyfairy/DstServerQuery",
  },
];
</script>

<style scoped lang="scss">

</style>
