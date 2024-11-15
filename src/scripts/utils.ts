import { DstDaysInfo, DstModInfo, DstPlayer, DstServer, Platform } from "./models";
import i18n from "@/i18n";

/** 生成min~nax的随机整数 [min,max] */
export const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

/** 赋值内容到粘贴板并且显示提示 */
export function copy(text: string) {
  // clipboard.copy(text.toString());
  navigator.clipboard.writeText(text.toString());
}

/** 不区分大小写比较字符串 */
export function StringCompare(a: string | null, b: string | null) {
  if (a == b) return true;
  if (a == null || b == null) return false;
  return a?.localeCompare(b, undefined, { sensitivity: "base" }) == 0;
}

/** 不区分大小写比较字符串是否以指定字符串开头 */
export function StringStartWith(a?: string, b?: string) {
  if (a == null || b == null) return false;
  return a.toLowerCase().startsWith(b.toLowerCase());
}

/** Task.Delay */
export function delay(ms: number, lock?: LockToken) {
  if (lock == null) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
  return new Promise(resolve => {
    const temp = new Object();
    lock.Lock = temp;
    setTimeout(() => {
      if (temp == lock.Lock) {
        resolve(undefined);
      }
    }, ms);
  });
}

export interface LockToken {
  Lock: object;
}

export function MakeOption(value: string, text: string = value, single: boolean = false): CustomOptionValue {
  return new CustomOptionValue(value, text, single);
}

//获取string字符串或StringValue中的值
export function GetStringTranslateOption(val: string | CustomOptionValue): string {
  if (val instanceof CustomOptionValue) {
    return val.value;
  }
  return val;
}

export class CustomOptionValue extends String {
  constructor(value: string, text: string, isSingle: boolean = false) {
    super();
    this.value = value;
    this.text = text;
    this.isSingle = isSingle;
  }

  value: string;
  text: string;
  isSingle: boolean;

  toString() {
    return this.text;
  }
}

/** 计算季节是否早期或晚期 */
export function CalcSeasonState(daysInfo?: DstDaysInfo | null): "early" | "late" | "" {
  if (daysInfo == null) {
    return "";
  }

  const a = daysInfo.DaysElapsedInSeason / (daysInfo.DaysElapsedInSeason + daysInfo.DaysLeftInSeason);
  if (a <= 0.25) {
    return "early";
  } else if (a >= 0.75) {
    return "late";
  }
  return "";
}

export function OpenSteamPlayerUrl(steamid: string | number | null | undefined) {
  if (steamid == null) return;
  window.open(`https://steamcommunity.com/profiles/${steamid}`);
}

/** 打开玩家个人主页 */
export function OpenPlayerUrl(platform: Platform | number | null, player: DstPlayer) {
  switch (platform) {
    case Platform.Steam || 1:
      window.open(`https://steamcommunity.com/profiles/${player.NetId}`);
      break;
    case Platform.PlayStation || 2:
      window.open(`https://my.playstation.com/profile/${player.NetId}`);
      break;
    case Platform.WeGame || 4:
      break;
    case Platform.Xbox || 16:
      window.open(`https://account.xbox.com/en-US/Profile?gamerTag=${player.Name}`);
      break;
    case Platform.Switch || 32:
      break;
    default:
      // this.snackbarText = "未知平台";
      // this.snackbar = true;
      break;
  }
}

/** 打开Mod页面 */
export function OpenModUrl(platform: Platform | number | null, mod: DstModInfo) {
  switch (platform) {
    case Platform.Steam || 1:
      window.open(`https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.Id}`);
      break;
    default:
      if (mod.Name == null) return;
      window.open(`https://steamcommunity.com/workshop/browse/?appid=322330&searchtext=${encodeURI(mod.Name)}`);
      break;
  }
}

export function OpenSteamModUrl(workshopId: number | string | null | undefined) {
  if (workshopId == null) return;
  window.open(`https://steamcommunity.com/sharedfiles/filedetails/?id=${workshopId}`);
}

export function EscapeRegex(text: string) {
  return text
    .replaceAll("[", "\\[")
    .replaceAll("]", "\\]")
    .replaceAll("?", "\\?")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)")
    .replaceAll(".", "\\.)")
    .replaceAll("*", "\\*")
    .replaceAll("|", "\x7C");
}

export function ToDateString(dateTime: Date | string, type: DateType = DateType.Full) {
  let locale: string = i18n.global.locale.value;

  if (dateTime instanceof String || typeof dateTime == "string") {
    dateTime = new Date(dateTime);
  }
  dateTime = dateTime as Date;

  // console.log('dateTime prototype', dateTime.__proto__);
  // console.log('is string');
  if (locale == "cn") locale = "zh";

  switch (type) {
    case DateType.Full:
      return dateTime.toLocaleString(locale);
    case DateType.DateOnly:
      return dateTime.toLocaleDateString(locale);
    case DateType.TimeAll:
      return dateTime.toLocaleTimeString(locale);
    case DateType.TimeMinute:
      return dateTime.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  }
}

export enum DateType {
  Full,
  DateOnly,
  TimeAll,
  TimeMinute,
}

export function GetSeasonDaysString(daysInfo: DstDaysInfo | null) {
  if (daysInfo == null) return null;
  return `(${daysInfo.DaysElapsedInSeason + 1}/${daysInfo.TotalDaysSeason})`;
}

export function OpenSteamGroup(id: string) {
  window.open(`https://steamcommunity.com/gid/${id}`);
}

/** 1,000,000 */
export function FormatSplitNumber(num: number) {
  if (num < 1000) return num.toString(); // 999

  if (num < 1000000)
    // 999,999
    return `${((num / 1000) % 1000).toFixed()},${num % 1000}`;

  // 999,999,999
  return `${((num / 1000000) % 1000).toFixed()},${((num / 1000) % 1000).toFixed().padStart(3, "0")},${num % 1000}`;
}

export function GetCountryImageUrl(server: DstServer) {
  if (server.Address.IsoCode == null) {
    if (server.Address.IP == "127.0.0.1" && server.Platform == Platform.WeGame) {
      return `/country-webp/CN.webp`;
    } else {
      return undefined;
    }
  } else {
    return `/country-webp/${server.Address.IsoCode}.webp`;
  }
}
