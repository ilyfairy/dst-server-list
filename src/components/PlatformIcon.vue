<template>
  <div class="text-no-wrap">
    <template v-if="platform == Platform.Steam">
      <main-icon color="#707570">mdi-steam</main-icon>
    </template>
    <template v-if="platform == Platform.WeGame || platform == Platform.QQGame">
      <svg
        t="1642935465614"
        class="icon"
        style="position: relative; top: 2px"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="5952"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="16"
        height="16"
      >
        <path
          d="M799.36 469.333333H469.333333v85.333334h254.506667c0 13.866667 1.493333 28.16 1.493333 42.666666a213.333333 213.333333 0 0 1-426.666666 0c0-226.346667 112.426667-384 213.333333-384 64 0 133.76 64 175.36 170.666667h90.666667C728.533333 232.106667 628.053333 128 512 128c-164.906667 0-298.666667 210.133333-298.666667 469.333333a298.666667 298.666667 0 0 0 597.333334 0 730.666667 730.666667 0 0 0-11.306667-128z"
          p-id="5953"
        ></path>
      </svg>
    </template>

    <template v-if="platform == Platform.PlayStation || platform == Platform.PS4Official">
      <main-icon>mdi-sony-playstation</main-icon>
    </template>

    <template v-if="platform == Platform.Xbox">
      <main-icon>mdi-microsoft-xbox</main-icon>
    </template>

    <template v-if="platform == Platform.Switch">
      <main-icon>mdi-nintendo-switch</main-icon>
    </template>

    <span class="mr-1">{{ platform }}</span>
  </div>
</template>

<script setup lang="ts">
import { Platform } from "@/scripts/models";

interface IProps {
  platform: Platform | number | null;
}

defineProps<IProps>();
</script>

<style lang="scss" scoped>
.icon {
  fill: rgba(var(--v-theme-on-surface));
}
</style>
