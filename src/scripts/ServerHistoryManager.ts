import { DstServer, DstServerAll } from "./models";
import * as api from "@/scripts/api";
import { ref } from "vue";

class ServerHistoryManager {
  private _internal = ref<HistoryItem[]>([]);

  public get history() {
    return this._internal.value;
  }
  public set history(history: HistoryItem[]) {
    this._internal.value = history;
  }

  public constructor() {
    try {
      this.history = JSON.parse(localStorage.getItem("history") || "[]") ?? [];
    } catch (error) {
      this.history = [];
    }
  }

  public AddHistory(server: DstServer) {
    const item = ToHistoryItem(server);
    //去重
    for (let i = 0; i < this.history.length; i++) {
      if (this.history[i].RowId == item.RowId) {
        this.history.splice(i, 1);
        break;
      }
    }

    //追加到最开头, 如果满了, 则移除最后一个
    this.history.unshift(item);
    const json = JSON.stringify(this.history);
    localStorage.setItem("history", json);
    while (this.history.length > 10) {
      this.history.pop();
    }
  }

  public ToTop(item: HistoryItem) {
    let index = -1;
    for (let i = 0; i < this.history.length; i++) {
      if (this.history[i] == item) {
        index = i;
        break;
      }
    }
    if (index == -1) return;

    this.history.splice(index, 1); // temp remove
    this.history.unshift(item);
    const json = JSON.stringify(this.history);
    localStorage.setItem("history", json);
  }

  public Clear() {
    this.history = [];
    localStorage.removeItem("history");
  }

  public Remove(item: HistoryItem) {
    let index = -1;
    for (let i = 0; i < this.history.length; i++) {
      if (this.history[i] == item) {
        index = i;
        break;
      }
    }
    if (index == -1) return;

    this.history.splice(index, 1); // temp remove
    const json = JSON.stringify(this.history);
    localStorage.setItem("history", json);
  }

  public RemoveAt(index: number) {
    this.history.splice(index, 1);
    const json = JSON.stringify(this.history);
    localStorage.setItem("history", json);
  }
}

/** 浏览器保存的历史记录项 */
interface HistoryItem {
  Name: string;
  Address: string;
  Port: number;
  RowId: string;
}

function ToHistoryItem(server: DstServer): HistoryItem {
  return {
    Name: server.Name,
    Address: server.Address.IP,
    Port: server.Port,
    RowId: server.RowId,
  };
}

export default new ServerHistoryManager();
export type { HistoryItem };
