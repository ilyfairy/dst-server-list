//过滤选项, 主页的下拉框的选项
import { reactive, computed, watch, ref } from "vue";
import { ListQueryParams } from "@/scripts/models";
import webHash from "@/scripts/WebAttribute";
import * as Names from "@/scripts/AttributeNames";

let temp: ListQueryParams;
const query = ref<ListQueryParams>({}).value; // 列表查询参数

//筛选的选项
const filter = reactive({
  isPvp: null as boolean | null,
  isMods: null as boolean | null,
  isDedicated: null as boolean | null,
  isLatestVersion: null as boolean | null,
  natType: null as boolean | null,
  isFriendsOnly: null as boolean | null, // 是否仅限好友加入
  isServerPaused: null as boolean | null, // 服务器是否已暂停
  isAllowNewPlayers: null as boolean | null, // 是否允许新玩家加入
  isPassword: null as boolean | null,

  seasonRaw: "",
  season: {
    Value: [],
    IsExclude: false,
  } as Exclude<Exclude<typeof temp.Season, null>, undefined>,

  platformRaw: "",
  platform: {
    Value: [],
    IsExclude: false,
  } as Exclude<Exclude<typeof temp.Platform, null>, undefined>,

  prefabRaw: "",
  prefab: {
    Value: null,
    IsExclude: false,
    IsRegex: true,
  } as Exclude<Exclude<typeof temp.PlayerPrefab, null>, undefined>,

  modeRaw: "",
  mode: {
    Value: [],
    IsExclude: false,
  } as Exclude<Exclude<typeof temp.GameMode, null>, undefined>,

  intentRaw: "",
  intent: {
    Value: [],
    IsExclude: false,
  } as Exclude<Exclude<typeof temp.Intent, null>, undefined>,

  tagsRaw: "",
  tags: {
    Value: [],
    IsExclude: false,
  } as Exclude<Exclude<typeof temp.Tags, null>, undefined>,

  modsNameRaw: "",
  modsName: {
    Value: null,
    IsExclude: false,
    IsRegex: true,
  } as Exclude<Exclude<typeof temp.ModsName, null>, undefined>,

  descriptionRaw: "",
  description: {
    Value: null,
    IsExclude: false,
    IsRegex: true,
  } as Exclude<Exclude<typeof temp.Description, null>, undefined>,
});

//监听
watch(
  () => filter.isPvp,
  newValue => {
    query.IsPvp = newValue;
    webHash.SetBoolean(Names.IsPvp, newValue);
  },
);

watch(
  () => filter.isMods,
  newValue => {
    query.IsMods = newValue;
    webHash.SetBoolean(Names.IsMods, newValue);
  },
);

watch(
  () => filter.isDedicated,
  newValue => {
    query.IsDedicated = newValue;
    webHash.SetBoolean(Names.IsDedicated, newValue);
  },
);

watch(
  () => filter.isLatestVersion,
  newValue => {
    if (newValue == true) {
      webHash.SetBoolean(Names.IsLatestVersion, true);
      query.Version = "latest";
    } else if (newValue == false) {
      webHash.SetBoolean(Names.IsLatestVersion, false);
      query.Version = "<latest";
    } else {
      webHash.SetString(Names.IsLatestVersion, null);
      query.Version = null;
    }
  },
);

watch(
  () => filter.natType,
  newValue => {
    if (newValue == true) {
      webHash.SetBoolean(Names.Nat, true);
      query.Nat = 5;
    } else if (newValue == false) {
      webHash.SetBoolean(Names.Nat, false);
      query.Nat = 7;
    } else {
      webHash.SetString(Names.Nat, null);
      query.Nat = null;
    }
  },
);

watch(
  () => filter.isServerPaused,
  newValue => {
    query.IsServerPaused = newValue;
    webHash.SetBoolean(Names.IsServerPaused, newValue);
  },
);

watch(
  () => filter.isFriendsOnly,
  newValue => {
    query.IsFriendsOnly = newValue;
    webHash.SetBoolean(Names.IsFriendsOnly, newValue);
  },
);

watch(
  () => filter.isAllowNewPlayers,
  newValue => {
    query.IsAllowNewPlayers = newValue;
    webHash.SetBoolean(Names.IsAllowNewPlayers, newValue);
  },
);

watch(
  () => filter.isPassword,
  newValue => {
    query.IsPassword = newValue;
    webHash.SetBoolean(Names.IsPassword, newValue);
  },
);

// =================

export { filter, query };
