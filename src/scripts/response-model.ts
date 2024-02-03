import { DstDaysInfo, DstServer, DstServerAll, GameMode, Intention, Platform } from "./models";
import { ModsLanguage } from "./units";

export interface ResponseBase {
  Code?: number;
  Error?: string;
}

export interface DstListResponse<T extends DstServer> extends ResponseBase {
  PageIndex: number;
  MaxPageIndex: number;
  Count: number;
  TotalCount: number;
  LastUpdate: Date | string;
  DateTime: Date | string;
  List: T[];
}

export interface ServerDetailsResponse extends ResponseBase {
  Server: DstServerAll | null;
  LastUpdate: Date | string | null;
}

export interface PrefabsResponse extends ResponseBase {
  Prefabs: { Prefab: string; Count: number }[];
}

export interface TagsResponse extends ResponseBase {
  Tags: { Tag: string; Count: number }[];
}

export interface ModsNameResponse extends ResponseBase {
  Mods: { Name: string; Count: number }[];
}

export interface GetTotalResponse extends ResponseBase {
  Version: number | null;
  Connections: number;
  Servers: number;
}

export interface ColorResponse extends ResponseBase {
  Colors: { [key: string]: string };
}

export interface ServerHistoryResponse extends ResponseBase {
  Server: DstServerHistory,
  Items: ServerHistoryItem[],
}

export interface DstServerHistory {
  Id: string; // RowId
  Name: string;
  IP: string;
  Port: number;
  Host: string;
  UpdateTime: Date | string;
  Platform: Platform | number;
  GameMode: GameMode | string;
  Intent: Intention | string;
}

export interface ServerHistoryItem {
  Season: string | null;
  PlayerCount: number;
  DateTime: Date | string;
  DaysInfo: DstDaysInfo | null;
  Players: HistoryPlayerItem[] | null;
}

export interface HistoryPlayerItem {
  Id: string;
  Name: string;
  Platform: Platform | number;
}

export interface WebModInfoResponse extends ResponseBase {
  Mod: WebModInfo;
}

export interface WebModInfoLite {
  WorkshopId: number;
  Name: string;
  Description: string;
  UpdateTime: Date | string;
  CreatedTime: Date | string;
  Author: string | null;
  AuthorSteamId: number;
  Tags: string[];
  ModType: "Client" | "Server" | null;
  IsUGC: boolean;
  Version: string | null;
  PreviewImageUrl: string;
  PreviewImageType: string | null;
  Language: ModsLanguage;
}

// export enum ModsLanguage1 {
//   Chinese = "Chinese",
//   English = "English",
// }

export interface WebModInfo extends WebModInfoLite {
  Size: number;
  View: SteamModsView;
  ConfigurationOptions: ConfigurationOption[] | null;
  Previews: SteamModsPreview[] | null;
  VoteData: SteamModsVoteData | null;
}

export interface SteamModsPreview {
  PrewviewId: number;
  SortOrder: number;
  Url: string;
  Size: number;
  FileName: string;
  PreviewType: number;
}

export interface SteamModsVoteData {
  Score: number;
  VotesUp: number;
  VotesDown: number;
}


export interface SteamModsView {
  Views: number;
  Subscriptions: number;
  Favorited: number;
  CommentsPublic: number;
}

export interface ConfigurationOption {
  Name: string;
  Label: string;
  Default: any;
  Hover: string;
  Type: "Invalid" | "Option" | "Title" | "Empty";
  Options: ConfigurationOptionItem[];
}

export interface ConfigurationOptionItem {
  Description: string;
  Data: any;
  Hover: string;
}

export interface QueryModsResponse extends ResponseBase {
  Mods: WebModInfoLite[];
  PageIndex: number;
  Count: number;
  MaxPageIndex: number;
  TotalCount: number;
}
