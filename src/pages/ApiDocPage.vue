<template>
  <div>
    <iframe
      :style="{
        width: '100vw',
        height: data.height,
      }"
      :src="Consts.ApiDocUrl"
      frameborder="0"
      scrolling="no"
      ref="iframe"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from "vue";
import { onMounted } from "vue";
import { reactive, ref } from "vue";
import Consts from "@/store/Consts";

const iframe = ref<HTMLIFrameElement>();
const data = reactive({
  // width: undefined as number | string | undefined,
  height: "100vh",
});

onMounted(() => {
  addEventListener("message", receive);
});
onUnmounted(() => {
  removeEventListener("message", receive);
});

// location.replace(apiUrl);

function receive(e: MessageEvent) {
  if (e.data.type == "scroll") {
    data.height = e.data.scrollHeight + "px";
  }
}
</script>

<style scoped></style>
