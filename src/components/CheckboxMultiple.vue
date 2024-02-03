<template>
  <v-row>
    <template v-for="opt in options" :key="GetStringTranslateValue(opt)">
    <v-checkbox
      v-model="selected"
      @update:model-value="$emit('update:modelValue', selected)"
      :label="opt.toString()"
      :value="opt.value"
    >
    </v-checkbox>
  </template>
  </v-row>
</template>

<script setup lang="ts">
import { CustomOptionValue } from "@/scripts/utils";
import { ref } from "vue";

const selected = ref<string[]>([]);

defineProps<{
  options: CustomOptionValue[];
  modelValue: string[];
}>();

defineEmits<{
  (event: "update:modelValue", arg1: string[]): void;
}>();
</script>

<style></style>
