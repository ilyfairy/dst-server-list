<template>
  <v-card color="rgb(var(--v-modinfo-background1))">
    <v-col class="ma-2 mt-4">
      <!-- 标题栏 -->
      <v-row>
        <v-card-title style="font-size: 35px; color: rgb(var(--v-modinfo-foreground1))">
          {{ data.info?.Name }}

          <!-- 加载中转圈圈 -->
          <v-progress-circular
            v-if="data.loading"
            :indeterminate="true"
            :size="25"
            :width="5"
            color="#AAA"
          ></v-progress-circular>
        </v-card-title>

        <!-- <v-spacer></v-spacer> -->
        <!-- <v-btn class="mr-5" icon="mdi-rotate-3d-variant" variant="flat"></v-btn> -->
      </v-row>

      <!-- 内容 -->
      <v-row>
        <!-- 左侧 -->
        <v-col cols="9" style="margin-right: -40px;">
          <!-- <div @click="OpenSteamModUrl(data.info?.WorkshopId)">{{ data.info?.WorkshopId }}</div> -->

          <!-- 轮播图 -->
          <v-card-text v-if="data.info && data.info.Previews && data.info.Previews.length > 0">
            <v-carousel v-model="data.previewIndex" :show-arrows="false" :hide-delimiters="true" height="400">
              <v-carousel-item v-for="item in data.info.Previews" :key="item.PrewviewId">
                <v-img :src="item.Url + '?imw=500&ima=fit&impolicy=Letterbox'"></v-img>
              </v-carousel-item>

              <!-- <template v-slot:prev="{ props }">
                <v-btn icon @click="props.onClick" variant="elevated">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
              </template>
              <template v-slot:next="{ props }">
                <v-btn icon @click="props.onClick">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </template> -->
            </v-carousel>

            <div class="d-flex align-center" style="flex-direction: column">
              <v-tabs v-model="data.previewIndex" height="60" class="mt-2" style="max-width: 50vw">
                <v-tab v-for="item in data.info.Previews" :key="item.PrewviewId" width="120" height="60">
                  <v-img
                    width="120"
                    height="60"
                    :src="item.Url + '?imw=100&ima=fit&impolicy=Letterbox'"
                    style="background-color: #55555520"
                  ></v-img>
                </v-tab>
              </v-tabs>
            </div>
          </v-card-text>

          <!-- 喵述 -->
          <v-card-text style="color: rgb(var(--v-modinfo-foreground1));">
            <v-tabs class="mb-4" v-model="data.mainIndex">
              <v-tab>描述</v-tab>
              <v-tab v-if="!data.loading">配置</v-tab>
            </v-tabs>

            <!-- <div style="color: #555" class="mb-2">描述:</div> -->
            <v-window v-model="data.mainIndex">
              <!-- 描述 -->
              <v-window-item>
                <div ref="descriptionUI">
                  <div
                    class="steam-description"
                    style="font-size: 20px"
                    v-html="FormatDescription(data.info?.Description)"
                  ></div>
                </div>
              </v-window-item>

              <!-- 配置 -->
              <v-window-item>
                <div v-if="data.info?.ConfigurationOptions == null || data.info.ConfigurationOptions.length == 0">
                  没有任何配置
                </div>
                <div v-else>
                  <v-btn variant="text" @click="ResetOptions()">重置配置</v-btn>
                  <div v-for="item in data.configArray" :key="item.Object.Name">
                    <div v-if="item.Object.Type == 'Invalid'"></div>
                    <div v-if="item.Object.Type == 'Empty'">
                      <br />
                    </div>
                    <div v-if="item.Object.Type == 'Title'">
                      <div style="font-size: 25px; color: #5aa9d6">{{ item.Object.Name }}</div>
                    </div>
                    <div v-if="item.Object.Type == 'Option' && data.configMap[item.Object.Name]">
                      <span class="ml-1">{{ item.Object.Label || item.Object.Name }}:</span>
                      <v-btn icon="mdi-menu-left" variant="text" @click="SwitchConfigItem(item, '<')"></v-btn>
                      <span class="ml-3 mr-3">{{
                        item.Object.Options[data.configMap[item.Object.Name].Index].Description
                      }}</span>
                      <v-btn icon="mdi-menu-right" variant="text" @click="SwitchConfigItem(item, '>')"></v-btn>
                    </div>
                  </div>
                </div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-col>

        <!-- 右侧 -->
        <v-col cols="3" class="mr-8" style="color: rgb(var(--v-modinfo-foreground2))">
          <v-img :src="data.info?.PreviewImageUrl"></v-img>

          <div class="d-flex justify-center mt-2 mb-2">
            <v-btn @click="OpenSteamModUrl(id ?? data.info?.WorkshopId)" variant="text">
              WorkshopId: {{ id ?? data.info?.WorkshopId }}
              <!-- <v-tooltip activator="parent"> 访问Steam创意工坊 </v-tooltip> -->
            </v-btn>
          </div>

          <div>
            <div v-if="data.info?.ModType == 'Client'">客户端 Mod</div>
            <div v-if="data.info?.ModType == 'Server'">服务器 Mod</div>
          </div>

          <div v-if="data.info" class="align-center">最新版本: {{ data.info?.Version }}</div>

          <div v-if="data.info?.CreatedTime">
            创建日期: {{ utils.ToDateString(data.info.CreatedTime, utils.DateType.Full) }}
          </div>
          <div v-if="data.info?.UpdateTime">
            更新日期: {{ utils.ToDateString(data.info.UpdateTime, utils.DateType.Full) }}
          </div>

          <div v-if="data.info?.Size">
            Mod大小:
            <span v-if="data.info.Size <= 1024"> {{ data.info.Size }}Bytes</span>
            <span v-if="data.info.Size <= 1024 * 1024"> {{ (data.info.Size / 1024).toFixed(2) }}KB</span>
            <span v-if="data.info.Size > 1024 * 1024"> {{ (data.info.Size / 1024 / 1024).toFixed(2) }}MB</span>
          </div>

          <!-- 评分 -->
          <div v-if="data.info?.VoteData" class="mt-2">
            <div>{{ data.info.VoteData.VotesUp + data.info.VoteData.VotesDown }}个评价</div>
            <v-rating
              :model-value="
                (data.info.VoteData.VotesUp / (data.info.VoteData.VotesUp + data.info.VoteData.VotesDown)) * 5
              "
              :length="5"
              :size="30"
              :readonly="true"
              active-color="green"
              :half-increments="true"
            >
            </v-rating>
          </div>

          <!-- 标签 -->
          <div v-if="data.info?.Tags" class="mt-3">
            <div>Tags:</div>
            <div style="margin-left: -5px">
              <v-chip v-for="tag in data.info?.Tags" :key="tag" class="ma-1" @click="null">
                {{ tag }}
              </v-chip>
            </div>
          </div>

          <!-- 作者 -->
          <div class="mt-5" v-if="data.info">
            <div>作者:</div>
            <div>
              <div
                class="d-flex pa-1"
                style="border: #555 solid 1px"
              >
                <div class="mr-1">
                  <v-img :src="data.avatarUrl" width="50" height="50"></v-img>
                </div>
                <v-btn variant="text" @click="utils.OpenSteamPlayerUrl(data.info?.AuthorSteamId)">
                  {{ data.creatorName }}
                </v-btn>
              </div>
            </div>

            <!-- 单个作者 -->
            <!-- <div v-if="(data.info.Author ?? '').split(creatorSplit).length <= 1">
              <div
                class="d-flex pa-1"
                style="border: #555 solid 1px"
                v-for="item in data.info?.Author?.split(creatorSplit).take(1)"
                :key="item"
              >
                <div class="mr-1">
                  <v-img :src="data.avatarUrl" width="50" height="50"></v-img>
                </div>
                <v-btn variant="text" @click="utils.OpenSteamPlayerUrl(data.info?.AuthorSteamId)">
                  {{ item }}
                </v-btn>
              </div>
            </div> -->

            <!-- 多个作者 -->
            <!-- <div v-else>
              <div
                class="d-flex pa-1"
                style="border: #555 solid 1px"
                v-for="item in data.info?.Author?.split(creatorSplit).skip(1)"
                :key="item"
              >
                <div class="mr-1">
                  <v-img
                    :src="'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAIAAgAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/P4mW5nmllmeSR3LMzMSSc1a07R73V72KzsILi9u5TiOC2RpJHPoFGSarQ/ef6n+de4fAn9oaL4D+DfGX9i6Uf8AhO9XSKDT9eZY3WxiDZcBGByTkn0JCZBxQB41qeiX+iXslnqNtdWF3H9+3uo2jkX6q2CKpgy208MsUzxyI4ZWViCDmvsr9rrUdT1j9nb4T6h8RBbH4qXUs0zMsSxXJ04hivnKoAU5MPGBg7uM7q+NpvvJ9R/OgAh+8/1P867T4POI/iz4Mc6U+u7NZtG/suPbuu8TKfKG4hct93njnmuKIltp5opYXjkRyrKykEHNWbDVbvSr63vbKaezvLeRZYbi3ZkkidTlWVhyCCMgjpQB6l+1F411nx58dPFWpa5a3mnXaXP2ZNOvXVpLKNBhYflJUY5PB5JJ6k15LN95PqP51a1PWr7WtQnvtRuLm/vrhzJNc3TtJLIx6lmbJJ9zVQCW5nhiiheSR3CqqqSSc0Af/9k='"
                    width="50"
                    height="50"
                    color="pink"
                  ></v-img>
                </div>
                <v-btn variant="text">
                  {{ item }}
                </v-btn>
              </div>
            </div> -->
          </div>

          <!-- 访客数 -->
          <div v-if="data.info?.View" class="mt-4">
            <div class="view-block">
              <div class="view-value">{{ utils.FormatSplitNumber(data.info.View.Views) }}</div>
              <!-- <div class="view-label">不重复访客数</div> -->
              <div class="view-label">Unique Visitors</div>
            </div>

            <div class="view-block">
              <div class="view-value">{{ utils.FormatSplitNumber(data.info.View.Subscriptions) }}</div>
              <!-- <div class="view-label">当前订阅者</div> -->
              <div class="view-label">Current Subscribers</div>
            </div>

            <div class="view-block">
              <div class="view-value">{{ utils.FormatSplitNumber(data.info.View.Favorited) }}</div>
              <!-- <div class="view-label">当前收藏人数</div> -->
              <div class="view-label">Current Favorites</div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-card>
</template>

<script setup lang="ts">
import { GetModsInfoAsync, GetSteamUserInfo } from "@/scripts/api";
import { WebModInfo, WebModInfoLite, ConfigurationOption } from "@/scripts/response-model";
import { onMounted, onUnmounted, reactive, watch, ref } from "vue";
import { OpenSteamModUrl, delay } from "@/scripts/utils";
import CancellationTokenSource from "@/scripts/Sharp/CancellationTokenSource";
import * as utils from "@/scripts/utils";

const creatorSplit = /[,&、，]/;

const descriptionUI = ref<HTMLElement | null>(null);

const props = defineProps<{
  id?: number | null;
  info?: WebModInfoLite | null;
}>();

interface Config {
  Index: number;
  DefaultIndex: number;
  Object: ConfigurationOption;
}

const data = reactive({
  info: null as null | WebModInfo,
  cts: new CancellationTokenSource(),
  avatarUrl: "" as string,
  creatorName: "" as string,
  previewIndex: 0,
  loading: false,
  mainIndex: 0,
  configArray: [] as Config[],
  configMap: {} as { [key: string]: Config },
  // config: [] as { Name: string; Value: any }[],
});

async function GetModInfo(id: number) {
  const r = await GetModsInfoAsync(
    {
      WorkshopId: id,
      Language: "Chinese",
    },
    data.cts.Token,
  );
  if (r?.Code != 200) return;

  data.info = r.Mod;
}

onMounted(async () => {
  data.cts = new CancellationTokenSource();
  data.loading = true;
  try {
    if (props.info != null) {
      //提前请求头像
      GetSteamUserInfo(props.info?.AuthorSteamId).then(r => {
        data.avatarUrl = r?.avatar?.toString() ?? "";
        data.creatorName = r?.personaname ?? "";
      });
      data.info = props.info as WebModInfo;
      await GetModInfo(props.info.WorkshopId);
    } else if (props.id != null) {
      await GetModInfo(props.id);
      GetSteamUserInfo(data.info?.AuthorSteamId).then(r => {
        data.avatarUrl = r?.avatar?.toString() ?? "";
        data.creatorName = r?.personaname ?? "";
      });
    }
  } catch (e) {
    //
  }
  InitializeConfig();
  data.loading = false;
});

function SwitchConfigItem(option: Config, mode: "<" | ">") {
  if (mode == "<") {
    if (option.Index == 0) return;
    option.Index--;
  } else {
    if (option.Index == option.Object.Options.length - 1) return;
    option.Index++;
  }

  console.log("Data: ", option.Object.Options[option.Index]);
}

function InitializeConfig() {
  if (data.info?.ConfigurationOptions == null) return;

  let i = 0;
  for (const item of data.info.ConfigurationOptions) {
    if (item.Type != "Option") continue;
    let defaultIndex = 0;
    for (let index = 0; index < item.Options.length; index++) {
      if (item.Options[index].Data == item.Default) {
        defaultIndex = index;
        break;
      }
    }

    const config = {
      Object: item,
      DefaultIndex: defaultIndex,
      Index: defaultIndex,
    } as Config;
    data.configMap[item.Name] = config;
    data.configArray[i] = config;
    i++;
  }
}

function ResetOptions() {
  for (const option of data.configArray) {
    option.Index = option.DefaultIndex;
  }
}


function FormatDescription(description: string | null | undefined): string {
  if (description == null || description.length == 0) return "";

  const startLabel = "[noparse]";
  const endLabel = "[/noparse]";

  const noparseIndex = description.indexOf(startLabel);
  const noparseEndIndex = description.indexOf(endLabel);
  if (noparseIndex == -1) {
    return FormatDescriptionInternal(description);
  }

  return (
    FormatDescription(description.slice(0, noparseIndex)) +
    description.slice(noparseIndex + startLabel.length, noparseEndIndex) +
    FormatDescription(description.slice(noparseEndIndex + endLabel.length))
  );
}

function FormatDescriptionInternal(description: string) {
  description.replaceAll("<", "&lt;");
  description.replaceAll(">", "&gt;");

  // let last = description;
  // /*eslint no-constant-condition: "off"*/
  // while (true)
  // {
  //   // last = description.replaceAll(/\[list\]\r?\n?((.|\n|\r)*?)\[\/list\]\r?\n?/gi, '<ul class="steam-ul">$1</ul>'); // [list]\r?\n...[/list]\r?\n
  //   const last1 = description.replaceAll(/\[list\]\r?\n?/gi, '<ul class="steam-ul">');
  //   const last2 = last1.replaceAll(/\[\/list\]\r?\n?/gi, '</ul>');
  //   last = last2;
  //   if(last == description) {
  //     description = last;
  //     break;
  //   }
  //   description = last;
  // }
  // description = description.replaceAll(/\[list\]((.|\n|\r)*?)\[\/list\]/gi, '<ul class"steam-ul">$1</ul>'); // [list]...[/list]

  description = description.replaceAll(/\[\*\](.*)\r?\n/gi, '<li class="steam-li">$1</li>'); // [*]\r?\n
  // description = description.replaceAll(/\[\*\](.*)/gi, '<li class="steam-li">$1</li>'); // [*]

  description = description.replaceAll(/\[olist\]\r?\n?/gi, '<ol class="steam-ol">');
  description = description.replaceAll(/\[\/olist\]\r?\n?/gi, "</ol>");
  description = description.replaceAll(/\[list\]\r?\n?/gi, '<ul class="steam-ul">');
  description = description.replaceAll(/\[\/list\]\r?\n?/gi, "</ul>");

  // description = description.replaceAll(/\[h1\]((.|\n)*?)\[\/h1\](\x20*\r?\n)?/gi, '<div class="steam-h1">$1</div>'); // [h1]\r?\n?...[/h1]
  // description = description.replaceAll(/\[h2\]((.|\n)*?)\[\/h2\](\x20*\r?\n)?/gi, '<div class="steam-h2">$1</div>'); // [h2]\r?\n?...[/h2]
  // description = description.replaceAll(/\[h3\]((.|\n)*?)\[\/h3\](\x20*\r?\n)?/gi, '<div class="steam-h3">$1</div>'); // [h3]\r?\n?...[/h3]
  description = description.replaceAll(/\[h1\]\r?\n?/gi, '<div class="steam-h1">');
  description = description.replaceAll(/\[h2\]\r?\n?/gi, '<div class="steam-h2">');
  description = description.replaceAll(/\[h3\]\r?\n?/gi, '<div class="steam-h3">');
  description = description.replaceAll(/\[\/h1\]\r?\n?/gi, "</div>");
  description = description.replaceAll(/\[\/h2\]\r?\n?/gi, "</div>");
  description = description.replaceAll(/\[\/h3\]\r?\n?/gi, "</div>");

  // description = `<div class="steam-h1">${CheckConvertToUrl(description.replaceAll(/\[h1\]((.|\n)*?)\[\/h1\](\x20*\r?\n)?/gi, '$1'))}</div>`; // [h3]\r?\n?...[/h3]
  // description = `<div class="steam-h2">${CheckConvertToUrl(description.replaceAll(/\[h2\]((.|\n)*?)\[\/h2\](\x20*\r?\n)?/gi, '$1'))}</div>`; // [h3]\r?\n?...[/h3]
  // description = `<div class="steam-h3">${CheckConvertToUrl(description.replaceAll(/\[h3\]((.|\n)*?)\[\/h3\](\x20*\r?\n)?/gi, '$1'))}</div>`; // [h3]\r?\n?...[/h3]

  // description = description.replaceAll(/\[h1\]((.|\n)*?)\[\/h1\](\x20*\r?\n)?/gi, '<div class="steam-h1">$1</div>'); // [h1]\r?\n?...[/h1]

  description = description.replaceAll(/\[b\]/gi, '<b class="steam-b">');
  description = description.replaceAll(/\[\/b\]/gi, "</b>");
  description = description.replaceAll(/\[u\]/gi, '<u class="steam-u">');
  description = description.replaceAll(/\[\/u\]/gi, "</u>");
  description = description.replaceAll(/\[i\]/gi, '<i class="steam-i">');
  description = description.replaceAll(/\[\/i\]/gi, "</i>");
  // description = description.replaceAll(/\[b\]((.|\n)*?)\[\/b\]/gi, "<b>$1</b>");
  // description = description.replaceAll(/\[u\]((.|\n)*?)\[\/u\]/gi, "<u>$1</u>");
  // description = description.replaceAll(/\[i\]((.|\n)*?)\[\/i\]/gi, "<i>$1</i>");

  description = description.replaceAll(
    /\[url=(.*?)\](.*?)\[\/url\]/gi,
    '<a href="$1" class="steam-a" target="_black">$2</a>',
  ); // [url=链接]文字[/url]
  description = description.replaceAll(
    /\[url=(.*?)\]/gi,
    '<a href="$1" class="steam-a" target="_black">$1</a>',
  ); // [url=链接]

  description = description.replaceAll(
    /\[img\](.*?)\[\/img\]/gi,
    '<img class="steam-img" src="$1" style="max-width:500px" />',
  );
  description = description.replaceAll(
    /\[img=(.*?)\]\s*\[\/img\]/gi,
    '<img class="steam-img" src="$1" style="max-width:500px" />',
  );

  description = description.replaceAll(/\[hr\]\[\/hr\]/gi, "<hr>");

  description = description.replaceAll(/\[code\]((.|\n)*?)\[\/code\]/gi, "<code>$1</code>");

  description = description.replaceAll(
    /\[quote\]((.|\n|\r)*?)\[\/quote\]\r?\n?/gi,
    `<div class="steam-quote">$1</div>`,
  ); // [quote]xxx[/quote]
  description = description.replaceAll(
    /\[quote=(.*)\]((.|\n|\r)*?)\[\/quote\]\r?\n?/gi,
    `<div class="steam-quote"><div class="steam-quote-name"><i>引用自</i> <b>$1</b></div>$2</div>`,
  ); // [quote=xxx]xxx[/quote]

  description = description.replaceAll(/\[table\]\r?\n?/gi, '<div class="steam-table">');
  description = description.replaceAll(/\[\/table\]\r?\n?/gi, "</div>");
  description = description.replaceAll(/\[tr\]\r?\n?/gi, '<div class="steam-tr">');
  description = description.replaceAll(/\[\/tr\]\r?\n?/gi, "</div>");
  description = description.replaceAll(/\[th\]/gi, '<div class="steam-th">');
  description = description.replaceAll(/\[\/th\]\r?\n?/gi, "</div>");
  description = description.replaceAll(/\[td\]\r?\n?/gi, '<div class="steam-td">');
  description = description.replaceAll(/\[\/td\]\r?\n?/gi, "</div>");

  description = description.replaceAll(/\[spoiler\]/gi, '<span class="steam-spoiler">');
  description = description.replaceAll(/\[\/spoiler\]/gi, "</span>");

  // strike
  description = description.replaceAll(/\[strike\]/gi, '<strike class="steam-strike">');
  description = description.replaceAll(/\[\/strike\]/gi, "</strike>");

  description = description.replaceAll(/\n/gi, "<br/>");

  return description;
}

function CheckConvertToUrl(raw: string) {
  try {
    new URL(raw);
    return ConvertToUrl(raw, raw);
  } catch (error) {
    return raw;
  }
}

function ConvertToUrl(url: string, text: string) {
  return `<a href="${url}" class="steam-a" target="_black">${text}</a>`;
}

onMounted(async () => {
  if (descriptionUI.value == null) return;

  await delay(100);

  const root = descriptionUI.value.querySelector(".steam-description");
  if (root == null) return;

  for (const node of root.childNodes) {
    HandleChildren(node);
  }

  function HandleChildren(node: ChildNode) {
    if (node instanceof HTMLAnchorElement || node.nodeName == "A" || node.nodeName == "a") {
      return;
    }

    if (node instanceof HTMLElement) {
      try {
        if (node.textContent?.indexOf("http") == -1) return;
        const url = new URL(node.innerText).toString();
        node.innerHTML = ConvertToUrl(url, url);
        return;
      } catch {
        //
      }
    }

    if (node instanceof Text || node.nodeName == "#text") {
      if (node.nodeValue == null || node.nodeValue.length < 5) return;
      try {
        if (node.nodeValue.indexOf("http") == -1) return;
        const url = new URL(node.nodeValue).toString();
        const a = document.createElement("a");
        a.textContent = url;
        a.href = url;
        a.classList.add("steam-a");
        a.target = "_black";
        root?.replaceChild(a, node);
      } catch {
        //
      }
    }

    for (const item of node.childNodes) {
      HandleChildren(item);
    }
  }
});

onUnmounted(() => {
  data.cts.Cancel();
  data.info = null;
});

</script>

<style lang="scss" scoped>
//隐藏卡片的滚动条
::-webkit-scrollbar {
  // width: 20px !important;
  // height: 20px !important;
}

//Steam浏览量
.view-block {
  font-size: 19px;
}
.view-label {
  display: inline-block;
  margin-right: 5px;
}
.view-value {
  display: inline-block;
  color: #68B;
  width: 4.5em;
  text-align: right;
  margin-right: 10px;
}
</style>

<style lang="scss">
:root {
}

.steam-description {
  color: rgb(var(--v-modinfo-foreground2));
}

//标题
.steam-h1 {
  font-size: 35px;
  color: rgb(var(--v-modinfo-title));
  line-height: 1.15em;
}
.steam-h2 {
  font-size: 30px;
  color: rgb(var(--v-modinfo-title));
  line-height: 1.1em;
}
.steam-h3 {
  font-size: 25px;
  color: rgb(var(--v-modinfo-title));
  line-height: 1.1em;
}

//列表
.steam-ul {
  padding-inline-start: 40px;
}
.steam-ol {
  padding-inline-start: 40px;
}
.steam-li {
}

//a标签
.steam-a {
  // color: #eee;
  color: rgb(var(--v-modinfo-link));
  text-decoration: none;
}
.steam-a:hover {
  color: rgb(var(--v-modinfo-link-hover));
}
.stam-a:visited {
  color: rgb(var(--v-modinfo-link));
}
.steam-a:active { // 点击'时'的颜色
  color: rgb(var(--v-modinfo-link-hover));
}

.steam-img {
  // display: block;
}

//引用
.steam-quote-name {
}
.steam-quote {
  border: #86b5d1 solid 1px;
  padding: 10px;
  border-radius: 3px;
}

//表格
.steam-table {
  display: table;
}
.steam-tr {
  display: table-row;
}
.steam-th {
  display: table-cell;
  font-weight: bold;
  padding: 4px;
  border: #888 solid 1px;
  border-radius: 1px;
}
.steam-td {
  display: table-cell;
  padding: 4px;
  border: #888 solid 1px;
  border-radius: 1px;
}

//隐藏文本
.steam-spoiler {
  color: black;
  background-color: black;
}
.steam-spoiler:hover {
  color: inherit;
  background-color: transparent;
}

// 删除线
.steam-strike {
}
</style>
