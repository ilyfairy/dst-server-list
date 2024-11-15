<template>
  <VTextField
    @update:model-value="v => inputUpdated(v)"
    :model-value="props.modelValue"
    @keydown.enter="select()"
    @keydown.tab="tab()"
    :label="label"
    ref="textInput"
    :clearable="true"
    @click:clear="inputUpdated('')"
    :hide-details="true"
    density="compact"
    variant="outlined"
  >
    <VMenu activator="parent" location="bottom" v-model="data.showCompletion" :close-on-content-click="false">
      <!-- <v-row v-for="(item, index) in preOptionsComputed">
          <v-checkbox :label="item.toString()"> </v-checkbox>
        </v-row> -->
      <VList v-if="preOptionsComputed != null && preOptionsComputed.length > 0" density="compact" max-height="50vh">
        <VListItem
          v-for="item in preOptionsComputed.slice(0, 100)"
          :key="item.value"
          @click="isSelected(item) ? remove(item) : select(item)"
        >
          <!-- :style="{
            color: index == 0 ? 'black' : 'gray',
            background: index == 0 ? '#EEE' : undefined,
          }" -->

          <!-- <VListItemTitle>{{ item }}</VListItemTitle> -->
          <VCheckbox
            density="compact"
            :hide-spin-buttons="true"
            :hide-details="true"
            :label="item.toString()"
            :model-value="isSelected(item)"
            @update:model-value="v => (v == true ? select(item) : remove(item))"
            :tabindex="-1"
          >
          </VCheckbox>
        </VListItem>
        <VListItem v-if="preOptionsComputed.length > 100"> ... </VListItem>
      </VList>
    </VMenu>
  </VTextField>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { CustomOptionValue } from "@/scripts/utils";
import * as utils from "@/scripts/utils";
import "linqes";
import { VCheckbox } from "vuetify/components";

const splitRegex: RegExp = /[,;|]/; // 分隔符 ; , |
const splitChars = "|;,";
const textInput = ref<any>(null); // 原始组件

const props = withDefaults(
  defineProps<{
    preOptions: CustomOptionValue[]; // 预选项
    label: string; // 显示标签
    showSplit?: string; // 默认显示分隔符
    modelValue: string; // 输入框原始值
  }>(),
  {
    showSplit: ",",
  },
);

//事件
const emit = defineEmits<{
  (event: "update:modelValue", arg1: string): void;
  (event: "update:newArray", arg1: string[]): void;
}>();

//工具方法分割
function vsplit(input?: string) {
  return (input ?? props.modelValue)
    .split(splitRegex)
    .select(v => v.trim())
    .where(v => v != "")
    .toArray();
}

//工具方法,合并
function vjoin(inputChunks: string[]) {
  return inputChunks
    .select(v => v.trim())
    .where(v => v != "")
    .toArray()
    .join(`${props.showSplit} `);
}

function isCheck(text: string) {
  return preOptionsComputed.value.any(v => {
    return v.value == text;
  });
}

const data = reactive({
  showCompletion: false,
  oldList: [] as string[],
});

function isSelected(value: CustomOptionValue) {
  return props.modelValue.split(splitRegex).any(v => v.trim() == value.value);
}

//完成项
const preOptionsComputed = computed(() => {
  if (props.modelValue == null || props.modelValue == "") {
    return props.preOptions;
  }

  // let selected: string[] = [];
  // let unselected: string[] = [];

  let allOptions = props.preOptions;
  const selectedOpt: (string | CustomOptionValue)[] = [];
  const unselectedOpt: typeof selectedOpt = [];
  const inputChunks = props.modelValue.split(splitRegex);

  for (const item of props.preOptions) {
    if (isSelected(item)) {
      selectedOpt.push(item);
    } else {
      unselectedOpt.push(item);
    }
  }

  // // 过滤已存在的项
  // let options = props.preOptions.filter((v) => {
  //   let val = GetStringTranslateValue(v);
  //   return arr.every(
  //     (input) => input.trim().toUpperCase() != val.toUpperCase()
  //   );
  // });

  //不过滤, 而是显示已选择, 并排序到末尾
  // let options = props.preOptions.sort((v1, v2) => {
  //   let isSelecte1 = isSelected(v1);
  //   let isSelecte2 = isSelected(v2);

  //   return isSelecte1 == isSelecte2 ? 0 : isSelecte1 ? -1 : 1;
  // });

  //如果最后一项是空, 则返回所有项
  const lastChunk = inputChunks.at(-1)?.trim() ?? "";
  // console.log("lastInput", lastInput)
  // return [];
  // if (lastInput == "") {
  //   return [...unselectedOpt, ...selectedOpt];
  // }

  //临时定义函数, 匹配开始部分的字符串
  function isStartWith(option: CustomOptionValue) {
    return utils.StringStartWith(option.value, lastChunk) || utils.StringStartWith(option.text, lastChunk);
  }

  allOptions = allOptions.concat([]).toArray().sort((v, v2) => {
    const a = isStartWith(v) ? 1 : -1;
    const b = isStartWith(v2) ? 1 : -1;

    // //相同则排列在最后
    // if (lastChunk == v.value) {
    //   return 0;
    // }

    return b - a;
  });

  return allOptions;

  // 如果末尾有空格,则列出所有项,但是优先匹配输入框的那一项
  // if (data.value[data.value.length - 1] == " ") {
  //   return unselectedOpt.sort((v, v2) => {
  //     let a = isStartWith(v) ? 1 : -1;
  //     let b = isStartWith(v2) ? 1 : -1;
  //     return b - a;
  //   });
  // }
  // return options.filter((v) => isStartWith(v));
});

function remove(option?: CustomOptionValue) {
  if (option == null) {
    return;
  }

  if (option.isSingle) {
    // 移除了一个单选项, 说明已经移除了任何选项
    data.oldList = [];
    emit("update:modelValue", "");
    emit("update:newArray", []);
  }

  const removed = props.modelValue
    .split(splitRegex)
    .select(v => v.trim())
    .where(v => v != option.value)
    .toArray();

  data.oldList = removed;
  emit("update:modelValue", vjoin(removed));
  emit("update:newArray", removed);
}

//选择项 选中
function select(option?: CustomOptionValue) {
  let inputChunks = vsplit();

  if (option == null) {
    // enter格式化
    data.oldList = inputChunks;
    emit("update:modelValue", vjoin(inputChunks));
    emit("update:newArray", inputChunks);
    return;
  }

  //如果是选择单选项
  if (option.isSingle) {
    const single = [option.value];
    data.oldList = single;
    emit("update:modelValue", option.value);
    emit("update:newArray", single);
    return;
  }

  //过滤掉单选值
  const preOptions = props.preOptions;
  inputChunks = inputChunks.where(chunk => {
    return !preOptions.any(opt => opt.isSingle && utils.StringCompare(chunk, opt.value));
  }).toArray();

  // 如果匹配最后一个,则删除最后一个,然后添加选择的输入
  const last = inputChunks.at(-1)!;
  if (utils.StringStartWith(option.value, last) && !isCheck(last)) {
    inputChunks.pop();
  }

  let r: string[];
  if (inputChunks.all(v => v != option.value)) {
    r = [...inputChunks, option.value];
  } else {
    r = inputChunks.where(v => v != option.value).toArray();
  }

  // data.showCompletion = false;

  data.oldList = r;
  emit("update:modelValue", vjoin(r));
  emit("update:newArray", r);
  // textInput.value.$el.querySelector("input").focus(); // 聚焦
}

//自动补全
function tab() {
  let tabValue: string | null = null;

  const inputs: string[] = props.modelValue.split(splitRegex).select(v => v.trim()).toArray(); // 使用自己的分割, 并且不过滤空块
  const lastChunk = inputs.at(-1)!;
  const lastChunkTrim = lastChunk.trim(); // 最后一个输入块, 并且忽略空格
  const isEndSpace = props.modelValue.endsWith(" ") && lastChunkTrim != "";

  for (let i = 0; i < 10; i++) {
    const tabOption: CustomOptionValue | null = preOptionsComputed.value?.at(i) ?? null;
    if (tabOption == null) {
      return;
    }

    // 选择了一个单选项, 则忽略其它所有值, 变成单选的值
    if (tabOption.isSingle) {
      const single = [tabOption.value];
      data.oldList = single;
      emit("update:modelValue", tabOption.value);
      emit("update:newArray", single);
      return;
    }

    tabValue = tabOption.value;
    if (tabValue == null || tabValue == "") {
      return;
    }

    if (isSelected(tabOption)) {
      continue;
    }

    if (utils.StringStartWith(tabValue, lastChunkTrim)) {
      inputs.pop();
      break;
    } else if (isEndSpace) {
      break;
    } else {
      return;
    }
  }

  if (tabValue == null || tabValue.trim() == "") {
    return;
  }

  // let trim = props.modelValue.trim();
  // // // 如果最后一个字符不是分隔符,则删除最后一个, 然后补全新的输入
  // let last = arr[arr.length - 1];
  // let lastChar = trim[trim.length - 1];
  // if (
  //   splitChars.includes(lastChar) == false &&
  //   utils.StringStartWith(tabValue, last)
  // ) {
  //   arr.pop();
  // }

  const vals = inputs.where(v => v != "");

  const r = vals.append(tabValue).toArray();

  data.oldList = r;
  emit("update:modelValue", vjoin(r));
  emit("update:newArray", r);
}

//新的输入
async function inputUpdated(newValue: string, showCompletion: boolean = true) {
  data.showCompletion = showCompletion;
  emit("update:modelValue", newValue);

  if (newValue == null || newValue == "") {
    emit("update:newArray", []);
    return;
  }

  const inputChunks = vsplit(newValue);

  let isTrigger = false;

  //如果不相同, 则触发更新
  if (inputChunks.length != data.oldList.length) {
    isTrigger = true;
  } else {
    for (let i = 0; i < inputChunks.length; i++) {
      if (inputChunks[i] != data.oldList[i]) {
        isTrigger = true;
        break;
      }
    }
  }

  //延迟触发
  if (isTrigger) {
    data.oldList = inputChunks;
    emit("update:modelValue", newValue);
    emit("update:newArray", inputChunks);
  }
}

//py交易
watch(
  () => props.modelValue,
  async (newValue, oldValue) => {
    if (newValue == oldValue) return;
    if (newValue[0] == "\x01") {
      inputUpdated(newValue.slice(1), false);
    }
  },
);
</script>

<style></style>
