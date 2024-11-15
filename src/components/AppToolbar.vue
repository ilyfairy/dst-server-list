<template>
  <div>
    <VToolbar id="toob" :flat="true" color="transparent" class="text-caption">
      <div class="table-title"></div>
      <VToolbarTitle v-if="mediaQuery.sm == false">{{ $t("home.serverList") }}</VToolbarTitle>
      <VSpacer v-if="mediaQuery.sm == false"></VSpacer>

      <!-- 输入框 -->
      <VTextField
        :placeholder="placeholder"
        :hide-details="true"
        :single-line="true"
        :model-value="input"
        @update:model-value="OnInputChanged"
        @keydown.enter="emit('fetch')"
        class="mr-1 search-box rounded-lg"
        :clearable="true"
        variant="solo"
        density="compact"
        :flat="true"
      >
        <template v-slot:prepend-inner>
          <MainIcon>mdi-magnify</MainIcon>
        </template>
      </VTextField>

      <!-- 过滤按钮 -->
      <VBtn
        :icon="true"
        @click="
          ui.isShowFilter = !ui.isShowFilter;
          InitDynamicOptions();
        "
      >
        <MainIcon>mdi-filter-variant</MainIcon>
      </VBtn>
      <VBtn :icon="true" @click="ResetFilter()">
        <MainIcon>mdi-filter-variant-remove</MainIcon>
      </VBtn>

      <VBtn :icon="true" @click="ui.isShowSettings = true">
        <MainIcon>mdi-tune</MainIcon>
      </VBtn>
    </VToolbar>

    <VExpandTransition>
      <!-- 里面的组件消失时会自动进行高度的过渡动画 -->
      <div v-show="ui.isShowFilter">
        <VContainer fluid>
          <VRow>
            <VCol cols="12" sm="24">
              <div class="d-flex ml-2 flex-wrap switch-container">
                <!-- 是否搜索玩家 -->
                <div class="mr-6">
                  <VSwitch
                    :label="$t('home.searchPlayer')"
                    :model-value="searchType"
                    :inset="true"
                    :true-value="SearchType.Player"
                    :false-value="SearchType.Server"
                    :hide-details="true"
                    color="primary"
                    density="compact"
                    style="zoom: 80%"
                    @update:model-value="
                      (v: any) => {
                        if (v == SearchType.Player) {
                          webHash.SetBoolean(Names.IsPlayer, true);
                        } else {
                          webHash.SetBoolean(Names.IsPlayer, null);
                        }
                        emit('update:searchType', v);
                        DelayFetch();
                      }
                    "
                  ></VSwitch>
                </div>

                <!-- 是否PVP -->
                <div class="mr-6">
                  <ASwitch label="PvP" v-model="filter.isPvp" color="#E00" @update:model-value="DelayFetch()">
                  </ASwitch>
                </div>

                <!-- 是否启用模组 -->
                <div class="mr-6">
                  <ASwitch label="Mods" v-model="filter.isMods" color="#A50" @update:model-value="DelayFetch()">
                  </ASwitch>
                </div>

                <!-- 是否专用服务器 -->
                <div class="mr-6">
                  <ASwitch
                    :label="$t('dst.dedicatedServer')"
                    v-model="filter.isDedicated"
                    color="#E70"
                    @update:model-value="DelayFetch()"
                  >
                  </ASwitch>
                </div>

                <!-- 是否是最新版本 -->
                <div class="mr-6">
                  <ASwitch
                    :label="$t('dst.latestVersion')"
                    v-model="filter.isLatestVersion"
                    color="#0A0"
                    @update:model-value="DelayFetch()"
                  >
                  </ASwitch>
                </div>

                <!-- 服务器是否已暂停 -->
                <div class="mr-6">
                  <ASwitch
                    :label="$t('dst.serverPaused')"
                    v-model="filter.isServerPaused"
                    color="#8AA"
                    @update:model-value="DelayFetch()"
                  >
                  </ASwitch>
                </div>

                <!-- 仅允许好友加入 -->
                <div class="mr-6">
                  <ASwitch
                    :label="$t('dst.friendsOnly')"
                    v-model="filter.isFriendsOnly"
                    color="#DD0"
                    @update:model-value="DelayFetch()"
                  >
                  </ASwitch>
                </div>

                <!-- 允许新玩家加入 -->
                <div class="mr-6">
                  <ASwitch
                    :label="$t('dst.allowNewPlayer')"
                    v-model="filter.isAllowNewPlayers"
                    color="#D90"
                    @update:model-value="DelayFetch()"
                  >
                  </ASwitch>
                </div>

                <!-- NAT -->
                <div class="mr-6">
                  <ASwitch
                    label="Password"
                    v-model="filter.isPassword"
                    color="#03A"
                    @update:model-value="DelayFetch()"
                  >
                  </ASwitch>
                </div>

                <!-- NAT -->
                <div class="mr-6">
                  <ASwitch
                    :label="natTypeLabel"
                    v-model="filter.natType"
                    color="#03A"
                    @update:model-value="DelayFetch()"
                  >
                  </ASwitch>
                </div>
              </div>
            </VCol>
          </VRow>

          <VRow>
            <!-- 平台 -->
            <VCol cols="12" sm="6">
              <AutoCompletionMultiple
                :label="$t('home.tableHeader.platform')"
                :pre-options="options.platform"
                v-model="filter.platformRaw"
                @update:new-array="handles.platformHandle"
                :is-array="true"
              >
              </AutoCompletionMultiple>
            </VCol>

            <!-- 季节输入 -->
            <VCol cols="12" sm="6">
              <AutoCompletionMultiple
                :label="$t('home.tableHeader.season')"
                :pre-options="options.season"
                v-model="filter.seasonRaw"
                @update:new-array="handles.seasonHandle"
                :is-array="true"
              >
              </AutoCompletionMultiple>
            </VCol>
          </VRow>

          <VRow>
            <!-- 游戏模式 -->
            <VCol cols="12" sm="6">
              <AutoCompletionMultiple
                :label="$t('home.tableHeader.gamemode')"
                :pre-options="options.mode"
                v-model="filter.modeRaw"
                @update:new-array="handles.modeHandle"
              >
              </AutoCompletionMultiple>
            </VCol>

            <!-- 游戏风格 -->
            <VCol cols="12" sm="6">
              <AutoCompletionMultiple
                :label="$t('home.tableHeader.intentx')"
                :pre-options="options.intent"
                v-model="filter.intentRaw"
                @update:new-array="handles.intentHandle"
              >
              </AutoCompletionMultiple>
            </VCol>
          </VRow>

          <VRow>
            <!-- 游戏模式 -->
            <VCol cols="12" sm="6">
              <AutoCompletionMultiple
                label="Tags"
                :pre-options="dynamicOptions.tags"
                v-model="filter.tagsRaw"
                @update:new-array="handles.tagsHandle"
              >
              </AutoCompletionMultiple>
            </VCol>

            <!-- 玩家角色 -->
            <VCol cols="12" sm="6">
              <AutoCompletionRegex
                :label="`${$t('dst.prefab')} (Regex)`"
                :pre-options="options.prefabs"
                v-model="filter.prefabRaw"
                @update:model-value="handles.prefabHandle"
              >
              </AutoCompletionRegex>
            </VCol>
          </VRow>

          <VRow>
            <!-- 模组名称 -->
            <VCol cols="12" sm="6">
              <AutoCompletionRegex
                :label="`${$t('dst.modsName')} (Regex)`"
                :pre-options="options.modsName"
                v-model="filter.modsNameRaw"
                @update:model-value="handles.modsNameHandle"
              >
              </AutoCompletionRegex>
            </VCol>

            <!-- 描述 -->
            <VCol cols="12" sm="6">
              <AutoCompletionRegex
                :label="`${$t('dst.description')} (Regex)`"
                :pre-options="[]"
                v-model="filter.descriptionRaw"
                @update:model-value="handles.descriptionHandle"
              >
              </AutoCompletionRegex>
            </VCol>
          </VRow>
        </VContainer>
      </div>
    </VExpandTransition>

    <AppSettings v-model:is-show="ui.isShowSettings"> </AppSettings>
  </div>
</template>

<script setup lang="ts">
import i18n from "@/i18n";
import { SearchType } from "@/scripts/units";
import { reactive } from "vue";
import * as utils from "@/scripts/utils";
import { translate } from "@/scripts/translate";
import { computed } from "vue";
import AutoCompletionMultiple from "./AutoCompletionMultiple.vue";
import AutoCompletionRegex from "./AutoCompletionRegex.vue";
import { Season, Platform, Intention, GameMode } from "@/scripts/models";
import { GetModsNameAsync, GetPrefabsAsync, GetTagsAsync } from "@/scripts/api";
import { LockToken, CustomOptionValue, EscapeRegex } from "@/scripts/utils";
import ASwitch from "./ASwitch.vue";
import webHash from "@/scripts/WebAttribute";
import * as Names from "@/scripts/AttributeNames";
import { filter, query } from "@/shared/filterData";
import AppSettings from "@/components/AppSettings.vue";
import { useListInfoStore } from "@/store/listInfo";
import { useMediaQueryStore } from "@/store/mediaQuery";
import "linqes";
import { VToolbarTitle } from "vuetify/components";

const listInfo = useListInfoStore();
const mediaQuery = useMediaQueryStore();

const ui = reactive({
  isShowFilter: false,
  isShowSettings: false,
});

const natTypeLabel = computed(() => {
  if (filter.natType == false) {
    return i18n.global.t("dst.privateNetwork");
  } else if (filter.natType == true) {
    return i18n.global.t("dst.publicNetwork");
  }
  return i18n.global.t("dst.networkType");
});

//动态过滤选项
const dynamicOptions = reactive({
  isInit: false,
  prefabs: [] as CustomOptionValue[],
  tags: [] as CustomOptionValue[],
  modsName: [] as CustomOptionValue[],
});

//过滤选项
const options = computed(() => {
  return {
    season: [
      MakeTranslateOption(Season.Spring),
      MakeTranslateOption(Season.Summer),
      MakeTranslateOption(Season.Autumn),
      MakeTranslateOption(Season.Winter),
      utils.MakeOption("other", i18n.global.t("other"), true),
    ],
    platform: [
      utils.MakeOption(Platform.Steam),
      utils.MakeOption(Platform.WeGame),
      utils.MakeOption(Platform.Xbox),
      utils.MakeOption(Platform.Switch),
      utils.MakeOption(Platform.PlayStation),
      utils.MakeOption(Platform.PS4Official),
      utils.MakeOption("other", i18n.global.t("other"), true),
    ],
    prefabs: dynamicOptions.prefabs,
    intent: [
      MakeTranslateOption(Intention.Relaxed),
      MakeTranslateOption(Intention.Endless),
      MakeTranslateOption(Intention.Survival),
      MakeTranslateOption(Intention.Wilderness),
      MakeTranslateOption(Intention.Lightsout),
      MakeTranslateOption(Intention.Cooperative),
      MakeTranslateOption("oceanfishing"),
      utils.MakeOption("other", i18n.global.t("other"), true),
    ],
    mode: [
      MakeTranslateOption(GameMode.Survival),
      MakeTranslateOption(GameMode.Endless),
      MakeTranslateOption(GameMode.Lavaarena),
      MakeTranslateOption("OceanFishing"),
      utils.MakeOption("other", i18n.global.t("other"), true),
    ],
    modsName: dynamicOptions.modsName,
  };
});

const handles = {
  seasonHandle(v: string[]) {
    if (v.length == 1 && v[0] == "other") {
      // 选择'其它'时
      filter.season = {
        Value: options.value.season.select(v => v.value).where(v => v != "other").toArray(),
        IsExclude: true,
      };
    } else {
      filter.season.Value = v;
      filter.season.IsExclude = false;
    }
    query.Season = filter.season;
    webHash.SetString(Names.Season, filter.seasonRaw);
    DelayFetch();
  },
  platformHandle(v: string[]) {
    if (v.length == 1 && v[0] == "other") {
      filter.platform = {
        Value: options.value.platform.select(v => v.value).where(v => v != "other").toArray(),
        IsExclude: true,
      };
    } else {
      filter.platform.Value = v;
      filter.platform.IsExclude = false;
    }
    query.Platform = filter.platform;
    webHash.SetString(Names.Platform, filter.platformRaw);
    DelayFetch();
  },
  prefabHandle(v: string) {
    filter.prefab.Value = v;
    query.PlayerPrefab = filter.prefab;
    webHash.SetString(Names.Prefab, v);
    DelayFetch();
  },
  modeHandle(v: string[]) {
    if (v.length == 1 && v[0] == "other") {
      // 选择'其它'时
      filter.mode = {
        Value: options.value.mode.select(v => v.value).where(v => v != "other").toArray(),
        IsExclude: true,
      };
    } else {
      filter.mode.Value = v;
      filter.mode.IsExclude = false;
    }
    query.GameMode = filter.mode;
    webHash.SetString(Names.GameMode, filter.modeRaw);
    DelayFetch();
  },
  intentHandle(v: string[]) {
    if (v.length == 1 && v[0] == "other") {
      // 选择'其它'时
      filter.intent = {
        Value: options.value.intent.select(v => v.value).where(v => v != "other").toArray(),
        IsExclude: true,
      };
    } else {
      filter.intent.Value = v;
      filter.intent.IsExclude = false;
    }
    query.Intent = filter.intent;
    webHash.SetString(Names.Intent, filter.intentRaw);
    DelayFetch();
  },
  tagsHandle(v: string[]) {
    filter.tags.Value = v;
    query.Tags = filter.tags;
    webHash.SetString(Names.Tags, filter.tagsRaw);
    DelayFetch();
  },
  modsNameHandle(v: string) {
    filter.modsName.Value = v;
    query.ModsName = filter.modsName;
    webHash.SetString(Names.ModsName, v);
    DelayFetch();
  },
  descriptionHandle(v: string) {
    let newValue: string | null = v; // 如果是空格则设置为null
    if (newValue == "") newValue = null;
    filter.description.Value = newValue;
    query.Description = filter.description;
    webHash.SetString(Names.Description, newValue);
    DelayFetch();
  },
};

//构建一个翻译值
function MakeTranslateOption(value: string) {
  const t: string = translate(value);
  if (t.trim().toLowerCase() == value.trim().toLowerCase()) {
    return utils.MakeOption(value, t);
  } else {
    return utils.MakeOption(value, `${value} (${t})`);
  }
}

//定义属性
const props = withDefaults(
  defineProps<{
    searchType: SearchType;
    input: string;
  }>(),
  {
    searchType: SearchType.Server,
    input: "",
  },
);

// 发射!
const emit = defineEmits<{
  (event: "update:input", arg1: string): void;
  (event: "fetch"): void;
  (event: "update:searchType", arg1: SearchType): void;
  (event: "reset-filter"): void;
}>();

//获取输入框占位符
const placeholder = computed(() => {
  switch (props.searchType) {
    case SearchType.Server:
      return i18n.global.t("home.searchPlaceholder.searchServer");
    case SearchType.Player:
      return i18n.global.t("home.searchPlaceholder.searchPlayer");
    default:
      return "";
  }
});

//当输入框被更改, 则触发更新
function OnInputChanged(newInput: string) {
  if (props.input == newInput) return;
  emit("update:input", newInput);
  DelayFetch();
}

//延迟更新
const lock: LockToken = { Lock: new Object() };
async function DelayFetch() {
  await utils.delay(listInfo.triggerTimeout, lock);
  emit("fetch");
}

//初始化动态选项
async function InitDynamicOptions() {
  if (dynamicOptions.isInit) return;
  dynamicOptions.isInit = true;

  const prefabsResponse = await GetPrefabsAsync();
  if (prefabsResponse == null || prefabsResponse.Code != 200) {
    dynamicOptions.prefabs = [];
  }

  const tagsResponse = await GetTagsAsync();
  if (tagsResponse == null || tagsResponse.Code != 200) {
    dynamicOptions.tags = [];
  }

  const modsNameResponse = await GetModsNameAsync();
  if (modsNameResponse == null || modsNameResponse.Code != 200) {
    dynamicOptions.modsName = [];
  }

  dynamicOptions.prefabs = prefabsResponse.Prefabs.select(v => {
    return MakeTranslateOption(v.Prefab);
  }).toArray();
  dynamicOptions.tags = tagsResponse.Tags.select(v => {
    return MakeTranslateOption(v.Tag);
  }).toArray();
  dynamicOptions.modsName = modsNameResponse.Mods.select(v => {
    return utils.MakeOption(EscapeRegex(v.Name), v.Name);
  }).toArray();
}

//重置过滤选项
function ResetFilter() {
  // 布尔类型
  filter.isPvp = null;
  filter.isMods = null;
  filter.isDedicated = null;
  filter.isLatestVersion = null;
  filter.isServerPaused = null;
  filter.isFriendsOnly = null;
  filter.isAllowNewPlayers = null;
  filter.natType = null;
  filter.isPassword = null;

  // 其它类型
  filter.seasonRaw = "";
  filter.season.Value = [];
  filter.season.IsExclude = false;
  query.Season = filter.season;
  webHash.SetString(Names.Season, null);

  filter.platformRaw = "";
  filter.platform.Value = [];
  filter.platform.IsExclude = false;
  query.Platform = filter.platform;
  webHash.SetString(Names.Platform, null);

  filter.prefabRaw = "";
  filter.prefab.Value = null;
  filter.prefab.IsExclude = false;
  filter.prefab.IsRegex = true; // default Regex
  query.PlayerPrefab = filter.prefab;
  webHash.SetString(Names.Prefab, null);

  filter.intentRaw = "";
  filter.intent.Value = [];
  filter.intent.IsExclude = false;
  query.Intent = filter.intent;
  webHash.SetString(Names.Intent, null);

  filter.modeRaw = "";
  filter.mode.Value = [];
  filter.mode.IsExclude = false;
  query.GameMode = filter.mode;
  webHash.SetString(Names.GameMode, null);

  filter.tagsRaw = "";
  filter.tags.Value = [];
  filter.tags.IsExclude = false;
  query.Tags = filter.tags;
  webHash.SetString(Names.Tags, null);

  filter.modsNameRaw = "";
  filter.modsName.Value = null;
  filter.modsName.IsExclude = false;
  filter.modsName.IsRegex = true; // default Regex
  query.ModsName = filter.modsName;
  webHash.SetString(Names.ModsName, null);

  filter.descriptionRaw = "";
  filter.description.Value = null;
  filter.description.IsExclude = false;
  filter.description.IsRegex = true; // default Regex
  query.Description = filter.description;
  webHash.SetString(Names.Description, null);

  // end
  emit("reset-filter");
  emit("fetch");
}

/** 初始化# */
async function Initialize() {
  await utils.delay(50);
  emit("update:input", webHash.GetString(Names.Name) ?? "");

  if (webHash.GetBoolean(Names.IsPlayer) == true) {
    emit("update:searchType", SearchType.Player);
  }

  filter.isPvp = webHash.GetBoolean(Names.IsPvp);
  filter.isMods = webHash.GetBoolean(Names.IsMods);
  filter.isDedicated = webHash.GetBoolean(Names.IsDedicated);
  filter.isLatestVersion = webHash.GetBoolean(Names.IsLatestVersion);
  filter.isServerPaused = webHash.GetBoolean(Names.IsServerPaused);
  filter.isFriendsOnly = webHash.GetBoolean(Names.IsFriendsOnly);
  filter.isAllowNewPlayers = webHash.GetBoolean(Names.IsAllowNewPlayers);
  filter.natType = webHash.GetBoolean(Names.Nat);
  filter.isPassword = webHash.GetBoolean(Names.IsPassword);

  filter.seasonRaw = GetPyString(Names.Season);
  filter.platformRaw = GetPyString(Names.Platform);
  filter.prefabRaw = GetPyString(Names.Prefab);
  filter.modeRaw = GetPyString(Names.GameMode);
  filter.intentRaw = GetPyString(Names.Intent);
  filter.tagsRaw = GetPyString(Names.Tags);
  filter.descriptionRaw = GetPyString(Names.Description);
  filter.modsNameRaw = GetPyString(Names.ModsName);
}

function GetPyString(key: string) {
  const value = webHash.GetString(key);
  if (value == null || value == "") {
    return "";
  }
  return "\x01" + value;
}

Initialize();
</script>

<style scoped lang="scss">
.search-box {
  /* box-shadow: 0 0px 6px -3px #919eab4d, 0 2px 14px 1px #919eab4d,
    0 4px 14px 3px #919eab4d !important; */

  box-shadow: 0 0 15px var(--v-search-shadow-color) !important;

  /* border: 1px solid #111; */
  /* border: 2px #FF69A420 solid */

  /* border: 2px solid #F00; */
  /* box-sizing: border-box;
  border: 1px #ced8e4 solid;
  border-right: 0;
  border-radius: 20px;
  box-shadow: 0 0 10px 2px #bdcee0; */
}

.switch-container > div {
  margin-bottom: 10px;
}
.switch-container {
  margin-bottom: -12px;
}
@media (max-width: 600px) {
  .table-title {
    // 当时手机时, 左边留空一点点
    margin-left: 10px;
  }
  // /* 如果是手机, 则让上下两排空出空隙 */
}
</style>
