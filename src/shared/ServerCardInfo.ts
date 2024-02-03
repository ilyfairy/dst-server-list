import { HistoryItem } from "@/scripts/ServerHistoryManager";
import { DstServerAll } from "@/scripts/models";
import { ref } from "vue";

const data = ref({
  // 服务器详细信息卡片
  indexer: null as ServerCardIndexer | null,
  type: null as ServerCardDataType | null,
  show: false,
});

const ServerCardInfo = data.value;
export { ServerCardInfo };

/** ServerCard查询信息的类型 */
export enum ServerCardDataType {
  RowIdOnly,
  ServerInfo,
  HistoryItem,
  Internal,
}

/** 给ServerCard提供必要的查询信息 */
export type ServerCardIndexer = HistoryItem | DstServerAll | string;



export function ShowServerCard(type: ServerCardDataType, indexer: ServerCardIndexer) {
  ServerCardInfo.type = type;
  ServerCardInfo.indexer = indexer;
  ServerCardInfo.show = true;
  
  // webHash.SetString(Names.Server, item.RowId);
}