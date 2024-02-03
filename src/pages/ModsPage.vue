<template>
  <v-main style="background-color: rgb(var(--v-modinfo-background1)); color: rgb(var(--v-modinfo-foreground1))">
    <v-btn
        :elevation="5"
        icon="mdi-home"
        @click="$router.push('/')"
        class="position-fixed"
        style="left: 25px; top: 25px"
        variant="text"
      ></v-btn>
    <v-container>
      <v-row>
        <v-text-field :hide-details="true" variant="underlined" v-model="data.query.Text" class="mb-2">
        </v-text-field>
        <div class="d-flex align-center">
          <v-btn @click="QueryMods()" variant="text">搜索</v-btn>
        </div>
      </v-row>

      <v-row>
        <span
          >正在显示第 {{ fallbackNaN(data.response.PageIndex * (data.query.PageSize ?? 100) + 1, 0) }} -
          {{ fallbackNaN(data.response.PageIndex * (data.query.PageSize ?? 100) + data.response.Count, 0) }} 项</span
        >
        <span class="ml-4">共 {{ fallbackNaN(data.response.TotalCount, 0) }} 项条目</span>
      </v-row>

      <!-- Mods列表 -->
      <v-row style="justify-content: center">
        <template v-for="mod in data.response?.Mods" :key="mod.WorkshopId">
          <div style="margin: 10px; width: 200px">
            <div style="background-color: #7f000000; border: rgb(var(--v-modinfo-background2)) solid 1px" @click="ShowInfo(mod)">
              <v-img
                height="200px"
                v-if="mod.PreviewImageType?.includes('gif')"
                :src="mod.PreviewImageUrl + '?imw=100&imh=100&ima=fit&impolicy=Letterbox'"
              ></v-img>
              <v-img
                height="200px"
                v-else
                :src="mod.PreviewImageUrl + '?imw=200&imh=200&ima=fit&impolicy=Letterbox'"
              ></v-img>
            </div>
            <div class="text-center mt-1">{{ mod.Name }}</div>
          </div>
        </template>
      </v-row>
    </v-container>

    <!-- overscroll-behavior禁止父元素滚动 -->
    <v-dialog
      v-model="ui.dialog.show"
      :fullscreen="true"
      style="overscroll-behavior: contain; -ms-scroll-chaining: contain"
    >
      <!-- 每次open会重新加载 -->
      <mod-info-panel
        :info="ui.dialog.info"
        style="overscroll-behavior: contain; -ms-scroll-chaining: contain"
      ></mod-info-panel>

      <v-fab-transition>
        <v-btn
          :elevation="5"
          :icon="true"
          v-if="true"
          @click="ui.dialog.show = false"
          class="position-fixed"
          style="right: 25px; top: 25px"
          variant="text"
        >
          <v-icon >mdi-close</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-dialog>
  </v-main>
</template>

<script setup lang="ts">
import ModInfoPanel from "@/components/ModInfoPanel.vue";
import { QueryModsAsync, GetModsInfoAsync } from "@/scripts/api";
import { QueryModsParams } from "@/scripts/models";
import { QueryModsResponse, WebModInfoLite, WebModInfoResponse } from "@/scripts/response-model";
import { delay } from "@/scripts/utils";
import { onMounted, reactive, watch } from "vue";

const data = reactive({
  query: {
    Text: "",
    PageSize: 100,
    PageIndex: 0,
    Language: "Chinese",
  } as QueryModsParams,
  response: {} as QueryModsResponse,
});

const ui = reactive({
  dialog: {
    show: false,
    info: {} as WebModInfoLite,
  },
});

//监听dialog的打开状态
watch(
  () => ui.dialog.show,
  show => {
    // if (show) {
    //   if (history.state != null) {
    //     // 重复不通过'返回'关闭时, 确保不会污染history
    //     history.pushState(null, "", location.href); // 增加一个历史, 用来给window.onpopstate关闭dialog用
    //   }
    //   window.onpopstate = function () {
    //     ui.dialog.show = false;
    //   };
    // } else {
    //   window.onpopstate = null;
    // }
  },
);

async function QueryMods() {
  const r = await QueryModsAsync(data.query);
  if (r?.Code != 200) return;

  data.response = r;
}

//页数 fallback 0
function fallbackNaN(number: number | null, fallback: number) {
  if (number == null) return fallback;
  return isNaN(number) ? fallback : number;
}

async function ShowInfo(info: WebModInfoLite) {
  ui.dialog.info = info;
  ui.dialog.show = true;
}

onMounted(() => {
  window.onpopstate = null;
});

QueryMods();
</script>

<style>
:root {
  
}
</style>
