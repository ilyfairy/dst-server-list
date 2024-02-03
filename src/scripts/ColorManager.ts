import { ref } from "vue";
import { random } from "./utils";
import colorLerp from "color-interpolate"; // 0~1

class ColorManager {
  private _tagsColor = ref<{ [key: string]: string }>({});

  get tagsColor() {
    return this._tagsColor.value;
  }
  set tagsColor(value) {
    this._tagsColor.value = value;
  }

  public constructor() {
    try {
      this.tagsColor = JSON.parse(localStorage.getItem("tagsColor") || "{}") ?? [];
    } catch (error) {
      this.tagsColor = {};
    }
  }

  public GetTagsColor(name: string) {}

  //生成十六进制随机颜色, 不附带#号
  public GetRandomColor(minGray: number, maxGray: number) {
    let r;
    let g;
    let b;
    let gray;
    do {
      r = random(0, 255);
      g = random(0, 255);
      b = random(0, 255);
      gray = 0.299 * r + 0.587 * g + 0.114 * b;
    } while (gray < minGray || gray > maxGray);

    return r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
  }

  public ColorNormalized(color: string) {
    if (color == null || color == "") return "#000000";
    if (color[0] == "#") color = color.substring(1);

    // 如果是3位颜色
    if (color.length == 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }

    color.padStart(6, "0");

    // 解析16进制颜色字符串
    const hex = parseInt(color, 16);
    let red = (hex >> 16) & 255;
    let green = (hex >> 8) & 255;
    let blue = hex & 255;

    // 获取灰度值
    const gray = 0.299 * red + 0.587 * green + 0.114 * blue;

    let x = 0;
    //调整到50~200灰度之间
    if (gray < 50) {
      // 将颜色调整到50灰度
      // const adjustment = 30 - gray;
      x = 50 - gray;
      // red = Math.min(255, Math.round(red * adjustment));
      // green = Math.min(255, Math.round(green * adjustment));
      // blue = Math.min(255, Math.round(blue * adjustment));
    } else if (gray > 180) {
      x = -(255 - gray);
      // 将颜色调整到200灰度
      // const adjustment = 200 / gray;
      // red = Math.round(red * adjustment);
      // green = Math.round(green * adjustment);
      // blue = Math.round(blue * adjustment);
    }

    // 调整颜色
    red += 2.99 * x;
    green += 0.587 * x;
    blue += 0.114 * x;

    const newColor = `#${((red << 16) | (green << 8) | blue).toString(16).padStart(6, "0")}`;
    return newColor;
  }

  public Lerp(color1: string, color2: string, t: number) {
    return colorLerp([color1, color2])(t);
  }

  public PlayerCountColor(count: number) {
    if (count <= 0) return "gray";
    return colorLerp([
      "#4290ff",
      "#4cb7ff",
      "#50ffd1",
      "#c9f657",
      "#c9f657",
      "#f74d79",
      "#af4cc1",
      "#4c4ac4",
      "#12106b",
      "#000000",
    ])(count / 100);
  }
}

export default new ColorManager();
