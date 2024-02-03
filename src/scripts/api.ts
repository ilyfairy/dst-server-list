import {
  ColorResponse,
  DstListResponse,
  GetTotalResponse,
  ModsNameResponse,
  PrefabsResponse,
  ServerDetailsResponse,
  ServerHistoryResponse,
  TagsResponse,
  WebModInfoResponse,
  QueryModsResponse,
} from "./response-model";
import Consts from "@/store/Consts";
import { DstServerAll, ListQueryParams } from "@/scripts/models";
import { CancellationToken } from "./Sharp/CencellationToken";
import { ModsLanguage } from "./units";
import { QueryModsParams } from "./models";

async function InternalFetchAsync(
  method: string,
  path: string,
  query: Query | null = null,
  body: string | null = null,
  signal: CancellationToken | null = null,
): Promise<Response | null> {
  try {
    const url = new URL(path, Consts.BaseApiUrl);
    if (query != null) {
      const params = new URLSearchParams(query);
      url.search = params.toString();
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
      signal: signal,
    });
    return response;
  } catch (e) {
    console.log("请求错误: ", e);
    return null;
  }
}

/** 请求api */
function FetchAsync(
  path: string,
  query: Query | null = null,
  body: string | null = null,
  signal: CancellationToken | null = null,
): Promise<Response | null> {
  return InternalFetchAsync("POST", path, query, body, signal);
}

type Query = {
  [key: string]: any;
};

/** 请求服务器详细数据 */
export async function GetServerAsync(
  rowId: string,
  forceUpdate: boolean = false,
  signal: CancellationToken | null = null,
) {
  const r = await FetchAsync("api/v2/server/details", { id: rowId, forceUpdate: forceUpdate }, null, signal);
  const model = (await r?.json()) as ServerDetailsResponse;
  if (model == null) return null;
  return model;
}

/** 获取服务器列表 */
export async function GetServerListAsync(query: ListQueryParams, signal: CancellationToken | null = null) {
  const r = await FetchAsync("api/v2/server/list", null, JSON.stringify(query), signal);
  const model = (await r?.json()) as DstListResponse<DstServerAll>;
  if (model == null) return null;
  model.DateTime = new Date(model.DateTime);
  model.LastUpdate = new Date(model.LastUpdate);
  return model;
}

/** 获取所有角色名 */
export async function GetPrefabsAsync(): Promise<PrefabsResponse> {
  const r = await FetchAsync("api/v2/server/GetPrefabs");
  const model = (await r?.json()) as PrefabsResponse;
  return model;
}

/** 获取所有Tags */
export async function GetTagsAsync(min: number = 2): Promise<TagsResponse> {
  const r = await FetchAsync("api/v2/server/GetTags", { min: min });
  const model = (await r?.json()) as TagsResponse;
  return model;
}

/** 获取所有Mods名 */
export async function GetModsNameAsync(minUsage: number = 2): Promise<ModsNameResponse> {
  const r = await FetchAsync("api/v2/mods/GetUsageNames", { minUsage: minUsage });
  const model = (await r?.json()) as ModsNameResponse;
  return model;
}

export async function GetTotalAsync(): Promise<GetTotalResponse> {
  const r = await FetchAsync("api/v2/server/GetTotal");
  const model = (await r?.json()) as GetTotalResponse;
  return model;
}

export async function GetTagsColorAsync(tags: string[]): Promise<ColorResponse> {
  const r = await FetchAsync("api/v2/helper/GetTagsColor", null, JSON.stringify(tags));
  const model = (await r?.json()) as ColorResponse;
  return model;
}

export async function GetServerHistoryAsync(
  rowId: string,
  signal: AbortSignal | null = null,
  isDetails: boolean | null = false,
  includeDays: boolean | null = false,
  includePlayers: boolean | null = false,
  startDateTime: Date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 前一天
  endDateTime: Date = new Date(), // 现在
) {
  const r = await FetchAsync(
    "api/v2/history/GetServerHistory",
    {
      rowId: rowId,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      isDetails: isDetails,
      includeDays: includeDays,
      includePlayers: includePlayers,
    },
    null,
    signal,
  );
  const model = (await r?.json()) as ServerHistoryResponse;
  return model;
}

export async function GetModsInfoAsync(params: {
  WorkshopId: number;
  Language: ModsLanguage;
}, cancellationToken: CancellationToken | null = null) {
  const r = await FetchAsync("api/v2/mods/GetModsInfo", null, JSON.stringify(params), cancellationToken);
  const model = (await r?.json()) as WebModInfoResponse;
  return model;
}

export async function QueryModsAsync(params: QueryModsParams) {
  const r = await FetchAsync("api/v2/mods/QueryMods", null, JSON.stringify(params));
  const model = (await r?.json()) as QueryModsResponse;
  return model;
}

export async function GetSteamUserInfo(steamid?: number | string | null) {
  if(steamid == null) 
    return null;
  const url = new URL('https://steam.233.pink/avatar');
  url.searchParams.append("steamid", steamid.toString());
  try {
    const response = await fetch(url);
    const json = await response.json() as {
      steamid: string; // number id
      communityvisibilitystate: number;
      personaname: string; // name
      profileurl: string; // url
      avatar: string; // url
      avatarmedium: string; // url
      avatarfull: string; // url
      avatarhash: string;
      personastate: number;
      primaryclanid: string;
      timecreated: number;
      personastateflags: number;
    };
    return json;
  } catch (error) {
    return null;
  }
}