<template>
  <el-container direction="vertical" id="statisticsContainer">
    <el-main id="barCharts" style="padding-bottom: 10px">
      <el-row id="firstRow">
        <el-col v-for="task in tasks" :span="8">
          <div
            class="barChart"
            :ref="(ele) => (barChartsRef[task] = ele as HTMLElement)"
          ></div>
        </el-col>
        <el-col v-for="task in tasks" :span="8">
          {{ $t(`statistics.bar${Task[task]}`) }}
        </el-col>
      </el-row>
    </el-main>
    <el-main>
      <el-row id="secondRow" :gutter="0">
        <el-col :span="8">
          <div
            id="heatmap"
            :ref="(ele) => (heatmapRef = ele as HTMLElement)"
          ></div>
        </el-col>
        <el-col :span="16">
          <div
            :ref="(ele) => (progressRef = ele as HTMLElement)"
            id="progress"
            v-show="showProgress"
          ></div>
          <div v-show="!showProgress" style="font-size: larger">
            {{ $t("statistics.noProgressData") }}
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useHistoryStore } from "../../store/historyStore";
import { Task } from "../../store/taskStore";
import { DictVo } from "../Dicts/common";
import { isDark } from "../../main";
import { useI18n } from "vue-i18n";
import { onUnmounted } from "vue";
import { useUserStore } from "../../store/userStore.js";
import { concatDate, progressVo } from "./Chart";
import axios from "axios";

import * as echarts from "echarts/core";
import { BarChart, ScatterChart, EffectScatterChart } from "echarts/charts";
import { TooltipComponent, CalendarComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import type {
  BarSeriesOption,
  EffectScatterSeriesOption,
  ScatterSeriesOption,
} from "echarts/charts";
import type { ComposeOption } from "echarts/core";
import { nextTick } from "vue";

type ECOption = ComposeOption<
  BarSeriesOption | ScatterSeriesOption | EffectScatterSeriesOption
>;

echarts.use([
  TooltipComponent,
  CalendarComponent,
  BarChart,
  ScatterChart,
  EffectScatterChart,
  CanvasRenderer,
]);

const { t } = useI18n();

const progressNum = 3;
const historyStore = useHistoryStore();
const userStore = useUserStore();
const dictsToGenerateProgress: DictVo[] = historyStore.recentlyUsedDicts.slice(
  0,
  progressNum,
);
const tasks = [Task.Learn, Task.Review, Task.QwertyMode];
const fontColor = computed(() => (isDark.value ? "#E5EAF3" : "#000"));

// 图表div元素绑定
const heatmapRef = ref<HTMLElement>();
const barChartsRef = reactive(new Map<Task, HTMLElement>());
const progressRef = ref<HTMLElement>();

// 实际ECharts图表
let heatmap: echarts.ECharts;
let barCharts = new Map<Task, echarts.ECharts>();
let progress: echarts.ECharts;
const showProgress = ref(true);
const dayLoading = {
  text: "loading",
  color: "#c23531",
  textColor: "#000",
  maskColor: "rgba(255, 255, 255, 0.3)",
  zlevel: 0,

  // 字体大小。从 `v4.8.0` 开始支持。
  fontSize: 12,
  // 是否显示旋转动画（spinner）。从 `v4.8.0` 开始支持。
  showSpinner: true,
  // 旋转动画（spinner）的半径。从 `v4.8.0` 开始支持。
  spinnerRadius: 10,
  // 旋转动画（spinner）的线宽。从 `v4.8.0` 开始支持。
  lineWidth: 5,
  fontWeight: "normal",
  fontStyle: "normal",
  fontFamily: "sans-serif",
};

const darkLoading = { ...dayLoading, maskColor: "rgba(0, 0, 0, 0.3)" };

// 声明要从后端API取得的数据
let barChartData = ref<Map<Task, [string, number][]>>(new Map());
const heatmapDuration = 90;
let heatmapData = ref<[string, number][]>([]);

interface ProgressModel {
  name: string[];
  sum: number[];
  studied: number[];
  mastered: number[];
}

// TODO: Reimplement this with echarts.dataset
let progressData = ref<ProgressModel>({
  name: [],
  sum: [],
  studied: [],
  mastered: [],
});

function getBarChartOption(task: Task): ECOption {
  return {
    tooltip: {
      trigger: "item",
    },
    grid: {
      bottom: 30,
      top: 30,
    },
    xAxis: {
      type: "category",
      show: false,
      // data: barChartData[task].map((x: [string, number])=>{x[0]}), // 获取虚拟数据中的第一个元素作为x轴数据
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#83bff6" },
          { offset: 0.7, color: "#188df0" },
          { offset: 1, color: "#188df0" },
        ]),
        data: barChartData[task].map(([name, value]) => ({
          name, // 使用日期作为名称
          value, // 将随机数字符串转换为整数
        })),
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
        emphasis: {
          focus: "series",
        },
      },
    ],
  };
}

const currentDate = new Date();
const startOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() - 2,
  1,
);

function getHeatmapOption(): ECOption {
  const maxTick = heatmapData.value
    .map(([_, x]) => x)
    .reduce((a, b) => Math.max(a, b));

  return {
    tooltip: {
      trigger: "item",
    },
    calendar: [
      {
        left: 35,
        top: 25,
        right: 35,
        bottom: 45,
        cellSize: "auto",
        range: [
          echarts.time.format(startOfMonth, "{yyyy}-{MM}-{dd}", false),
          echarts.time.format(currentDate, "{yyyy}-{MM}-{dd}", false),
        ],
        splitLine: {
          show: true,
          lineStyle: {
            color: isDark.value ? "#79bbff" : "#337ecc",
            width: 4,
            type: "solid",
          },
        },
        dayLabel: {
          color: fontColor.value,
        },
        monthLabel: {
          color: fontColor.value,
        },
        yearLabel: {
          formatter: t("statistics.recentMonths"),
          position: "bottom",
          color: fontColor.value,
          margin: 16,
          fontSize: 15,
        },
        itemStyle: {
          color: isDark.value ? "#337ecc" : "#c6e2ff",
          borderWidth: 1,
          borderColor: isDark.value ? "#79bbff" : "#337ecc",
        },
      },
    ],
    series: [
      {
        name: t("statistics.steps"),
        type: "scatter",
        coordinateSystem: "calendar",
        data: heatmapData.value,
        symbolSize: ([_, tick]) => {
          return (20 * Math.log(tick)) / Math.log(maxTick);
        },
        itemStyle: {
          color: isDark.value ? "#b3e19d" : "#409EFF",
        },
      },

      {
        name: t("statistics.diligentDays"),
        type: "effectScatter",
        coordinateSystem: "calendar",
        data: heatmapData.value
          .sort(([_a, a], [_b, b]) => {
            return b - a;
          })
          .slice(0, 6),
        symbolSize: ([_, tick]) => {
          return (20 * Math.log(tick)) / Math.log(maxTick);
        },
        showEffectOn: "render",
        rippleEffect: {
          brushType: "stroke",
        },
        itemStyle: {
          color: isDark.value ? "#eebe77" : "#f4e925",
          shadowBlur: 10,
          shadowColor: "#333",
        },
        zlevel: 1,
      },
    ],
  };
}

function getProgressOption(): ECOption {
  return {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "10",
      top: "10",
      right: "0",
      bottom: "10",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      splitLine: { show: true },
      axisLabel: {
        show: true,
        color: fontColor.value,
      },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    yAxis: [
      {
        type: "category",
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: fontColor.value,
          fontSize: 14,
        },
        data: progressData.value.name,
        max: 4, // 关键：设置y刻度最大值，相当于设置总体行高
        inverse: true,
      },
      {
        type: "category",
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: fontColor.value,
          fontSize: 14,
        },
        data: progressData.value.sum,
        max: 4, // 关键：设置y刻度最大值，相当于设置总体行高
        inverse: true,
      },
    ],
    series: [
      {
        name: t("statistics.studied"),
        type: "bar",
        barWidth: 19,
        data: progressData.value.studied,
        barCategoryGap: 20,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: "#22b6ed",
            },
            {
              offset: 1,
              color: "#3fE279",
            },
          ]),
          borderRadius: 10,
        },
        zlevel: 2,
      },
      {
        name: t("statistics.mastered"),
        type: "bar",
        barWidth: 19,
        data: progressData.value.mastered,
        barCategoryGap: 20,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: "#f89898",
            },
            {
              offset: 1,
              color: "#eebe77",
            },
          ]),
          borderRadius: 10,
        },
        zlevel: 3,
      },
      {
        name: t("statistics.totalWords"),
        type: "bar",
        barGap: "-100%",
        barWidth: 19,
        data: progressData.value.sum,
        color: isDark.value ? "#2e5384" : "#dedfe0",
        itemStyle: {
          borderRadius: 10,
          opacity: 0.45,
        },
        zlevel: 1,
      },
    ],
  };
}

function handleResize() {
  nextTick(() => {
    barCharts.forEach((x) => x.resize());
    progress.resize();
    heatmap.resize();
  });
}

onMounted(async () => {
  // initChart();
  try {
    await fetchData();

    window.addEventListener("resize", handleResize);
  } catch (error) {
    console.error(error);
  }
});

onUnmounted(() => {
  // 卸载echarts实例
  window.removeEventListener("resize", handleResize);
});

// 异步并发获取数据
const fetchData = async () => {
  const promises: Promise<any>[] = [];

  // 分别获取学习、复习、qwerty三个柱状图的数据
  for (const task of tasks) {
    barCharts[task] = echarts.init(barChartsRef[task]);
    barCharts[task].showLoading(isDark.value ? darkLoading : dayLoading);
    promises.push(
      axios
        .get(`/api/users/${userStore.userVo!.id}/study-rec/${Task[task]}`)
        .then((res) => {
          barChartData[task] = concatDate(res.data as number[]);
          barCharts[task].hideLoading();
          barCharts[task].setOption(getBarChartOption(task));
        })
        .catch(() => {
          barCharts[task].hideLoading();
        }),
    );
  }

  // 获取热力图数据
  heatmap = echarts.init(heatmapRef.value);
  heatmap.showLoading(isDark.value ? darkLoading : dayLoading);
  promises.push(
    axios
      .get(
        `/api/users/${
          userStore.userVo!.id
        }/study-rec?duration=${heatmapDuration}`,
      )
      .then((res) => {
        heatmapData.value = concatDate(res.data);
        heatmap.hideLoading();
        heatmap.setOption(getHeatmapOption());
      })
      .catch(() => {
        heatmap.hideLoading();
      }),
  );

  // 对最近词库分别获取进度信息
  progress = echarts.init(progressRef.value);
  if (dictsToGenerateProgress.length)
    progress.showLoading(isDark.value ? darkLoading : dayLoading);
  else showProgress.value = false;
  for (const [index, dict] of dictsToGenerateProgress.entries()) {
    promises.push(
      axios
        .get(`/api/dicts/${dict.id}/progress`)
        .then((res) => {
          const data = res.data as progressVo;
          progressData.value.name[index] = dict.name;
          progressData.value.mastered[index] = data.mastered;
          progressData.value.sum[index] = data.sum;
          progressData.value.studied[index] = data.studied;
          if (dict.name.includes("For Test")) showProgress.value = false;
          progress.hideLoading();
          progress.setOption(getProgressOption());
        })
        .catch(() => {
          progress.hideLoading();
        }),
    );
  }
  await Promise.all(promises);
};
</script>

<style>
#statisticsContainer {
  align-items: center;
  align-content: center;
  width: 100%;
}

#barCharts {
  flex: 1;
}

#firstRow {
  flex: 1;
  align-items: center;
  width: 95vw;
  height: 45vh;
}

#secondRow {
  flex: 1;
  background-color: #a0cfff;
  border-radius: 20px;
  align-items: center;
  justify-items: center;
  width: 92vw;
  height: 38vh;
  padding: 1vh 2.5vw;
  box-shadow: 0px 1px 15px 3px rgba(0, 0, 0, 0.2);
}

html.dark #secondRow {
  background-color: #337ecc;
  box-shadow: 0px 1px 15px 3px rgba(51, 125, 204, 0.2);
}

.barChart {
  width: 32vw;
  height: 42vh;
}

#heatmap {
  height: 35vh;
}

#progress {
  height: 35vh;
}
</style>
