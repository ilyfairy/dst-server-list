<template>
  <v-dialog :model-value="isShow" @update:model-value="v => emit('update:isShow', v)">
    <v-card elevation="4" rounded="xl" class="v-container">
      <!-- 标题 -->
      <v-card-title class="text-center">
        <span class="headline">{{ server?.Name }}</span>
        <span class="ml-1" v-if="data.titleSuffix != ''">{{ data.titleSuffix }}</span>
        <main-icon v-if="server?.IsPassword == true" :size="22">mdi-lock</main-icon>
        <v-progress-circular v-if="data.loading" :indeterminate="data.loading" :size="22"></v-progress-circular>
      </v-card-title>

      <!-- 标签页 -->
      <div>
        <v-tabs v-if="tabs.length > 1" :grow="true" v-model="data.tabSelected" density="compact">
          <v-tab v-for="item in tabs" :key="item.name" :value="item.name" color="primary">{{ item.label }}</v-tab>
        </v-tabs>
      </div>

      <!-- 内容 -->
      <div>
        <v-window v-if="server != null && server.Address != null" v-model="data.tabSelected" style="min-height: 100px">
          <!-- 主页 -->
          <v-window-item :value="allTabs.server.name">
            <div class="pt-6 pl-6 pr-6">
              <v-row>
                <!-- 地址端口 -->
                <v-col cols="12" sm="6" class="label-box">
                  <div class="label-title d-flex" style="align-items: center">
                    {{ $t("home.tableHeader.address") }}:
                  </div>
                  <div class="label-item" style="margin-left: -10px; /*往左边移动一点点 */">
                    <v-chip
                      variant="text"
                      style="font-size: 20px"
                      @click="
                        copy(`c_connect(\x22${server.Address.IP}\x22,${server!.Port})`);
                        alert.show($t('home.copyConnectionCode'), 'success');
                      "
                    >
                      {{ server.Address.IP }}:{{ server.Port }}
                    </v-chip>
                  </div>
                  <main-icon v-if="server.IsDedicated == true" :color="server.IsKleiOfficial ? 'orange' : ''" :size="20"
                    >mdi-server-network</main-icon
                  >
                  <span v-if="server.Nat == 7">({{ $t("dst.privateNetwork") }})</span>
                </v-col>

                <!-- 描述 -->
                <v-col cols="12" sm="6" class="label-box">
                  <div class="label-title">{{ $t("dst.description") }}:</div>
                  <div class="label-item">
                    <span v-if="server.Description == null || server.Description == ''" class="no-data-text">{{
                      $t("dst.noDescription")
                    }}</span>
                    <span v-else> {{ server.Description }}</span>
                  </div>
                </v-col>

                <!-- 季节 -->
                <v-col cols="12" sm="6" class="label-box">
                  <div class="label-title">{{ $t("home.tableHeader.season") }}:</div>
                  <div class="label-item">
                    <span v-if="server.DaysInfo != null" class="mr-3">{{
                      $t("home.daysMix", [server.DaysInfo.Day])
                    }}</span>
                    <!-- <span v-else class="no-data-text">{{ $t("unknown") }}</span> -->

                    <span v-if="server.Season != null">{{ icon(server.Season) }}{{ translate(server.Season) }}</span>
                    <span v-else class="no-data-text">{{ $t("unknown") }}</span>
                    <span v-if="server.DaysInfo != null">{{ GetSeasonDaysString(server.DaysInfo) }}</span>
                  </div>
                </v-col>

                <!-- 模式风格 -->
                <v-col cols="12" sm="6" class="label-box">
                  <div class="label-title">{{ $t("dst.modestyle") }}:</div>
                  <div class="label-item">
                    <span v-if="server.Mode != null">{{ translate(server.Mode) }}</span>
                    <span v-else class="no-data-text">{{ $t("unknown") }}</span>
                    <span>/</span>
                    <span v-if="server.Intent != null">{{ translate(server.Intent) }}</span>
                    <span v-else class="no-data-text">{{ $t("unknown") }}</span>
                  </div>
                </v-col>

                <!-- 平台 -->
                <v-col cols="12" sm="6" class="label-box">
                  <div class="label-title">{{ $t("home.tableHeader.platform") }}:</div>
                  <div class="label-item">
                    <platform-icon :platform="server.Platform"></platform-icon>
                  </div>
                  <div v-if="server.SteamClanId != null" class="md-2">
                    <v-chip @click="OpenSteamGroup(server.SteamClanId)">{{ $t("dst.steamGroup") }}</v-chip>
                    <!-- <v-btn @click="OpenSteamGroup(server.SteamClanId)">Steam群组</v-btn> -->
                  </div>
                </v-col>

                <!-- 其它 -->
                <v-col cols="12" sm="12" class="label-box d-flex flex-wrap">
                  <!-- 版本 -->
                  <div class="mr-10">
                    <span class="label-other-title">{{ $t("dst.version") }}:</span>
                    <span>{{ server.Version }}</span>
                    <span
                      v-if="
                        server != null &&
                        server.Version != null &&
                        listInfo.totalInfo.Version != null &&
                        parseInt(server.Version) < listInfo.totalInfo.Version
                      "
                      style="color: crimson"
                      >({{ $t("dst.legacy") }})</span
                    >
                  </div>
                  <!-- 是否PVP -->
                  <div class="d-flex flex-wrap">
                    <div class="mr-10">
                      <span class="label-other-title">PvP:</span>
                      <main-icon v-if="server.IsPvp" :size="22">mdi-sword-cross</main-icon>
                      <main-icon v-else :size="22">mdi-close</main-icon>
                    </div>
                  </div>
                  <!-- 是否仅允许好友加入 -->
                  <div v-if="server.IsFriendsOnly == true" class="d-flex flex-wrap">
                    <div class="mr-10">
                      <!-- <span class="label-other-title">仅允许好友加入</span> -->
                      <v-btn variant="tonal">{{ $t("dst.fo") }}</v-btn>
                      <!-- <v-icon :size="22">mdi-check-bold</v-icon> -->
                    </div>
                  </div>
                  <div v-if="server.IsServerPaused == true" class="d-flex flex-wrap">
                    <div class="mr-10">
                      <!-- <span class="label-other-title">世界已暂停</span> -->
                      <v-btn variant="tonal">{{ $t("dst.serverPaused") }}</v-btn>
                      <!-- <v-icon :size="22">mdi-check-bold</v-icon> -->
                    </div>
                  </div>
                </v-col>
              </v-row>

              <!-- Tags标签 -->
              <div>
                <p class="mt-8 mb-1 label-title">{{ $t("dst.tags") }}:</p>
                <div class="label-item">
                  <template v-for="tag in server.Tags" :key="tag">
                    <v-chip
                      class="mr-2 mt-2 text-color"
                      variant="elevated"
                      @click="null"
                      @click.right="v => tagsRightClick(v as PointerEvent, tag)"
                      >{{ tag }}</v-chip
                    >
                  </template>
                </div>
              </div>

              <!-- Tags右键菜单 -->
              <v-menu
                v-model="data.tagsContextMenu.show"
                :open-on-click="false"
                :style="{
                  left: data.contextPosition.x + 'px',
                  top: data.contextPosition.y + 'px',
                }"
              >
                <v-list>
                  <v-list-item @click="SearchTag()"> {{ $t("home.searchTags") }} </v-list-item>
                </v-list>
              </v-menu>

              <div class="mb-5"></div>

              <!-- 时间线 -->
              <!-- <div v-if="false">
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-title> 时间线 </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-timeline side="start" direction="horizontal">
                        <template v-for="item in ['qaq', 'qaq2', 'qwq', 'qwq2', 1, 2, 3, 4, 5, 67, 8]" :key="item">
                          <v-timeline-item style="">
                            <template v-slot:opposite>
                              {{ ToLocaleString(new Date(), false) }}
                            </template>
                            <div>qaq</div>
                          </v-timeline-item>
                        </template>
                      </v-timeline>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div> -->

              <!-- 服务器历史 -->
              <div v-if="data.history && data.history.Items && data.history.Items.length > 0">
                <player-count-timeline :list="data.history?.Items ?? null"> </player-count-timeline>
              </div>
            </div>
          </v-window-item>

          <!-- 玩家 -->
          <v-window-item :value="allTabs.player.name">
            <v-card-text>
              <template v-for="player in server.Players" :key="player.NetId">
                <v-btn
                  @click="OpenPlayerUrl(server.Platform, player)"
                  :color="`#${player.Color}`"
                  class="ma-2 text-none"
                  @click.right="(v: PointerEvent) => playerRightClick(v, player)"
                >
                  <span>{{ player.Name }}</span>
                  <span v-if="player.Prefab && player.Prefab != ''">({{ translate(player.Prefab) }})</span>
                  <span v-else>({{ $t("dst.notSelected") }})</span>
                </v-btn>
              </template>
              <v-menu
                v-model="data.playerContextMenu.show"
                :open-on-click="false"
                :style="{
                  left: data.contextPosition.x + 'px',
                  top: data.contextPosition.y + 'px',
                }"
              >
                <v-list>
                  <v-list-item @click="OpenPlayerUrl(server.Platform, data.playerContextMenu.playerInfo!)">
                    {{ $t("dst.playerProfile") }}
                  </v-list-item>
                  <v-list-item @click="SearchPrefab()"> {{ $t("dst.searchPrefab") }} </v-list-item>
                  <v-list-item @click="OpenPlayerHistory()"> {{ $t("dst.playerHistory") }} </v-list-item>
                </v-list>
              </v-menu>
            </v-card-text>
          </v-window-item>

          <!-- 模组 -->
          <v-window-item v-if="hasMods" :value="allTabs.mods.name">
            <v-card-text>
              <template v-for="mod in server.ModsInfo" :key="mod.Id">
                <v-btn
                  class="ma-2 text-none text-color"
                  @click="ShowModInfo(server.Platform, mod)"
                  @click.right="(v: PointerEvent) => modRightClick(v, mod)"
                  >{{ mod.Name }}
                  <span v-if="mod.CurrentVersion != mod.NewVersion" class="no-data-text">
                    ({{ $t("dst.legacy") }})
                  </span>
                </v-btn>
              </template>

              <!-- 右键菜单 -->
              <v-menu
                v-model="data.modsContextMenu.show"
                :open-on-click="false"
                :style="{
                  left: data.contextPosition.x + 'px',
                  top: data.contextPosition.y + 'px',
                }"
              >
                <v-list>
                  <v-list-item @click="OpenModUrl(server.Platform, data.modsContextMenu.modInfo!)">
                    {{ $t("dst.workshopLink") }}
                  </v-list-item>
                  <v-list-item @click="SearchMods()"> {{ $t("search") }}... </v-list-item>
                </v-list>
              </v-menu>
            </v-card-text>
          </v-window-item>

          <!-- 世界层级 -->
          <v-window-item :value="allTabs.worldLevel.name">
            <v-card-text>
              <div class="world-level-container">
                <div
                  v-for="item in [mainWorldLevel!, ...(server.Slaves ?? []), ...(server.Secondaries ?? [])]"
                  :key="item.Id"
                  class="mb-4 ml-4 mr-4"
                >
                  <v-card color="info" variant="tonal">
                    <v-card-text>
                      <p style="font-size: 22px;"># {{ item.Id }}</p>
                      <p>Address: {{ item.Address ?? server.Address.IP }}:{{ item.Port }}</p>
                      <p>SteamId: {{ item.SteamId }}</p>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </v-card-text>
          </v-window-item>
        </v-window>
      </div>

      <!-- close -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="Update(true)" rounded="lg">{{ $t("refresh") }}</v-btn>
        <v-btn @click="emit('update:isShow', false)" rounded="lg">{{ $t("close") }}</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="data.modinfoDialog.show" :fullscreen="true">
      <!-- 每次open会重新加载 -->
      <mod-info-panel :id="data.modinfoDialog.workshopId"></mod-info-panel>

      <!-- 关闭按钮 -->
      <v-fab-transition>
        <v-btn
          :elevation="5"
          :icon="true"
          v-if="true"
          @click="data.modinfoDialog.show = false"
          class="position-fixed"
          style="right: 25px; top: 25px"
          variant="text"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-dialog>

    
  </v-dialog>
</template>

<script setup lang="ts">
import { DstModInfo, DstPlayer, DstServerAll, Platform, WorldLevel } from "@/scripts/models";
import { reactive, ref, watch } from "vue";
import * as api from "@/scripts/api";
import { icon, translate } from "@/scripts/translate";
import i18n from "@/i18n";
import { computed } from "vue";
import { OpenPlayerUrl, OpenModUrl, copy, GetSeasonDaysString, OpenSteamGroup, delay } from "@/scripts/utils";
import PlayerCountTimeline from "./PlayerCountTimeline.vue";
import webHash from "@/scripts/WebAttribute";
import * as Names from "@/scripts/AttributeNames";
import { EscapeRegex } from "@/scripts/utils";
import { filter } from "@/shared/filterData";
import { ServerCardDataType, ServerCardIndexer } from "@/shared/ServerCardInfo";
import { HistoryItem } from "@/scripts/ServerHistoryManager";
import { ServerDetailsResponse, ServerHistoryResponse } from "@/scripts/response-model";
import PlatformIcon from "./PlatformIcon.vue";
import { useAlertStore } from "@/store/alert";
import { useListInfoStore } from "@/store/listInfo";
import { useMediaQueryStore } from "@/store/mediaQuery";
import CancellationTokenSource from "@/scripts/Sharp/CancellationTokenSource";
import ModInfoPanel from "./ModInfoPanel.vue";

const listInfo = useListInfoStore();
const alert = useAlertStore();

const data = reactive({
  tabSelected: "server",
  titleSuffix: "", // 标题后缀文字
  cts: new CancellationTokenSource(),
  loading: false,
  contextPosition: { x: 0, y: 0 }, // 光标位置
  tagsColor: {} as { [key: string]: string }, // tags颜色
  playerContextMenu: {
    // 玩家右键菜单
    show: false,
    playerInfo: null as null | DstPlayer,
  },
  modsContextMenu: {
    // mods右键菜单
    show: false,
    modInfo: null as null | DstModInfo,
  },
  tagsContextMenu: {
    // tags右键菜单
    show: false,
    tag: null as null | string,
  },
  history: null as null | ServerHistoryResponse, // 服务器历史记录
  modinfoDialog: {
    show: false,
    workshopId: null as null | number,
  }
});

const server = ref<null | DstServerAll>(null); // 获取到的服务器信息

const mainWorldLevel = computed(() => {
  if (server.value == null) return null;
  return {
    Address: server.value.Address.IP,
    Id: "1",
    Port: server.value.Port,
    SteamId: server.value.SteamId,
  } as WorldLevel;
});

const props = defineProps<{
  isShow: boolean;
  queryType: ServerCardDataType | null;
  indexer: ServerCardIndexer | null; // 提供必要的查询信息
}>();

// const hasPlayers = computed(() => {
//   return server.value?.Players?.length ?? 0 > 0;
// });

const hasMods = computed(() => {
  return server.value?.IsMods;
});

//所有标签页
const allTabs = computed(() => {
  return {
    server: {
      label: i18n.global.t("server"),
      name: "server",
    },
    player: {
      label: i18n.global.t("home.tableHeader.players") + `(${server.value?.Players?.length ?? 0}/${server.value?.MaxConnections ?? 0})`,
      name: "players",
    },
    mods: {
      label: i18n.global.t("mods") + `(${server.value?.ModsInfo?.length ?? 0})`,
      name: "mods",
    },
    worldLevel: {
      label: i18n.global.t("dst.worldLevel") + `(${1 + (server.value?.Secondaries?.length ?? 0)})`,
      name: "worldLevel",
    },
  };
});

//当前显示的标签页
const tabs = computed(() => {
  const tabs = [allTabs.value.server];
  tabs.push(allTabs.value.player);
  // if (hasPlayers.value) {
  // }
  if (hasMods.value) {
    tabs.push(allTabs.value.mods);
  }
  tabs.push(allTabs.value.worldLevel);
  return tabs;
});

const emit = defineEmits<{
  (event: "update:isShow", arg1: boolean): void;
  (event: "update:queryType", arg1: typeof props.queryType): void;
  // (event: "update:server", server: DstServerAll): void;
  // (event: "update:serverCardDataType", arg1: ServerCardDataType): void
}>();

//当前dialog页面, 当检测是打开时, 就自动更新数据
watch(
  () => props.isShow,
  async (newValue, oldValue) => {
    if (newValue == false || newValue == null) {
      data.cts.Cancel();
      return;
    }
    await Update();
  },
);

//ModInfo子页面
watch(() => data.modinfoDialog.show, async (newValue, oldValue) => {
  document.documentElement.style.overflow = newValue ? "hidden" : "auto";
});

async function Update(forceUpdate: boolean = false) {
  data.cts = new CancellationTokenSource();
  data.titleSuffix = "";

  // 如果刷新, 则变为Internal类型, 使用自己的server来查询
  let type = props.queryType;
  if (server.value != null && forceUpdate) {
    type = ServerCardDataType.Internal;
    emit("update:queryType", type);
  }

  //参数输入错误
  if (type == null || props.indexer == null) {
    return;
  }

  data.loading = true;
  let indexer: typeof props.indexer | null = null;
  let response: ServerDetailsResponse | null = null;
  let history: Promise<ServerHistoryResponse> | null = null;

  // 请求
  switch (type) {
    case ServerCardDataType.Internal: // 当点击刷新按钮时
      {
        if (server.value == null) break;
        webHash.SetString(Names.Server, server.value.RowId);
        response = await api.GetServerAsync(server.value.RowId, forceUpdate, data.cts.Token);
      }
      break;
    case ServerCardDataType.ServerInfo: // 当传入的是服务器信息
      {
        // data.tabIndex = 0;
        data.history = null;
        indexer = props.indexer as DstServerAll;
        history = api.GetServerHistoryAsync(indexer.RowId, data.cts.Token, true, true);
        // for (const tag of indexer.Tags ?? []) { // tags染色
        //   data.tagsColor[tag] = ColorManager.GetRandomColor(50, 200);
        // }
        server.value = indexer;
        webHash.SetString(Names.Server, indexer.RowId);
        response = await api.GetServerAsync(indexer.RowId, forceUpdate, data.cts.Token);
      }
      break;
    case ServerCardDataType.RowIdOnly: // 当传入的是RowId
      {
        // data.tabIndex = 0;
        data.history = null;
        server.value = null;
        indexer = props.indexer as string;
        history = api.GetServerHistoryAsync(indexer, data.cts.Token, true, true);
        webHash.SetString(Names.Server, indexer);
        response = await api.GetServerAsync(indexer, forceUpdate, data.cts.Token);
      }
      break;
    case ServerCardDataType.HistoryItem: // 当传入的是本地历史记录
      {
        // data.tabIndex = 0;
        data.history = null;
        server.value = null;

        indexer = props.indexer as HistoryItem;
        history = api.GetServerHistoryAsync(indexer.RowId, data.cts.Token, true, true);

        //请求RowId
        response = await api.GetServerAsync(indexer.RowId, forceUpdate, data.cts.Token);
        if (response?.Code == 200 && response.Server != null) {
          webHash.SetString(Names.Server, response.Server.RowId);
          break;
        }

        //请求失败, 请求Name+IP+Port
        // response = await api.GetServerAsync(indexer.RowId, forceUpdate, data.signal.signal);
      }
      break;
  }

  // 如果没有找到服务器
  data.loading = false;
  if (response == null || response.Code != 200 || response.Server == null) {
    data.titleSuffix = i18n.global.t("notFound");
    data.loading = false;
    return; // 请求失败
  }

  //获取标签颜色
  // if (response.Server.Tags && response.Server.Tags.length > 0) {
  //   const tagsColorResponse = await api.GetTagsColorAsync(response.Server.Tags);
  //   if (tagsColorResponse.Code == 200) {
  //     data.tagsColor = tagsColorResponse.Colors;
  //   }
  // }

  server.value = response.Server;

  if (history != null) {
    // 如果请求了历史记录, 则获取
    let temp = await history;

    // 如果详细信息获取是空的, 则获取简略信息
    if (temp == null || temp.Items == null || temp.Items.length == 0) {
      temp = await api.GetServerHistoryAsync(server.value.RowId, data.cts.Token, false, true);
    }

    // 追加记录
    if (server.value != null && temp?.Code == 200) {
      temp.Items = [
        ...temp.Items,
        {
          DateTime: new Date(), // 根据当前的数据创建一个新的记录
          DaysInfo: server.value.DaysInfo
            ? {
                Day: server.value.DaysInfo.Day,
                DaysElapsedInSeason: server.value.DaysInfo.DaysElapsedInSeason,
                DaysLeftInSeason: server.value.DaysInfo.DaysLeftInSeason,
                TotalDaysSeason: server.value.DaysInfo.TotalDaysSeason,
              }
            : null,
          Season: server.value.Season?.toString() ?? null,
          PlayerCount: server.value.Players?.length ?? server.value.Connected ?? 0,
          Players:
            server.value.Players?.map(v => {
              return {
                Id: v.NetId!,
                Name: v.Name!,
                Platform: server.value!.Platform!,
              };
            }) ?? null,
        },
      ];
    }

    data.history = temp;
  }

  // 更新列表
  if (listInfo.response != null && listInfo.response.List != null && server.value != null) {
    for (let i = 0; i < listInfo.response.List.length; i++) {
      if (listInfo.response.List[i].RowId == server.value.RowId) {
        listInfo.response.List[i] = server.value;
        break;
      }
    }
  }
}

//右键玩家
async function playerRightClick(v: PointerEvent, player: DstPlayer) {
  v.preventDefault();
  const rect = window.document.body.getBoundingClientRect();
  data.contextPosition = { x: rect.x + v.clientX, y: -rect.y + v.clientY }; // 获取光标相对于document的位置
  data.playerContextMenu.playerInfo = player;
  data.playerContextMenu.show = true;
}

//右键标签
async function tagsRightClick(v: PointerEvent, tag: string) {
  v.preventDefault();
  const rect = window.document.body.getBoundingClientRect();
  data.contextPosition = { x: rect.x + v.clientX, y: -rect.y + v.clientY }; // 获取光标相对于document的位置
  data.tagsContextMenu.tag = tag;
  data.tagsContextMenu.show = true;
}

//右键Mod
async function modRightClick(v: PointerEvent, mod: DstModInfo) {
  v.preventDefault();
  const rect = window.document.body.getBoundingClientRect();
  data.contextPosition = { x: rect.x + v.clientX, y: -rect.y + v.clientY };
  data.modsContextMenu.modInfo = mod;
  data.modsContextMenu.show = true;
}

async function OpenPlayerHistory() {}

//搜索Mod名
function SearchMods() {
  const name = EscapeRegex(data.modsContextMenu.modInfo!.Name);
  webHash.SetString(Names.ModsName, name);
  filter.modsNameRaw = "\x01" + name;
  emit("update:isShow", false);
}

/** 搜索玩家选择的角色名 */
function SearchPrefab() {
  const prefab = data.playerContextMenu.playerInfo!.Prefab;
  if (prefab == null || prefab == "") return;
  webHash.SetString(Names.Prefab, prefab);
  filter.prefabRaw = "\x01" + prefab;
  emit("update:isShow", false);
}

function SearchTag() {
  const tag = EscapeRegex(data.tagsContextMenu.tag!);
  if (tag == null || tag == "") return;
  webHash.SetString(Names.Tags, tag);
  filter.tagsRaw = "\x01" + tag;
  emit("update:isShow", false);
}

function ShowModInfo(platform: Platform | number | null, mod: DstModInfo) {
  if(platform == null) return;
  if(platform != Platform.Steam){
    if(platform != 1){
      OpenModUrl(platform, mod);
      return;
    }
  }

  data.modinfoDialog.workshopId = mod.Id;
  data.modinfoDialog.show = true;
}
</script>

<style scoped lang="scss">
.text-color {
  color: rgba(var(--v-on-gray)) !important;
  background-color: rgba(var(--v-dialog-card-bg));
}

// 隐藏卡片的滚动条
// ::-webkit-scrollbar {
//   width: 0px;
//   height: 0px;
// }

//标签样式
.label-box {
  display: flex;
  align-items: center;
}
.label-title {
  text-wrap: nowrap;
  font-size: 20px;
  // font-weight: bold;
  // color: var(--v-theme-primary);
  // color: pink;
  margin-right: 10px;
}
.label-other-title {
  text-wrap: nowrap;
  font-size: 20px;
}

// WorldLevel的网格
.world-level-container {
  // 大屏幕三列
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(3, 1fr);
}
@media (max-width: 1280px) {
  // 中屏幕两列
  .world-level-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 800px) {
  // 小屏幕一列
  .world-level-container {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
