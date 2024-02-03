class WebAttribute {
  public constructor(path: string) {
    window.addEventListener("hashchange", e => this.OnHashChange(e));

    this.path = path;
    this.isTrigger = true;
    this.Parse();
  }

  public path: string;
  public data: { [key: string]: string | null } = {};
  private isTrigger;

  public OnChanged?: (data: typeof this.data) => void;

  private OnHashChange(e: HashChangeEvent) {
    if (!this.isTrigger) return;

    const $old = new URL(e.oldURL).hash;
    const $new = new URL(e.newURL).hash;

    this.path = $new;
    this.Parse();

    this.OnChanged?.call(this, this.data);
  }

  public async SetJson(key: string, value: any | null) {
    if (value == null) {
      this.data[key] = null;
    } else {
      this.isTrigger = false;
      if (typeof value == "number") {
        this.data[key] = this.Encode(value.toString());
      } else if (typeof value == "string") {
        if (value.length == 0) {
          this.data[key] = null;
        } else {
          this.data[key] = this.Encode(value.toString());
        }
      } else {
        this.data[key] = this.Encode(JSON.stringify(value));
      }
    }
    this.path = this.Make(true);
    await new Promise(resolve => setTimeout(resolve, 0));
    this.isTrigger = true;
  }
  public GetJson<T = any>(key: string) {
    const val = this.data[key];
    if (val == null) return null;
    const deval = this.Decode(val);
    try {
      return JSON.parse(deval) as T;
    } catch {
      return deval as any;
    }
  }

  public async SetString(key: string, value: string | null) {
    if (value == null) {
      this.data[key] = null;
    } else {
      this.isTrigger = false;
      if (value.length == 0) {
        this.data[key] = null;
      } else {
        this.data[key] = this.Encode(value.toString());
      }
    }
    this.path = this.Make(true);
    await new Promise(resolve => setTimeout(resolve, 0));
    this.isTrigger = true;
  }
  public GetString(key: string) {
    const val = this.data[key];
    if (val == null) return null;
    return this.Decode(val);
  }

  public async SetBoolean(key: string, value: boolean | null) {
    if (value == null) {
      this.data[key] = null;
    } else {
      this.data[key] = value.toString();
    }
    this.path = this.Make(true);
    await new Promise(resolve => setTimeout(resolve, 0));
    this.isTrigger = true;
  }
  public GetBoolean(key: string) {
    const val = this.data[key];
    if (val == null) return null;
    const result = val == "true" || val == "1" || val == "on";
    return result;
  }

  /** data to path */
  public Make(isApply: boolean = false): string {
    let temp = "";
    for (const key in this.data) {
      const value = this.data[key];
      if (value == null) continue;
      temp += `${key}[${encodeURI(value)}]`;
    }
    if (isApply) {
      window.location.hash = temp;
    }
    return temp;
  }

  /** path to data */
  public Parse() {
    if (this.path[0] == "#") {
      this.path = this.path.slice(1);
    }
    const kvs = this.path.split("]").where(v => v != "");
    this.data = {};
    for (const item of kvs) {
      const kv = item.split("[");
      if (kv.length != 2) continue;
      const k = kv[0];
      const v = decodeURI(kv[1]);
      this.data[k] = v;
    }
    return this.data;
  }

  private encodeChars = `[]"'`;

  private Encode(str: string) {
    for (const c of this.encodeChars) {
      str = str.replaceAll(c, "%" + c.charCodeAt(0).toString(16));
    }
    return str;
  }

  private Decode(str: string) {
    for (const c of this.encodeChars) {
      str = str.replaceAll("%" + c.charCodeAt(0).toString(16), c);
    }
    return str;
  }
}

// let hash = window.location.hash;
// if(window.location.hash[0] == '#'){
//   hash = window.location.hash.slice(1);
// }

export default new WebAttribute(window.location.hash);
