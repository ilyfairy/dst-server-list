<template>
  <!-- <div :ref="v => ((data as any).ui = v)" style="height: 150px"></div> -->
  <div ref="ui" style="height: 150px"></div>
</template>

<script setup lang="tsx">
import i18n from "@/i18n";
import { EChartsOption, default as echarts } from "@/plugins/echarts";
import ColorManager from "@/scripts/ColorManager";
import { ServerHistoryItem } from "@/scripts/response-model";
import { translate } from "@/scripts/translate";
import { DateType, GetSeasonDaysString, ToDateString, delay } from "@/scripts/utils";
import { ref } from "vue";
import { nextTick } from "vue";
import { computed, onMounted, onUnmounted, reactive, shallowRef, watch } from "vue";
import { useTheme } from "vuetify";

// TODO 表格无法加载

const theme = useTheme();

const props = defineProps<{
  list: ServerHistoryItem[] | null;
}>();

const ui = ref<HTMLElement | null>(null);
const isDisplay = ref(false);
// const data = reactive({
//   ui: null as null | HTMLElement,
// });

const chartsInfo = shallowRef<null | echarts.ECharts>(null);

const option = computed(() => {
  return {
    title: {
      text: i18n.global.t("home.history"),
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // type: "cross",
        // show: true,
        // crossStyle: {
        //   color: "#999",   // 光标线的颜色
        //   type: "dashed"   // 光标线的类型
        // },
        // label: { // xy轴的标签
        //   formatter: v => {
        //     if (v.axisDimension == "x") {
        //       // const data = props.list![v.axisIndex];
        //       // let append = "";
        //       // if (data.Players != null) {
        //       //   append += `\n(${data.Players} players)`;
        //       // } else if (data.PlayerCount != null) {
        //       //   append += `\n(${data.PlayerCount} players)`;
        //       // }
        //       return v.value; // x轴tooltip显示的文字
        //     } else if (v.axisDimension == "y") {
        //       return `${Math.round(v.value as any)}个`;
        //     }
        //     return v.value;
        //   },
        // },
      },
      formatter: v => {
        // tooltip显示的文字内容
        const index = (v as any)[0].dataIndex; // 数据索引
        const data = props.list![index];
        let node = `${ToDateString(data.DateTime, DateType.Full)}`;
        node += `<br/>${i18n.global.t("dst.playerCount")}: ${data.PlayerCount}`;
        if (data.DaysInfo != null) {
          node += `<br/>${i18n.global.t("home.daysPre")}: ${data.DaysInfo.Day}`;
        }
        if (data.Season != null) {
          node += `<br/>${i18n.global.t("home.tableHeader.season")}: ${translate(data.Season)}`;
          if (data.DaysInfo != null) {
            node += GetSeasonDaysString(data.DaysInfo);
          }
        }
        return node;
      },
    },
    xAxis: {
      // x轴数据
      data:
        props.list
          ?.select(v => {
            let str = "";
            const date = ToDateString(new Date(v.DateTime), DateType.TimeMinute);
            const day = v.DaysInfo?.Day;

            str += date;
            if (day != null) {
              str += `\n(${day} day)`;
            }

            return str;
          })
          .toArray() ?? [],
      boundaryGap: true,
      axisPointer: {
        // type: "line",
      },
      type: "category",
    },
    yAxis: {
      // name: '玩家个数',
      // name: '人数',
      minInterval: 1,
      axisLabel: {
        formatter: "{value} players",
      },
    },
    grid: {
      top: "30%",
      bottom: "5px",
      left: "0%",
      right: "0%",
      containLabel: true,
    },
    series: [
      {
        data:
          props.list
            ?.select(v => {
              return v.PlayerCount;
            })
            .toArray() ?? [],
        type: "line", // 折线图
        smooth: true, // 平滑曲线显示
        showSymbol: true,
        symbol: "circle", // 标记的图形为实心圆
        symbolSize: 8, // 标记的大小
        itemStyle: {
          color: v => {
            return ColorManager.PlayerCountColor(v.value as number);
          },
          opacity: 0.9,
        },
        lineStyle: {
          width: 2,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops:
              props.list?.map((v, i) => {
                // 彩色曲线
                return {
                  offset: i / props.list!.length ?? 0,
                  color: ColorManager.PlayerCountColor(v.PlayerCount),
                };
              }) ?? [],
          },
        },
      },
    ],
  } as EChartsOption;
});

function SetData() {
  chartsInfo.value?.setOption(option.value);
}

//当发生改变时, 或挂载时, 则更新图标
watch(
  () => props.list,
  newValue => {
    if (newValue == null || newValue.length == 0) {
      chartsInfo.value?.clear();
    } else {
      SetData();
    }
  },
);

const onresize = () => {
  chartsInfo.value?.resize();
  SetData();
};

onMounted(async () => {
  isDisplay.value = true;
  await nextTick(); // 确保让ui.clientWidth加载完毕
  chartsInfo.value = echarts.init(ui.value, theme.current.value.dark ? "dark" : "light");
  while(!(ui.value?.clientWidth) || !(ui.value?.clientHeight)) {
    if(isDisplay.value){
      await delay(50);
    }else{
      return;
    }
  }
  // console.log('width: ', ui.value?.clientWidth);
  // console.log('height: ', ui.value?.clientHeight);
  SetData();
  window.addEventListener("resize", onresize);
});

onUnmounted(() => {
  chartsInfo.value?.dispose();
  window.removeEventListener("resize", onresize);
  isDisplay.value = false;
});
</script>

<style></style>
