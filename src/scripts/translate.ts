import i18n from "@/i18n";

export function translate(text: string): string {
  const lang = i18n.global.locale.value;
  return json[lang][text] ?? json["en"][text] ?? text;
}

export function icon(iconText: string) {
  return icons[iconText] ?? "";
}

const icons: { [key: string]: string } = {
  spring: "🌸",
  summer: "☀️",
  autumn: "🍂",
  winter: "❄️",
};

const json: any = {
  en: {
    relaxed: "Relaxed",
    endless: "Endless",
    survival: "Survival",
    wilderness: "Wilderness",
    lightsout: "LightsOut",
    cooperative: "Cooperative",
    lavaarena: "Lavaarena",
    social: "Social",
    oceanfishing: "OceanFishing",
    OceanFishing: "OceanFishing",

    //季节
    spring: "Spring",
    summer: "Summer",
    autumn: "Autumn",
    winter: "Winter",

    earlyspring: "Early Spring",
    earlysummer: "Early Summer",
    earlyautumn: "Early Autumn",
    earlywinter: "Early Winter",

    latespring: "Late Spring",
    latesummer: "Late Summer",
    lateautumn: "Late Autumn",
    latewinter: "Late Winter",

    //角色名
  },
  cn: {
    relaxed: "轻松",
    endless: "无尽",
    survival: "生存",
    wilderness: "荒野",
    lightsout: "暗无天日",
    cooperative: "合作",
    lavaarena: "熔炉",
    social: "社交",
    oceanfishing: "海钓",
    OceanFishing: "海钓",

    //季节
    spring: "春",
    summer: "夏",
    autumn: "秋",
    winter: "冬",

    earlyspring: "早春",
    earlysummer: "早夏",
    earlyautumn: "早秋",
    earlywinter: "早冬",

    latespring: "晚春",
    latesummer: "晚夏",
    lateautumn: "晚秋",
    latewinter: "晚冬",

    //角色名
    wendy: "温蒂",
    wilson: "威尔逊",
    wathgrithr: "薇格弗德",
    wolfgang: "沃尔夫冈",
    woodie: "伍迪",
    wickerbottom: "薇克巴顿",
    waxwell: "麦斯威尔",
    wormwood: "沃姆伍德",
    wx78: "WX78",
    wanda: "旺达",
    webber: "韦伯",
    wortox: "沃拓克斯",
    willow: "薇洛",
    warly: "沃利",
    wurt: "沃特",
    winona: "薇诺娜",
    walter: "沃尔特",
    wes: "韦斯",
  },
  jp: {
    relaxed: "リラックス",
    endless: "エンドレス",
    survival: "サバイバル",
    wilderness: "ワイルダネス",
    lightsout: "ライトアウト",
    cooperative: "協力",
    lavaarena: "ラバアリーナ",
    social: "ソーシャル",
    // oceanfishing: "海钓",
    // OceanFishing: "海钓",

    //季节
    spring: "春",
    summer: "夏",
    autumn: "秋",
    winter: "冬",

    earlyspring: "初春",
    earlysummer: "初夏",
    earlyautumn: "初秋",
    earlywinter: "初冬",

    latespring: "晚春",
    latesummer: "晚夏",
    lateautumn: "晚秋",
    latewinter: "晚冬",

    //角色名
  },
};

// [0]: ("CN", 18393)
// [1]: (null, 2479)
// [2]: ("RU", 1154)
// [3]: ("US", 779)
// [4]: ("SG", 538)
// [5]: ("KR", 373)
// [6]: ("FI", 319)
// [7]: ("HK", 300)
// [8]: ("TH", 234)
// [9]: ("TW", 206)
