<template>
  <VChip link @click="openPlayerUrl()" style="margin: 2px;">
    <span>{{ player.Name }}</span>
  </VChip>
</template>

<script setup lang="ts">
import { DstPlayer, Platform } from '@/scripts/models';
import { OpenPlayerUrl } from '@/scripts/utils';


const props = defineProps<{
  platform: Platform | number | null;
  player: DstPlayer;
}>();

function openPlayerUrl() {
  OpenPlayerUrl(props.platform, props.player);
}
</script>

<style></style>
