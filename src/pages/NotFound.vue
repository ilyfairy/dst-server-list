<template>
  <div style="width: 100vw; height: 100vh; background-color: #017be0; color: white">
    <v-container class="mt-10">
      <p style="font-size: 100px">:(</p>
      <p>{{ $t("404.p1") }}</p>
      <p>{{ $t("404.p2") }}</p>
      <br />
      <p>{{ progress }}% {{ $t("404.complete") }}</p>
      <br />
      <div class="d-flex">
        <img src="/www.svg" width="100" height="100" class="mr-3" />
        <div style="font-size: 16px">
          <p class="mb-5">
            {{ $t("404.access") }}
            <span @click="back()">https://dstserverlist.top</span>
          </p>
          <p>{{ $t("404.call") }}:</p>
          <p>{{ $t("404.stopCode") }}: NOT_FOUND_EXCEPTION</p>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { delay, random } from "@/scripts/utils";
import { ref } from "vue";
import { useRouter } from "vue-router";

const progress = ref(0);
// const isUpgrade = ref(false);

const router = useRouter();

function back() {
  router.push("/");
}

async function Initialize() {
  while (progress.value < 100) {
    await delay(random(2000, 10000));
    progress.value += random(1, 3) * 10;
  }
  progress.value = 100;
  await delay(random(1000, 5000));
  back();
}

Initialize();
</script>

<style scoped></style>
