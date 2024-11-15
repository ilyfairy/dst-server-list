<template>
  <VThemeProvider :theme="app.theme">
    <!-- <v-locale-provider :locale="state.lang"> -->
    <VApp>
      <RouterView> </RouterView>

      <ScrollToTopButton />

      <!-- 底部提示(Toast) -->
      <VSnackbar
        v-model:model-value="alert.isShow"
        :timeout="1500"
        variant="elevated"
        :color="alert.color ?? '#C870FD'"
        round="pill"
      >
        {{ alert.message }}
        <template v-slot:actions>
          <VBtn variant="text" @click="alert.isShow = false">
            {{ $t("close") }}
          </VBtn>
        </template>
      </VSnackbar>
    </VApp>
    <!-- </v-locale-provider> -->
  </VThemeProvider>
</template>

<script setup lang="ts">
import ScrollToTopButton from "@/components/ScrollToTopButton.vue";
import { useSettingsStore } from "@/store/settings";
import { useAlertStore } from "@/store/alert";
import { useAppStore } from "@/store/app";
import { VSnackbar, VThemeProvider } from "vuetify/components";

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
