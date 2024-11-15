<script setup lang="ts">
// 三开关switch

const props = defineProps<{
  modelValue: boolean | null;
  label: string;
  color?: string | undefined;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", arg1: typeof props.modelValue): void;
}>();
</script>

<template>
  <VSwitch
    :inset="true"
    :model-value="modelValue"
    :label="label"
    :disabled="modelValue == null"
    :hide-details="true"
    density="compact"
    :color="color"
    style="pointer-events: all; zoom: 80%;"
    @update:model-value="
      v => {
        if (v === false) {
          emit('update:modelValue', null);
        } else if (v === true) {
          emit('update:modelValue', true);
        }
      }
    "
    @click="
      if (modelValue === null) {
        emit('update:modelValue', false);
      }
    "
  ></VSwitch>
</template>

<style></style>
