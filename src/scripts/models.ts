import { ModsLanguage } from "./units";

export interface DstServer {
  Name: string; // 服务器名称
  Address: IPAddressInfo; // IP地址
  Port: number; // 端口
  RowId: string; // 房间ID
  Connected?: number;
  IsDedicated?: boolean;
  Host?: string;
  Intent?: Intention | string;
  MaxConnections?: number;
  Mode?: GameMode | string;
  IsMods?: boolean;
  IsPassword?: boolean;
  Platform: Platform | number | null;
  Season: Season | string | null;
  IsPvp: boolean | null;
  Version: string | null;
  Session: string | null;
  
  IsClanOnly?: boolean; // 仅限steam群组成员加入
  IsFriendsOnly?: boolean; // 仅限好友加入
  Slaves?: WorldLevel[] | null; // 永远为null
  Secondaries?: WorldLevel[] | null;
  IsAllowNewPlayers?: boolean; // 是否允许新玩家加入
  IsServerPaused?: boolean; // 世界是否暂停了
  SteamId?: string;
  SteamRoom?: string;
  Tags?: string[]; // 标签
  IsClientHosted?: boolean; // 是否是客户端主机
  Guid?: string; // GUID
  OwnerNetId?: string; // steamid
  SteamClanId?: string; // steam群组gid
  IsLanOnly?: boolean; // 是否仅限局域网
}

export interface DstServerAll extends DstServer {
  Players?: DstPlayer[] | null;
  LastPing?: number | null; // 上次与大厅通信时间
  Description?: string | null; // 描述
  Tick?: number | null; // Tick
  IsClientModsOff?: boolean | null; //
  Nat?: number | null; // 服务器网络类型  公网5 内网7
  IsEvent?: boolean | null;
  IsValveCloudServer?: boolean | null;
  ValvePopId?: string | null;
  ValveRoutingInfo?: string | null;
  IsKleiOfficial?: boolean | null; // 是否是官方服务器
  DaysInfo?: DstDaysInfo | null; // 天数信息
  WorldGen?: any | null; // 世界生成信息
  Users?: any | null;
  ModsInfo?: DstModInfo[] | null; // mod信息
}

/** 世界层级 */
export interface WorldLevel {
  Address: string | null;
  Port: number;
  Id: string;
  SteamId: string | null;
}

/** 玩家信息 */
export interface DstPlayer {
  /** 玩家名 */
  Name?: string;
  /** 十六进制颜色 */
  Color?: string;
  EventLevel?: number;
  /** 玩家ID */
  NetId?: string;
  /** 游戏角色名 */
  Prefab?: string;
}

/** Mod信息 */
export interface DstModInfo {
  Id: number;
  Name: string;
  CurrentVersion: string;
  NewVersion: string;
  IsClientDownload: boolean;
}

/** 天数信息 */
export interface DstDaysInfo {
  /** 当前天数 */
  Day: number;
  /** 当前季节已过去天数 */
  DaysElapsedInSeason: number;
  /** 当前季节剩余天数 */
  DaysLeftInSeason: number;
  TotalDaysSeason: number; // 附加信息
}

/** IP地址信息 */
export interface IPAddressInfo {
  IP: string;
  /** ISO两位国家代码 */
  IsoCode?: string;
}

/** 平台 */
export enum Platform {
  Steam = "Steam",
  PlayStation = "PlayStation",
  WeGame = "WeGame",
  QQGame = "QQGame",
  Xbox = "Xbox",
  Switch = "Switch",
  PS4Official = "PS4Official",
}

/** 季节 */
export enum Season {
  Spring = "spring",
  Summer = "summer",
  Autumn = "autumn",
  Winter = "winter",
}

/** 模式 */
export enum GameMode {
  Survival = "survival", // 生存
  Wilderness = "wilderness", // 荒野
  Endless = "endless", // 无尽
  Lavaarena = "lavaarena", // 熔炉
  Quagmire = "quagmire", // 暴食
}

/** 风格 */
export enum Intention {
  Relaxed = "relaxed", // 轻松
  Endless = "endless", // 无尽
  Survival = "survival", // 生存
  Wilderness = "wilderness", // 荒野
  Lightsout = "lightsout", // 暗无天日
  Cooperative = "cooperative", // 例外: 合作
}

// export interface TranslateItem<T> {
//   Value: T;
//   Translate: T;
// }

export interface RegexValue {
  Value: string | null;
  IsExclude: boolean;
  IsRegex: boolean;
}

export interface StringArray<T = string | number> {
  Value: T[];
  IsExclude: boolean;
}

export interface ListQueryParams {
  PageCount?: number | null; // x
  PageIndex?: number | null; // x
  IgnoreCase?: boolean | null;
  IsDetailed?: boolean | null; // x
  Sort?: StringArray | string[] | string | null; // x
  ServerName?: RegexValue | null; // 查询
  PlayerName?: RegexValue | null; // 查询 排序
  Season?: StringArray<Season | string> | null;
  Version?: number | string | null; // 最新版本查询
  GameMode?: StringArray<GameMode | string> | null; // 查询
  Intent?: StringArray<Intention | string> | null; // 查询
  IP?: string | null;
  Host?: string | null;
  Platform?: StringArray<Platform | string> | null; // 查询
  Country?: StringArray | null;
  ModsName?: RegexValue | null; // 查询
  ModsId?: StringArray | null;
  Days?: string | null; // 排序
  DaysInSeason?: string | null;
  Description?: RegexValue | null; // 查询
  IsPassword?: boolean | null; // 查询
  IsOfficial?: boolean | null;
  Tags?: StringArray | null; // 查询
  IsPvp?: boolean | null; // 查询
  Connected?: string | null; // 排序
  MaxConnections?: string | null;
  PlayerPrefab?: RegexValue | null; // 查询
  IsMods?: boolean | null; // 查询
  IsDedicated?: boolean | null; // 查询
  IsServerPaused?: boolean | null; // 查询
  IsAllowNewPlayers?: boolean | null; // 查询
  OwnerNetId?: boolean | null;
  Nat?: number | null; // 查询
  IsFriendsOnly?: boolean | null; // 查询
}

export interface PrefabItem {
  Prefab: string;
  Count: number;
}



export interface QueryModsParams {
  Text?: string | null;
  PageIndex?: number | null;
  PageSize?: number | null;
  IsQueryName?: number | null;
  IsQueryDescription?: number | null;
  IsQueryAuthor?: number | null;
  IsQueryTag?: number | null;
  IsQueryWorkshopId?: number | null;
  IgnoreCase?: number | null;
  Sort?: string | null;
  Type?: string | null;
  Language: ModsLanguage;
}
