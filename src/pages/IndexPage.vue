<template>
  <!-- <v-responsive> -->

  <!-- 左侧导航栏 -->
  <app-navigation v-model:is-show="uiState.isNavShow"></app-navigation>

  <!-- 顶栏 -->
  <v-app-bar class="my-elevation">
    <v-app-bar-nav-icon @click="uiState.isNavShow = true"></v-app-bar-nav-icon>
    <v-app-bar-title>{{ $t("title") }}</v-app-bar-title>

    <!-- V1 -->
    <v-btn :icon="true" @click="OpenV1()" style="font-weight: bold; color: #707570">V₁</v-btn>

    <v-btn icon="mdi-bee-flower" @click="$router.push('/mods')"></v-btn>

    <!-- api页面 -->
    <v-btn icon="mdi-api" @click="router.push('/api')"> </v-btn>

    <!-- 历史服务器管理 -->
    <v-btn :icon="true">
      <v-icon>mdi-clock-outline</v-icon>
      <v-menu activator="parent" :close-on-content-click="false" v-model="uiState.isServerHistoryShow">
        <v-card>
          <v-list>
            <!-- Header -->
            <v-list-item style="color: orange; font-weight: bold; font-size: 22px">
              <span>{{ $t("home.history") }}</span>
              <template v-slot:[`append`]>
                <v-btn variant="text" :icon="true" @click="ServerHistoryManager.Clear()">
                  <v-icon :size="28">mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-list-item>

            <!-- List -->
            <v-list-item
              v-for="(item, index) in ServerHistoryManager.history"
              v-bind:key="item.RowId"
              @click="
                ServerHistoryManager.ToTop(item);
                ShowServerCard(ServerCardDataType.HistoryItem, item);
                uiState.isServerHistoryShow = false;
              "
            >
              <v-list-item-title>{{ item.Name }}</v-list-item-title>
              <template v-slot:[`append`]>
                <v-btn :icon="true" @click="ServerHistoryManager.RemoveAt(index)" variant="text">
                  <v-icon :size="24">mdi-close</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-btn>

    <!-- 语言选项 -->
    <v-btn :icon="true">
      <v-icon>mdi-translate</v-icon>
      <v-menu activator="parent">
        <v-list>
          <v-list-item v-for="item in languages" v-bind:key="item.key" @click="appStore.switchLanguage(item.key)">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>

    <!-- 主题选项 -->
    <v-btn :icon="true">
      <v-icon>mdi-theme-light-dark</v-icon>
      <v-menu activator="parent">
        <v-list>
          <v-list-item @click="appStore.switchTheme('light')">
            <v-icon>mdi-lightbulb-on-10</v-icon>
            <span> Light</span>
          </v-list-item>
          <v-list-item @click="appStore.switchTheme('dark')">
            <v-icon>mdi-brightness-4</v-icon>
            <span> Dark</span>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-app-bar>

  <!-- 主要内容 -->
  <v-main>
    <v-container :fluid="false">
      <!-- 卡片包裹 -->
      <v-card density="compact" class="rounded-lg my-elevation">
        <!-- 工具栏 -->
        <app-toolbar
          v-model:input="data.input"
          @update:input="
            v => {
              if (v != null && v != '') {
                webHash.SetString(Names.Name, v);
              } else {
                webHash.SetString(Names.Name, null);
              }
            }
          "
          @fetch="QueryAsync()"
          v-model:search-type="data.searchType"
          @reset-filter="data.options.sortBy.length = 0"
        ></app-toolbar>

        <!-- 服务器列表 -->
        <v-data-table-server
          style="font-size: 16px !important"
          :items-per-page="data.options.itemsPerPage"
          v-model:options="data.options"
          :items-per-page-text="$t('home.itemsPerPage') + ':'"
          :items-per-page-options="[10, 20, 50, 100]"
          :items-length="listInfo.response?.TotalCount ?? 0"
          :headers="dynamicTabHeader as (typeof VDataTableServer)['headers']"
          :items="listInfo.response?.List"
          :no-data-text="$t('home.noData')"
          :loading="data.isLoading"
          :loading-text="$t('home.loading')"
          :multi-sort="true"
          @update:sort-by="
            v => {
              data.options.sortBy = v;
              QueryAsync();
            }
          "
          class="border-opacity"
        >
          <!-- 页脚 -->
          <!-- <template v-slot:bottom>
              <div style="display: flex;align-items: center;">
                <div style="flex: 1;">
                  <v-pagination
                    v-model="data.options.page"
                    :length="(data.data?.MaxPageIndex ?? 0) + 1"
                    @update:model-value="QueryAsync()"
                  ></v-pagination>
                </div>
                <div class="mr-2" style="display: flex;align-items: center;">
                  <span class="text-no-wrap ml-1">当前页数量:{{ data.data?.Count ?? 0 }}</span>
                  <v-btn>按钮</v-btn>
                  <v-combobox :items="[10,20,50,100]" variant="plain"></v-combobox>
                </div>
              </div>
            </template> -->

          <!-- 页脚2 -->
          <template v-slot:bottom>
            <div class="d-flex align-center ml-2 mr-4 table-footer">
              <!-- <span class="mr-3">{{ state.list?.Count ?? 0 }}</span> -->
              <!-- <span class="ml-2 mr-2"> of </span> -->
              <div class="ml-3">
                <!-- 页数选择 -->
                <v-pagination
                  active-color="#D459F6"
                  :length="(listInfo.response?.MaxPageIndex ?? 0) + 1"
                  v-model="data.options.page"
                  rounded="circle"
                  :show-first-last-page="mediaQuery.sm ? false : true"
                  :total-visible="mediaQuery.sm ? 3 : 5"
                  @update:model-value="QueryAsync()"
                ></v-pagination>
              </div>
              <!-- <span class="ml-2 mr-2">{{ $t("home.itemsPerPage") }}: </span> -->
              <div class="d-flex justify-end table-footer-item2">
                <div class="ml-3 mr-3">
                  <v-select
                    color="#555577"
                    rounded="lg"
                    v-model="data.options.itemsPerPage"
                    @update:model-value="v => QueryAsync()"
                    :items="[10, 20, 50, 100]"
                    :hide-details="true"
                    variant="outlined"
                    density="compact"
                  >
                  </v-select>
                </div>
                <div>
                  <v-btn @click="LoadNextPage()" variant="text" :icon="true">
                    <v-icon :size="24">mdi-transfer-down</v-icon>
                  </v-btn>
                </div>
                <!-- <span class="ml-3 mr-3" style="font-size: 20px">
                  Total: {{ state.list?.TotalCount ?? 0 }}
                </span> -->
              </div>
            </div>
          </template>

          <!-- 服务器名 -->
          <template v-slot:[`item.Name`]="{ item }">
            <div class="d-flex align-center">
              <div>
                <v-img
                  :src="
                    item.Address.IsoCode == null
                      ? item.Address.IP == '127.0.0.1' && item.Platform == Platform.WeGame
                        ? `/country-webp/CN.webp`
                        : undefined
                      : `/country-webp/${item.Address.IsoCode}.webp`
                  "
                  width="30"
                  class="mr-2"
                />
                <!-- <v-icon icon="logo.ico"></v-icon> -->
              </div>
              <div>
                <span>{{ item.Name }}</span>
              </div>
              <div>
                <!-- 打开服务器详细信息 -->
                <v-btn
                  :icon="true"
                  variant="flat"
                  size="35"
                  @click="
                    ShowServerCard(ServerCardDataType.ServerInfo, item);
                    ServerHistoryManager.AddHistory(item);
                  "
                >
                  <v-icon size="20">mdi-link-variant</v-icon>
                </v-btn>
              </div>
            </div>
          </template>

          <!-- 连接数 -->
          <template v-slot:[`item.Connected`]="{ item }">
            <div class="text-no-wrap">
              <span>{{ item.Connected }}/{{ item.MaxConnections }}</span>
              <span>
                <v-icon v-if="item.IsPassword">mdi-lock</v-icon>
              </span>
            </div>
          </template>

          <!-- 模式/风格 -->
          <template v-slot:[`item.Mode`]="{ item }">
            <span class="text-no-wrap">
              {{ item.Mode == null || item.Mode.length == 0 ? $t("unknown") : translate(item.Mode) }}
              /
              {{ translate(item.Intent ?? $t("unknown")) }}
            </span>
          </template>

          <!-- 天数 -->
          <template v-slot:[`item.DaysInfo`]="{ item }">
            <span>{{ item.DaysInfo?.Day }}</span>
          </template>

          <!-- 季节 -->
          <template v-slot:[`item.Season`]="{ item }">
            <span class="text-no-wrap">
              <span v-if="item.Season != null && item.Season != ''">
                {{ translate(CalcSeasonState(item.DaysInfo) + item.Season ?? $t("unknown")) }}
              </span>
              <span v-else class="no-data-text">{{ $t("unknown") }}</span>
              <span v-if="item.DaysInfo != null"> ({{ item.DaysInfo.Day }}{{ $t("home.days") }}) </span>
            </span>
          </template>

          <!-- 平台 -->
          <template v-slot:[`item.Platform`]="{ item }">
            <platform-icon :platform="item.Platform"></platform-icon>
          </template>

          <!-- 其它 -->
          <template v-slot:[`item.IsDedicated`]="{ item }">
            <v-icon v-if="item.IsDedicated == true" :color="item.IsKleiOfficial ? 'orange' : ''"
              >mdi-server-network</v-icon
            >
            <v-icon v-if="item.IsPvp == true">mdi-sword-cross</v-icon>
          </template>

          <!-- 地址 -->
          <template v-slot:[`item.Address`]="{ item }">
            <v-chip
              :link="true"
              variant="text"
              @click="
                copy(`c_connect(\x22${item.Address.IP}\x22,${item.Port})`);
                alert.show($t('home.copyConnectionCode'), 'success');
              "
            >
              {{ item.Address.IP }}:{{ item.Port }}
            </v-chip>
          </template>

          <!-- 玩家列表 -->
          <template v-slot:[`item.Players`]="{ item }">
            <player-clip v-for="player in item.Players" :key="player.NetId" :platform="item.Platform" :player="player">
            </player-clip>
          </template>
        </v-data-table-server>
      </v-card>

      <!-- 服务器详细信息弹窗 -->
      <server-card
        v-model:is-show="ServerCardInfo.show"
        :indexer="ServerCardInfo.indexer"
        v-model:query-type="ServerCardInfo.type"
        @update:is-show="
          v => {
            if (!v) webHash.SetString(Names.Server, null);
          }
        "
      >
      </server-card>
    </v-container>
  </v-main>
  <app-footer></app-footer>
  <!-- </v-responsive> -->
</template>

<script setup lang="ts">
import { reactive } from "vue";
import AppFooter from "@/components/AppFooter.vue";
import { copy, CalcSeasonState, delay } from "@/scripts/utils";
import AppNavigation from "@/components/AppNavigation.vue";
import { GetServerListAsync, GetTotalAsync } from "@/scripts/api";
import { Platform } from "@/scripts/models";
import { Language, SearchType } from "@/scripts/units";
import AppToolbar from "@/components/AppToolbar.vue";
import PlatformIcon from "@/components/PlatformIcon.vue";
import { translate } from "@/scripts/translate";
import router from "@/plugins/router";
import { GetDataTabHeader, languages } from "@/shared/page";
import { computed } from "vue";
import PlayerClip from "@/components/PlayerClip.vue";
import ServerCard from "@/components/ServerCard.vue";
import webHash from "@/scripts/WebAttribute";
import * as Names from "@/scripts/AttributeNames";
import ServerHistoryManager from "@/scripts/ServerHistoryManager";
import { ServerCardDataType, ShowServerCard, ServerCardInfo } from "@/shared/ServerCardInfo";
import { query } from "@/shared/filterData";
import { useAlertStore } from "@/store/alert";
import { useListInfoStore } from "@/store/listInfo";
import { useMediaQueryStore } from "@/store/mediaQuery";
import { useAppStore } from "@/store/app";
import { VDataTableServer } from "vuetify/components";
import "linqes";
import Consts from "@/store/Consts";

// const toClipboard = useClipboard().toClipboard;
const alert = useAlertStore();
const listInfo = useListInfoStore();
const mediaQuery = useMediaQueryStore();
const appStore = useAppStore();

function OpenV1() {
  window.location.pathname = Consts.WebV1;
}

//ui状态
const uiState = reactive({
  isNavShow: false, // 是否显示侧边栏
  // isServerShow: false,
  isServerHistoryShow: false,
});

//搜索信息
const data = reactive({
  input: "",
  searchType: SearchType.Server,
  fetchSignal: new AbortController(), // 取消请求
  isLoading: false,
  // query: {} as ListQueryParams,
  headersEnable: {
    // 要启用的表头
    Players: false,
    Address: false,
    DaysInfo: false,
  },
  // server: null as null | DstServerAll, // 当前对话框里显示的服务器
  options: {
    // 表格选项
    page: 1, // 页数, 从1开始
    itemsPerPage: 50,
  } as {
    page: number;
    itemsPerPage: number;
    search: null | undefined | string;
    sortBy: { key: string; order: "asc" | "desc" }[];
  },
});

//表头
const dynamicTabHeader = computed(() => {
  return GetDataTabHeader()
    .where(v => {
      // 过滤headersEnable中的列
      const prop = (data.headersEnable as any)[v.key as any];
      if (prop == null) return true;
      return prop === true;
    })
    .toArray();
});

//当hash更改后
webHash.OnChanged = v => {};

/**
 * 开始搜索
 * @param options 表格选项
 * @param abort 是否中止赋值
 */
async function QueryAsync(options?: typeof data.options, abort: boolean = false) {
  if (options == null) {
    options = data.options;
  }
  data.fetchSignal.abort();
  data.fetchSignal = new AbortController();

  //当没有数据时, 显示加载中 (没有搜索到 或者 首次出现)
  if (listInfo.response == null || listInfo.response.List == null || listInfo.response.List.length == 0) {
    data.isLoading = true;
  }

  query.IsDetailed = true;

  //搜索服务器名还是玩家名
  query.PlayerName = null;
  query.ServerName = null;
  if (data.searchType == SearchType.Server) {
    // 搜索服务器名
    data.headersEnable.Players = false;
    query.ServerName = {
      IsExclude: false,
      IsRegex: false,
      Value: data.input,
    };
  } else if (data.searchType == SearchType.Player) {
    // 搜索玩家名
    data.headersEnable.Players = true;
    query.PlayerName = {
      IsExclude: false,
      IsRegex: false,
      Value: data.input,
    };
  }

  //当options不为null
  if (options != null) {
    // 排序映射
    query.Sort = (options.sortBy ?? []).map(v => {
      let key = v.key;
      if (key == "Name") {
        if (data.searchType == SearchType.Server) {
          key = "ServerName";
        } else if (data.searchType == SearchType.Player) {
          key = "PlayerName";
        }
      } else if (v.key == "Season") {
        key = "Days";
      }
      return (v.order == "desc" ? "-" : "+") + key;
    });

    query.PageCount = options.itemsPerPage; // 每页的个数
    query.PageIndex = options.page - 1; // 页的索引 从0开始
  }

  // console.log("query", searchInfo.query);

  // 发送请求
  listInfo.totalInfo = await GetTotalAsync();
  const r = await GetServerListAsync(query, data.fetchSignal.signal);

  data.isLoading = false;
  if (r != null) {
    const lastUpdateSec = Math.floor((Date.now() - (r.LastUpdate as Date).getTime()) / 1000);
    listInfo.SetUpdateTimeout(lastUpdateSec); // 设置最后更新时间
  }
  if (!abort) {
    listInfo.response = r;
    listInfo.isMultiPage = false;
  }
  return r;
}

// /** 显示服务器信息 */
// async function ShowServerInfo(item: DstServerAll) {
//   webHash.SetString(Names.Server, item.RowId);
//   data.server = item;
//   // 确保服务器信息已切换过去
//   await delay(1);
//   ServerHistoryManager.AddHistory(item);
//   state.serverCard.show = true;

// }

/** 初始化 */
async function Initialize() {
  await delay(100);
  //是否显示服务器信息
  const rowId = webHash.GetString(Names.Server);
  if (rowId != null) {
    ShowServerCard(ServerCardDataType.RowIdOnly, rowId);
  }

  QueryAsync(); // 首次进入页面请求
}

/** 继续浏览下一页 */
async function LoadNextPage() {
  const oldList = listInfo.response;
  if (oldList == null) return;

  if (data.options.page - 1 >= oldList.MaxPageIndex) {
    return;
  }

  data.options.page++;

  const r = await QueryAsync(undefined, true);
  if (r == null || r.Code != 200) return;
  listInfo.isMultiPage = true;

  r.List = [...oldList.List, ...r.List];
  listInfo.response = r;
}

Initialize();
</script>

<style lang="scss">
// 禁止表格标题自动换行
.v-data-table-header__content {
  white-space: nowrap !important;
}
.my-elevation {
  // 自定义阴影
  box-shadow:
    #919eab4d 0 0 2px,
    #919eab1f 0 12px 24px -4px !important;
}
.border-opacity {
  // 数据表格的边框
  --v-border-opacity: 1 !important;
}

// 输入框的border颜色
.v-field__outline {
  color: #aaa !important;
}

.table-footer {
  justify-content: end; // 如果是pc, 则让表格的footer靠右对齐
}
@media (max-width: 600px) {
  .table-footer {
    // 如果是手机, 则让表格的footer居中对齐, 并让footer的元素自动换行
    justify-content: center;
    flex-wrap: wrap;
  }
  .table-footer-item2 {
    width: 100%; // 让第二个元素撑起宽度, 让其自动换行
  }
}
</style>
