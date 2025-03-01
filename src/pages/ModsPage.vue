<script setup lang="ts">
import ModInfoPanel from "@/components/ModInfoPanel.vue";
import CancellationTokenSource from "@/scripts/Sharp/CancellationTokenSource";
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
  cts: new CancellationTokenSource(),
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
    document.documentElement.style.overflow = show ? "hidden" : "auto";

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
  data.cts.Cancel();
  data.cts = new CancellationTokenSource();
  const r = await QueryModsAsync(data.query, data.cts.Token);
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

<template>
  <VMain style="background-color: rgb(var(--v-modinfo-background1)); color: rgb(var(--v-modinfo-foreground1))">
    <!-- 回到主页 -->
    <VBtn
      :elevation="5"
      :icon="true"
      @click="$router.push('/')"
      class="position-fixed"
      style="left: 25px; top: 25px"
      variant="text"
    >
      <VIcon>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>home</title>
          <path fill="#707570" d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
        </svg>
      </VIcon>
    </VBtn>

    <!-- 当前页面 -->
    <VContainer>
      <VRow class="d-flex align-center justify-center">
        <VForm @submit.prevent="QueryMods()" class="d-flex justify-center align-center" style="width: 100%">
          <VTextField
            :hide-details="true"
            variant="underlined"
            v-model="data.query.Text"
            class="mb-2"
            style="max-width: 300px"
          >
          </VTextField>
          <VBtn variant="text" type="submit">{{ $t("steam.search") }}</VBtn>
          <!-- <div class="d-flex align-center">
          </div> -->
        </VForm>
      </VRow>

      <VRow>
        <!-- Showing 1-14 of 14 entries -->
        <!-- 正在显示第 1 - 20 项，共 20 项条目 -->
        <span v-if="data.response.Count != 0">{{
          $t("steam.searchResultLabel", [
            fallbackNaN(data.response.PageIndex * (data.query.PageSize ?? 100) + 1, 0),
            fallbackNaN(data.response.PageIndex * (data.query.PageSize ?? 100) + data.response.Count, 0),
            fallbackNaN(data.response.TotalCount, 0),
          ])
        }}</span>
        <span v-else>
          {{ $t("steam.notSearchResult") }}
        </span>
        <!-- <span
          >正在显示第 {{ fallbackNaN(data.response.PageIndex * (data.query.PageSize ?? 100) + 1, 0) }} -
          {{ fallbackNaN(data.response.PageIndex * (data.query.PageSize ?? 100) + data.response.Count, 0) }} 项</span
        >,
        <span class="ml-4">共 {{ fallbackNaN(data.response.TotalCount, 0) }} 个 Mods</span> -->
      </VRow>

      <!-- Mods列表 -->
      <VRow style="justify-content: center">
        <template v-for="mod in data.response?.Mods" :key="mod.WorkshopId">
          <div style="margin: 10px; width: 200px">
            <div
              style="background-color: #7f000000; border: rgb(var(--v-modinfo-background2)) solid 1px"
              @click="ShowInfo(mod)"
            >
              <VImg
                height="200px"
                v-if="mod.PreviewImageType?.includes('gif')"
                :src="mod.PreviewImageUrl + '?imw=100&imh=100&ima=fit&impolicy=Letterbox'"
              ></VImg>
              <VImg
                height="200px"
                v-else
                :src="mod.PreviewImageUrl + '?imw=200&imh=200&ima=fit&impolicy=Letterbox'"
              ></VImg>
            </div>
            <div class="text-center mt-1">{{ mod.Name }}</div>
          </div>
        </template>
      </VRow>
    </VContainer>

    <!-- overscroll-behavior禁止父元素滚动 -->
    <VDialog
      v-model="ui.dialog.show"
      :fullscreen="true"
      style="overscroll-behavior: contain; -ms-scroll-chaining: contain"
    >
      <!-- 每次open会重新加载 -->
      <ModInfoPanel
        :info="ui.dialog.info"
        style="overscroll-behavior: contain; -ms-scroll-chaining: contain"
      ></ModInfoPanel>

      <VFabTransition>
        <VBtn
          :elevation="5"
          :icon="true"
          v-if="true"
          @click="ui.dialog.show = false"
          class="position-fixed"
          style="right: 25px; top: 25px"
          variant="text"
        >
          <MainIcon>mdi-close</MainIcon>
        </VBtn>
      </VFabTransition>
    </VDialog>
  </VMain>
</template>

<style lang="scss">
</style>
