<template>
  <el-container direction="vertical" id="statisticsContainer">
    <el-main id="barCharts">
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
        <el-col :span="8" id="heatMapCol">
          <div
            id="heatMap"
            :ref="(ele) => (heatMapRef = ele as HTMLElement)"
          ></div>
        </el-col>
        <el-col :span="16" id="progressCol">
          <div
            :ref="(ele) => (progressRef = ele as HTMLElement)"
            class="progress"
          ></div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import * as echarts from "echarts";
import axios from "axios";
import { useHistoryStore } from "../../store/historyStore";
import { Task } from "../../store/taskStore";
import { DictVo } from "../Dicts/common";
import { isDark } from "../../main";
import { useI18n } from "vue-i18n";
import { onUnmounted } from "vue";
import { useLoginStore } from "../../store/loginStore";
import { concatDate, progressVo } from "./Chart";
const { t } = useI18n();

const progressNum = 3;
const historyStore = useHistoryStore();
const loginStore = useLoginStore();
const dictsToGenerateProgress: DictVo[] = historyStore.recentlyUsedDicts.slice(
  0,
  progressNum,
);
const tasks = [Task.Learn, Task.Review, Task.QwertyMode];
const fontColor = computed(() => (isDark.value ? "#E5EAF3" : "#000"));

// 图表div元素绑定
const heatMapRef = ref<HTMLElement>();
const barChartsRef = reactive(new Map<Task, HTMLElement>());
const progressRef = ref<HTMLElement>();

// 实际ECharts图表
let heatMap: echarts.ECharts;
let barCharts = new Map<Task, echarts.ECharts>();
let progress: echarts.ECharts;

// 声明要从后端API取得的数据
let barChartData = new Map<Task, [string, number][]>();
const heatmapDuration = 90;
let heatmapData: [string, number][] = [];
interface progressModel {
  name: string[];
  sum: number[];
  studied: number[];
  mastered: number[];
}
let progressData: progressModel = {
  name: [],
  sum: [],
  studied: [],
  mastered: [],
};

function initbarchart(task: Task): void {
  if (barChartsRef[task]) {
    // console.log(task);
    // console.log(barChartsRef[task]);
    barCharts[task] = echarts.init(barChartsRef[task]);
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
      },
      grid: {
        bottom: 30,
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
          data: barChartData[task].map((item) => ({
            name: item[0], // 使用日期作为名称
            value: parseInt(item[1]), // 将随机数字符串转换为整数
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
    barCharts[task].setOption(option);
  }
}

const currentDate = new Date();
const startOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() - 2,
  1,
);

function initHeatMap(): void {
  if (heatMapRef.value) {
    console.log("yes");
    heatMap = echarts.init(heatMapRef.value);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
      },
      calendar: [
        {
          cellSize: 24,
          range: [
            echarts.time.format(startOfMonth, "{yyyy}-{MM}-{dd}", false),
            echarts.time.format(currentDate, "{yyyy}-{MM}-{dd}", false),
          ],
          splitLine: {
            show: true,
            lineStyle: {
              color: isDark.value ? "#79bbff" : "#337ecc",
              width: 2,
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
            fontSize: 16,
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
          data: heatmapData,
          symbolSize: function (val) {
            return val[1] / 3;
          },
          itemStyle: {
            color: isDark.value ? "#b3e19d" : "#409EFF",
          },
        },

        {
          name: t("statistics.diligentDays"),
          type: "effectScatter",
          coordinateSystem: "calendar",
          data: heatmapData
            .sort(function (a, b) {
              return b[1] - a[1];
            })
            .slice(0, 6),
          symbolSize: function (val) {
            return val[1] / 3;
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
    heatMap.setOption(option);
  }
}

function initProgress(): void {
  if (progressRef.value) {
    // dictsToGenerateProgress[index].id;
    progress = echarts.init(progressRef.value);
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
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
          data: progressData.name,
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
          data: progressData.sum,
          max: 4, // 关键：设置y刻度最大值，相当于设置总体行高
          inverse: true,
        },
      ],
      series: [
        {
          name: t("statistics.studied"),
          type: "bar",
          barWidth: 19,
          data: progressData.studied,
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
          zlevel: 1,
        },
        {
          name: t("statistics.mastered"),
          type: "bar",
          barWidth: 19,
          data: progressData.mastered,
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
          zlevel: 2,
        },
        {
          name: t("statistics.totalWords"),
          type: "bar",
          barGap: "-100%",
          barWidth: 19,
          data: progressData.sum,
          color: isDark.value ? "#2e5384" : "#dedfe0",
          itemStyle: {
            borderRadius: 10,
            opacity: 0.45,
          },
        },
      ],
    };
    progress.setOption(option);
  }
}

function handleResize() {
  barCharts.forEach((x) => x.resize());
  progress.resize();
  heatMap.resize();
}
onMounted(async () => {
  // initChart();
  await fetchData();
  console.log("barChartData: ", barChartData);
  console.log("heatmapData: ", heatmapData);
  console.log("progressData: ", progressData);
  for (const task of tasks) {
    initbarchart(task);
  }

  initHeatMap();
  initProgress();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  // 卸载echarts实例
  window.removeEventListener("resize", handleResize);
});

// 通过ref获取信息的示例
const fetchData = async () => {
  // 从后端API获取数据
  try {
    // 分别获取学习、复习、qwerty三个柱状图的数据
    for (const task of tasks) {
      barChartData[task] = concatDate(
        (await axios.get(`/api/users/1/study-rec/${Task[task]}`))
          .data as number[],
      );
    }

    // 获取热力图数据
    let heatmapData1 = (
      await axios.get(
        `/api/users/${loginStore.userVo?.id}/study-rec?duration=${heatmapDuration}`,
      )
    ).data;
    heatmapData = concatDate(heatmapData1);

    // 没有最近单词，则生成假数据
    if (dictsToGenerateProgress.length == 0) {
      dictsToGenerateProgress.push({
        id: 1,
        language: "English",
        name: "3500",
      });
      dictsToGenerateProgress.push({
        id: 14,
        language: "Japanese",
        name: "N3",
      });
      dictsToGenerateProgress.push({
        id: 2,
        language: "English",
        name: "CET-4",
      });
      dictsToGenerateProgress.push({
        id: 8,
        language: "English",
        name: "CET-6",
      });
    }
    // 对最近词库分别获取进度信息
    for (const [index, dict] of dictsToGenerateProgress.entries()) {
      const data = (await axios.get(`/api/dicts/${dict.id}/progress`))
        .data as progressVo;
      progressData.name[index] = dict.name;
      progressData.mastered[index] = data.mastered;
      progressData.sum[index] = data.sum;
      progressData.studied[index] = data.studied;
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style>
/* 在这里放置你的样式 */
#statisticsContainer {
  align-items: center;
  align-content: center;
  width: 100%;
}

#barCharts {
  flex: 1;
}

#firstRow {
  align-items: center;
  width: 95vw;
}

#secondRow {
  flex: 1;
  background-color: #a0cfff;
  border-radius: 20px;
  align-items: center;
  justify-items: center;
  width: 92vw;
  height: 38vh;
  padding: 10px;
  margin: 0 15px;
  margin-bottom: 20px;
}

html.dark #secondRow {
  background-color: #337ecc;
}

.barChart {
  width: 32vw;
  height: 42vh;
}

#heatMap {
  height: 32vh;
}

.progress {
  width: 55vw;
  height: 32vh;
}
</style>
