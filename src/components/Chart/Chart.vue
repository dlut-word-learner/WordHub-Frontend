<template>
  <el-container direction="vertical" class="statisticsContainer">
    <el-main id="barCharts">
      <el-row id="firstRow">
        <el-col v-for="task in tasks" :span="8"
          ><div
            class="barChart"
            :ref="(ele) => (barChartsRef[task] = ele as HTMLElement)"
          ></div
        ></el-col>
      </el-row>
    </el-main>
    <el-main>
      <el-row id="secondRow" :gutter="10">
        <el-col :span="8" id="heatMapCol"
          ><div
            id="heatMap"
            :ref="(ele) => (heatMapRef = ele as HTMLElement)"
          ></div
        ></el-col>
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
import { onMounted, reactive, ref } from "vue";
import * as echarts from "echarts";
import axios from "axios";
import { useHistoryStore } from "../../store/historyStore";
import { Task } from "../../store/taskStore";
import { DictVo } from "../Dicts/common";
import { isDark } from "../../main";

const progressNum = 3;
const historyStore = useHistoryStore();
const dictsToGenerateProgress: DictVo[] = historyStore.recentlyUsedDicts.slice(
  0,
  progressNum,
);
const tasks = [Task.Learn, Task.Review, Task.QwertyMode];

// 图表div元素绑定
const heatMapRef = ref<HTMLElement>();
const barChartsRef = reactive(new Map<Task, HTMLElement>());
const progressRef = ref<HTMLElement>();

// 实际ECharts图表
let heatMap: echarts.ECharts;
let barCharts = new Map<Task, echarts.ECharts>();
let progress: echarts.ECharts;

// 声明要从后端API取得的数据

const initChart = () => {
  console.log("heatMapRef: ");
  console.log(heatMapRef.value);
  console.log("progressRef: ");
  console.log(progressRef.value);
  for (const task of tasks) {
    initbarchart(task);
  }
  if (progressRef) {
    progress = echarts.init(progressRef.value);
    // for (let i = 0; i < 10; i++) {
    //   if (progressRef[i] != undefined) {
    //     console.debug("recentlyUsed: " + i);

    //     initProgress(i);
    //   } else break;
    // }
  }
  initheatchart();
  initProgress(1);
};
//for bar chart ,generate fake datas.
function getVirtualData(): Array<[string, string]> {
  const data: Array<[string, string]> = []; // 声明一个数组，其中的元素是键值对数组

  for (let i = 1; i <= 30; i++) {
    const date = `11/${i < 10 ? "0" + i : i}`; // 格式化日期字符串，补全个位数日期
    const randomValue = Math.floor(Math.random() * 10000).toString(); // 生成随机数并转换为字符串
    data.push([date, randomValue]); // 将键值对推入data数组中
  }

  return data;
}

function initbarchart(task: Task): void {
  if (barChartsRef[task]) {
    console.log(task);
    console.log(barChartsRef[task]);
    barCharts[task] = echarts.init(barChartsRef[task]);
    const option: echarts.EChartsOption = {
      xAxis: {
        type: "category",
        data: getVirtualData().map((item) => item[0]), // 获取虚拟数据中的第一个元素作为x轴数据
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: getVirtualData().map((item) => ({
            name: item[0], // 使用日期作为名称
            value: parseInt(item[1]), // 将随机数字符串转换为整数
          })),
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    };
    barCharts[task].setOption(option);
  }
}
// heatmap生成模拟数据的函数
function getheatmapVirtualData() {
  const currentDate = new Date();

  const startMonth = currentDate.getMonth() - 2; // Get the starting month (three months ago)
  currentDate.setMonth(startMonth); // Set the date to three months ago
  const date = +echarts.time.parse(
    echarts.time.format(currentDate, "{yyyy}-{MM}-01", false),
  );
  const end = +echarts.time.parse(
    echarts.time.format(new Date(), "{yyyy}-{MM}-31", false),
  );
  const dayTime = 3600 * 24 * 1000;
  const data: [string, number][] = [];

  for (let time = date; time < end; time += dayTime) {
    data.push([
      echarts.time.format(time, "{yyyy}-{MM}-{dd}", false),
      Math.floor(Math.random() * 10000),
    ]);
  }

  return data;
}

// const currentMonth = new Date().getMonth();

const currentDate = new Date();
const startOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() - 2,
  1,
);
const data = getheatmapVirtualData();

function initheatchart(): void {
  if (heatMapRef.value) {
    console.log("yes");
    heatMap = echarts.init(heatMapRef.value, isDark ? "Dark" : "default");

    const option: echarts.EChartsOption = {
      // backgroundColor: "#404a59",

      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "30",
        left: "100",
        data: ["Steps", "diligent days"],
        textStyle: {
          color: "#fff",
        },
      },
      calendar: [
        {
          top: 80,
          left: "center",
          range: [
            echarts.time.format(startOfMonth, "{yyyy}-{MM}-{dd}", false),
            echarts.time.format(currentDate, "{yyyy}-{MM}-{dd}", false),
          ],
          splitLine: {
            show: true,
            lineStyle: {
              color: "#000",
              width: 4,
              type: "solid",
            },
          },
          yearLabel: {
            formatter: " recent 3 months",
            color: "#fff",
          },
          itemStyle: {
            color: "#323c48",
            borderWidth: 1,
            borderColor: "#111",
          },
        },
      ],
      series: [
        {
          name: "Steps",
          type: "scatter",
          coordinateSystem: "calendar",
          data: data,
          symbolSize: function (val) {
            return val[1] / 500;
          },
          itemStyle: {
            color: "#409EFF",
          },
        },

        {
          name: "diligent days",
          type: "effectScatter",
          coordinateSystem: "calendar",
          data: data
            .sort(function (a, b) {
              return b[1] - a[1];
            })
            .slice(0, 6),
          symbolSize: function (val) {
            return val[1] / 500;
          },
          showEffectOn: "render",
          rippleEffect: {
            brushType: "stroke",
          },
          itemStyle: {
            color: "#f4e925",
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

function initProgress(index: number): void {
  if (progressRef.value) {
    // dictsToGenerateProgress[index].id;
    progress = echarts.init(progressRef.value);
    const option: echarts.EChartsOption = {
      // backgroundColor:"#17326b",
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
        axisLabel: { show: true },
        axisTick: { show: false },
        axisLine: { show: false },
      },
      yAxis: [
        {
          type: "category",
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            color: "black",
            fontSize: 14,
          },
          data: [
            "Japanese N3",
            "English TOFFL",
            "English CET-6",
            "English 3500",
          ],
          max: 4, // 关键：设置y刻度最大值，相当于设置总体行高
          inverse: true,
        },
        {
          type: "category",
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            color: "black",
            fontSize: 14,
          },
          data: [702, 350, 800, 600],
          max: 4, // 关键：设置y刻度最大值，相当于设置总体行高
          inverse: true,
        },
      ],
      series: [
        {
          name: "条",
          type: "bar",
          barWidth: 19,
          data: [80, 40, 60, 10],
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
          name: "进度条背景",
          type: "bar",
          barGap: "-100%",
          barWidth: 19,
          data: [100, 100, 100, 100],
          color: "#2e5384",
          itemStyle: {
            barBorderRadius: 10,
          },
        },
      ],
    };
    progress.setOption(option);
  }
}

onMounted(() => {
  initChart();
  window;
});

// 通过ref获取信息的示例
const fetchData = async () => {
  // 从后端API获取数据
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos/1",
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

fetchData();
</script>

<style>
/* 在这里放置你的样式 */
.statisticsContainer {
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
  height: 45vh;
}

#heatMap {
  height: 32vh;
}

.progress {
  width: 55vw;
  height: 32vh;
}
</style>
