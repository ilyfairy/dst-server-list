<template>
  <div>
    <v-footer>
      <div style="width: 100vw; float: right">
        <div class="mb-2 total-info-box" style="font-size: 16px">
          <span class="mr-6">{{ $t("dst.latestVersion") }}:{{ dstInfo.totalInfo.Version ?? 0 }}</span>
          <span class="mr-6">{{ dstInfo.totalInfo.Servers ?? 0 }} {{ $t("dst.serverCountSuffix") }}</span>
          <span>{{ dstInfo.totalInfo.Connections }} {{ $t("dst.playerCountSuffix") }}</span>
        </div>
        <div class="d-flex flex-wrap" style="font-size: 16px">
          <span>&copy; 2021 ~ 2024 ilyfairy & SlimeNull. {{ $t("home.meow") }}</span>
          <v-spacer></v-spacer>
          <div class="d-flex justify-end filing" style="font-size: 9px; flex-direction: column">
            <a href="https://beian.miit.gov.cn/#/Integrated/index" style="zoom: 75%">
              粤ICP备2021174687号-2
              {{ locale == "cn" ? "" : "(Guangdong ICP Record)" }}
            </a>
          </div>
          <v-spacer></v-spacer>
          <div style="min-width: 11em; text-align: right" class="swap-controls">
            <span v-if="dstInfo.listLastUpdated && dstInfo.listLastUpdated >= 0">
              <v-icon :size="16">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>clock-outline</title>
                  <path fill="#707570" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                </svg>
              </v-icon>
              {{ $t("home.lastUpdateTime") }}: {{ dstInfo.listLastUpdated }}{{ $t("home.sec") }}
            </span>
          </div>
        </div>
      </div>
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import { useListInfoStore } from "@/store/listInfo";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();

const dstInfo = useListInfoStore();

</script>

<style lang="scss" scoped>
a {
  // 链接样式
  opacity: 0.9;
  text-decoration: none;
  &:visited {
    color: inherit;
  }
  color: rgba(var(--v-theme-on-surface));
}

.total-info-box {
  text-align: right;
}

@media (max-width: 600px) {
  .total-info-box {
    text-align: center;
  }
  .filing {
    // 如果是手机, 则把备案号居中置底
    order: 99;
    text-align: center;
    width: 100%;
  }
}
</style>

<style></style>
