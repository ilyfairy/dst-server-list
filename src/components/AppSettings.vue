<template>
  <VDialog :model-value="isShow" @update:model-value="v => $emit('update:isShow', v)" class="v-container">
    <VCard rounded="xl">
      <VCardTitle class="text-center"> {{ $t('setting.setting') }} </VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12" sm="6">
            <VTextField v-model="settings.font" variant="outlined" density="compact" :label="$t('setting.customFont')" @update:model-value="settings.SetFont()"></VTextField>
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn @click="$emit('update:isShow', false)" rounded="lg">{{ $t('close') }}</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/store/settings";

const settings = useSettingsStore();

defineProps<{
  isShow: boolean;
}>();

const emit = defineEmits<{
  (event: "update:isShow", arg1: boolean): void;
}>();
</script>

<style></style>
