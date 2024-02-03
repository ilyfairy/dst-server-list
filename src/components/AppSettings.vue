<template>
  <v-dialog :model-value="isShow" @update:model-value="v => $emit('update:isShow', v)" class="v-container">
    <v-card rounded="xl">
      <v-card-title class="text-center"> {{ $t('setting.setting') }} </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field v-model="settings.font" variant="outlined" density="compact" :label="$t('setting.customFont')" @update:model-value="settings.SetFont()"></v-text-field>
          </v-col>
          <!-- <v-col cols="12" sm="6">
            <v-text-field v-model="settings.font" variant="outlined" density="compact" label="自定义字体"></v-text-field>
          </v-col> -->
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('update:isShow', false)" rounded="lg">{{ $t('close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
