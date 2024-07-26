<template>
  <div>
    <v-toolbar id="toob" :flat="true" color="transparent" class="text-caption">
      <div class="table-title"></div>
      <v-toolbar-title v-if="mediaQuery.sm == false">{{ $t("home.serverList") }}</v-toolbar-title>
      <v-spacer v-if="mediaQuery.sm == false"></v-spacer>

      <!-- 输入框 -->
      <v-text-field
        :placeholder="placeholder"
        :hide-details="true"
        :single-line="true"
        :model-value="input"
        @update:model-value="OnInputChanged"
        @keydown.enter="emit('fetch')"
        class="mr-1 search-box"
        :clearable="true"
        variant="solo"
        density="compact"
        :flat="true"
      >
        <template v-slot:prepend-inner>
          <v-icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>magnify</title>
            <path fill="#707570" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg>
          </v-icon>
        </template>
      </v-text-field>

      <!-- 过滤按钮 -->
      <v-btn
        :icon="true"
        @click="
          ui.isShowFilter = !ui.isShowFilter;
          InitDynamicOptions();
        "
      >
        <v-icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>filter-variant</title><path fill="#707570" d="M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z" /></svg>
        </v-icon>
      </v-btn>
      <v-btn :icon="true" @click="ResetFilter()">
        <v-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>filter-variant-remove</title><path fill="#707570" d="M21 8H3V6H21V8M13.81 16H10V18H13.09C13.21 17.28 13.46 16.61 13.81 16M18 11H6V13H18V11M21.12 15.46L19 17.59L16.88 15.46L15.47 16.88L17.59 19L15.47 21.12L16.88 22.54L19 20.41L21.12 22.54L22.54 21.12L20.41 19L22.54 16.88L21.12 15.46Z" /></svg></v-icon>
      </v-btn>

      <v-btn :icon="true" @click="ui.isShowSettings = true">
        <v-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>tune</title><path fill="#707570" d="M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z" /></svg></v-icon>
      </v-btn>
    </v-toolbar>

    <v-expand-transition>
      <!-- 里面的组件消失时会自动进行高度的过渡动画 -->
      <div v-show="ui.isShowFilter">
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="24">
              <div class="d-flex ml-2 flex-wrap switch-container">
                <!-- 是否搜索玩家 -->
                <div class="mr-6">
                  <v-switch
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
                  ></v-switch>
                </div>

                <!-- 是否PVP -->
                <div class="mr-6">
                  <a-switch label="PvP" v-model="filter.isPvp" color="#E00" @update:model-value="DelayFetch()">
                  </a-switch>
                </div>

                <!-- 是否启用模组 -->
                <div class="mr-6">
                  <a-switch label="Mods" v-model="filter.isMods" color="#A50" @update:model-value="DelayFetch()">
                  </a-switch>
                </div>

                <!-- 是否专用服务器 -->
                <div class="mr-6">
                  <a-switch
                    :label="$t('dst.dedicatedServer')"
                    v-model="filter.isDedicated"
                    color="#E70"
                    @update:model-value="DelayFetch()"
                  >
                  </a-switch>
                </div>

                <!-- 是否是最新版本 -->
                <div class="mr-6">
                  <a-switch
                    :label="$t('dst.latestVersion')"
                    v-model="filter.isLatestVersion"
                    color="#0A0"
                    @update:model-value="DelayFetch()"
                  >
                  </a-switch>
                </div>

                <!-- 服务器是否已暂停 -->
                <div class="mr-6">
                  <a-switch
                    :label="$t('dst.serverPaused')"
                    v-model="filter.isServerPaused"
                    color="#8AA"
                    @update:model-value="DelayFetch()"
                  >
                  </a-switch>
                </div>

                <!-- 仅允许好友加入 -->
                <div class="mr-6">
                  <a-switch
                    :label="$t('dst.friendsOnly')"
                    v-model="filter.isFriendsOnly"
                    color="#DD0"
                    @update:model-value="DelayFetch()"
                  >
                  </a-switch>
                </div>

                <!-- 允许新玩家加入 -->
                <div class="mr-6">
                  <a-switch
                    :label="$t('dst.allowNewPlayer')"
                    v-model="filter.isAllowNewPlayers"
                    color="#D90"
                    @update:model-value="DelayFetch()"
                  >
                  </a-switch>
                </div>

                <!-- NAT -->
                <div class="mr-6">
                  <a-switch
                    label="Password"
                    v-model="filter.isPassword"
                    color="#03A"
                    @update:model-value="DelayFetch()"
                  >
                  </a-switch>
                </div>

                <!-- NAT -->
                <div class="mr-6">
                  <a-switch
                    :label="natTypeLabel"
                    v-model="filter.natType"
                    color="#03A"
                    @update:model-value="DelayFetch()"
                  >
                  </a-switch>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <!-- 平台 -->
            <v-col cols="12" sm="6">
              <auto-completion-multiple
                :label="$t('home.tableHeader.platform')"
                :pre-options="options.platform"
                v-model="filter.platformRaw"
                @update:new-array="handles.platformHandle"
                :is-array="true"
              >
              </auto-completion-multiple>
            </v-col>

            <!-- 季节输入 -->
            <v-col cols="12" sm="6">
              <auto-completion-multiple
                :label="$t('home.tableHeader.season')"
                :pre-options="options.season"
                v-model="filter.seasonRaw"
                @update:new-array="handles.seasonHandle"
                :is-array="true"
              >
              </auto-completion-multiple>
            </v-col>
          </v-row>

          <v-row>
            <!-- 游戏模式 -->
            <v-col cols="12" sm="6">
              <auto-completion-multiple
                :label="$t('home.tableHeader.gamemode')"
                :pre-options="options.mode"
                v-model="filter.modeRaw"
                @update:new-array="handles.modeHandle"
              >
              </auto-completion-multiple>
            </v-col>

            <!-- 游戏风格 -->
            <v-col cols="12" sm="6">
              <auto-completion-multiple
                :label="$t('home.tableHeader.intentx')"
                :pre-options="options.intent"
                v-model="filter.intentRaw"
                @update:new-array="handles.intentHandle"
              >
              </auto-completion-multiple>
            </v-col>
          </v-row>

          <v-row>
            <!-- 游戏模式 -->
            <v-col cols="12" sm="6">
              <auto-completion-multiple
                label="Tags"
                :pre-options="dynamicOptions.tags"
                v-model="filter.tagsRaw"
                @update:new-array="handles.tagsHandle"
              >
              </auto-completion-multiple>
            </v-col>

            <!-- 玩家角色 -->
            <v-col cols="12" sm="6">
              <auto-completion-regex
                :label="`${$t('dst.prefab')} (Regex)`"
                :pre-options="options.prefabs"
                v-model="filter.prefabRaw"
                @update:model-value="handles.prefabHandle"
              >
              </auto-completion-regex>
            </v-col>
          </v-row>

          <v-row>
            <!-- 模组名称 -->
            <v-col cols="12" sm="6">
              <auto-completion-regex
                :label="`${$t('dst.modsName')} (Regex)`"
                :pre-options="options.modsName"
                v-model="filter.modsNameRaw"
                @update:model-value="handles.modsNameHandle"
              >
              </auto-completion-regex>
            </v-col>

            <!-- 描述 -->
            <v-col cols="12" sm="6">
              <auto-completion-regex
                :label="`${$t('dst.description')} (Regex)`"
                :pre-options="[]"
                v-model="filter.descriptionRaw"
                @update:model-value="handles.descriptionHandle"
              >
              </auto-completion-regex>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-expand-transition>

    <app-settings v-model:is-show="ui.isShowSettings"> </app-settings>
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
  border-radius: 15px;
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
