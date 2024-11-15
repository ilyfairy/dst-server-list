<template>
  <VFabTransition>
    <VBtn
      :elevation="5"
      :icon="true"
      v-if="enabled"
      color=""
      @click="scrollToTop"
      class="position-fixed"
      style="right: 30px; bottom: 20vh"
    >
      <MainIcon color="#707570">mdi-chevron-up</MainIcon>
    </VBtn>
  </VFabTransition>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue";
import { VFabTransition } from "vuetify/components";

const enabled = ref(false);

onMounted(() => {
  window.addEventListener("scroll", () => {
    enabled.value = document.documentElement.scrollTop > 150;
  });
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
</script>
