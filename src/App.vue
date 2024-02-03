<template>
  <v-theme-provider :theme="app.theme">
    <!-- <v-locale-provider :locale="state.lang"> -->
    <v-app>
      <router-view> </router-view>

      <scroll-to-top-button />

      <!-- 底部提示(Toast) -->
      <v-snackbar
        v-model:model-value="alert.isShow"
        :timeout="1500"
        variant="elevated"
        :color="alert.color ?? '#C870FD'"
        round="pill"
      >
        {{ alert.message }}
        <template v-slot:actions>
          <v-btn variant="text" @click="alert.isShow = false">
            {{ $t("close") }}
          </v-btn>
        </template>
      </v-snackbar>
    </v-app>
    <!-- </v-locale-provider> -->
  </v-theme-provider>
</template>

<script setup lang="ts">
import ScrollToTopButton from "@/components/ScrollToTopButton.vue";
import { useSettingsStore } from "@/store/settings";
import { useAlertStore } from "@/store/alert";
import { useAppStore } from "@/store/app";

const settings = useSettingsStore();
const alert = useAlertStore();
const app = useAppStore();

//屏蔽tab键
document.onkeydown = function (evt) {
  if (evt.code == "Tab") {
    evt.preventDefault();
  }
};

//设置
if(settings.font && settings.font != '') {
  settings.SetFont();
}

</script>

<style lang="scss">

</style>
