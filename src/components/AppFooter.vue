<template>
  <div>
    <VFooter>
      <div style="width: 100vw; float: right">
        <div class="mb-2 total-info-box" style="font-size: 16px">
          <span class="mr-6">{{ $t("dst.latestVersion") }}:{{ dstInfo.totalInfo.Version ?? 0 }}</span>
          <span class="mr-6">{{ dstInfo.totalInfo.Servers ?? 0 }} {{ $t("dst.serverCountSuffix") }}</span>
          <span>{{ dstInfo.totalInfo.Connections }} {{ $t("dst.playerCountSuffix") }}</span>
        </div>
        <div class="d-flex flex-wrap" style="font-size: 16px">
          <span>&copy; 2021 ~ 2024 ilyfairy & SlimeNull. {{ $t("home.meow") }}</span>
          <VSpacer></VSpacer>
          <div class="d-flex justify-end filing" style="font-size: 9px; flex-direction: column">
            <a href="https://beian.miit.gov.cn/#/Integrated/index" style="zoom: 75%">
              粤ICP备2021174687号-2
              {{ locale == "cn" ? "" : "(Guangdong ICP Record)" }}
            </a>
          </div>
          <VSpacer></VSpacer>
          <div style="min-width: 11em; text-align: right" class="swap-controls">
            <span v-if="dstInfo.listLastUpdated && dstInfo.listLastUpdated >= 0">
              <MainIcon :size="16">mdi-clock-outline</MainIcon>
              {{ $t("home.lastUpdateTime") }}: {{ dstInfo.listLastUpdated }}{{ $t("home.sec") }}
            </span>
          </div>
        </div>
      </div>
    </VFooter>
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
  color: rgba(var(--v-theme-on-surface));
  &:visited {
    color: inherit;
  }
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
