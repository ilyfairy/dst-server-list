<template>
  <div class="container">
    <div class="item" style="background-color: chartreuse">AAAAAAAAA</div>
    <div class="item" style="background-color: aqua">AAAAAAAAA</div>
    <div class="item" style="background-color: aqua">AAAAAAAAA</div>
    <div class="item" style="width: 320px; background-color: aquamarine;zoom: 0.75;">
      AAAAAAAAA
    </div>
    <div class="item" style="background-color: bisque">AAAAAAAAA</div>
    <div class="item" style="width: 300px; background-color: brown">
      AAAAAAAAA
    </div>
    <div class="item" style="background-color: aqua">AAAAAAAAA</div>
    <div>
      <v-btn @mousedown="down()" @mouseup="up()" @click="history = true"
        >这是一个按钮</v-btn
      >
    </div>
    <v-dialog v-model="history">
      <v-card class="v-container">
        <v-card-text>
          <template v-for="i in 1000"> {{ i * i }} </template>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { delay } from "@/scripts/utils";
import { ref } from "vue";

const isUp = ref(false);
const history = ref(false);

function click() {
  if (!history.value) {
    console.log("打开玩家链接");
  }
}

async function down() {
  isUp.value = false;
  await delay(500);
  // console.log("标记为长按");
  isUp.value = true;
}
async function up() {
  if (isUp.value) {
    history.value = true;
    console.log("打开玩家历史");
  }
}
</script>

<style scoped>
.container {
  width: 700px;
  display: flex;
  flex-wrap: wrap;
  background-color: pink;
}

.item {
  width: 200px;
  height: 200px;
}
</style>
