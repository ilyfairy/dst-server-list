import { DstServerAll } from "@/scripts/models"
import { DstListResponse, GetTotalResponse } from "@/scripts/response-model"
import { defineStore } from "pinia"

export const useListInfoStore = defineStore('listInfo', {
  state: () => ({
    listLastUpdated: null as null | number, // 列表最后更新时间(秒)
    triggerTimeout: 500, // 触发时间(毫秒)
    response: null as DstListResponse<DstServerAll> | null, // 列表数据
    isMultiPage: false as boolean,
    totalInfo: {
      Connections: 0,
      Servers: 0,
      Version: null,
    } as GetTotalResponse
  }),
  actions: {
    SetUpdateTimeout(timeout: number) {
      if (this.listLastUpdated == null) {
        // 如果没有设置过, 则设置定时器
        this.listLastUpdated = timeout;
        setInterval(() => {
          this.listLastUpdated = (this.listLastUpdated ?? 0) + 1;
        }, 1000);
      } else {
        this.listLastUpdated = timeout;
      }
    }
  }
})