import i18n from "@/i18n";
import { VDataTableServer } from "vuetify/components/VDataTable";
import { Language } from "@/scripts/units";

//语言列表
export const languages: { key: Language; name: string }[] = [
  {
    key: "en",
    name: "English",
  },
  {
    key: "cn",
    name: "简体中文",
  },
  {
    key: "jp",
    name: "日本語",
  },
];

//数据表头
export function GetDataTabHeader(): Exclude<VDataTableServer["headers"], undefined> {
  return [
    {
      key: "Name",
      title: i18n.global.t("home.tableHeader.serverName"),
      align: "start",
      // width: '50%'
    },
    {
      key: "Connected",
      title: i18n.global.t("home.tableHeader.connectionCount"),
      // width: '10%'
    },
    {
      key: "Mode",
      title: i18n.global.t("home.tableHeader.gamemode"),
      sortable: false,
      // width: '10%'
      align: "center",
    },
    {
      key: "DaysInfo",
      title: i18n.global.t("home.days"),
    },
    {
      key: "Season",
      title: i18n.global.t("home.tableHeader.season"),
    },
    {
      key: "IsDedicated",
      title: i18n.global.t("other"), // 其它
      sortable: false,
      align: "center",
    },
    {
      key: "Platform",
      title: i18n.global.t("home.tableHeader.platform"),
      sortable: false,
    },
    {
      key: "Address",
      title: i18n.global.t("home.tableHeader.address"),
      sortable: false,
      // width: "10%"
      align: "center",
    },
    {
      key: "Players",
      title: i18n.global.t("home.tableHeader.players"),
      sortable: false,
    },
  ];
}
