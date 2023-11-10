<template>
  <el-container direction="vertical" class="statisticsContainer">
    <el-main id="barCharts">
      <el-row>
        <el-col v-for="task in tasks" :span="8"
          ><div class="barChart" :ref="(ele) => (barChartsRef[task] = ele)"></div
        ></el-col>
      </el-row>
    </el-main>
    <el-main id="secondRow">
      <el-row>
        <el-col
          ><div id="heatMap" :ref="ele => {heatMapRef = ele  as HTMLElement}"></div
        ></el-col>
        <el-col>
          <div v-for="(_dict, index) in dictsToGenerateProgress" class="progress">
            <div
              :ref="(ele) => {progressRef[index] = ele as HTMLElement}"
            ></div>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { Ref, onMounted, reactive, ref } from "vue";
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
const heatMapRef: Ref<HTMLElement | null> = ref(null);
const barChartsRef = reactive(new Map<Task, HTMLElement>());
const progressRef = reactive<HTMLElement[]>([]);

// 实际ECharts图表
let heatMap: echarts.ECharts;
let barCharts= new Map<Task, echarts.ECharts>();
let progress: echarts.ECharts[] = [];

// 声明要从后端API取得的数据

const initChart = () => {
  if (progressRef) {
    for (let i = 0; i < 10; i++) {
      if (progressRef[i] != undefined) {
        console.debug("recentlyUsed: " + i);
        progress.push(echarts.init(progressRef[i]));
        initProgress(i);
      } else break;
    }
  }
  initheatchart();
  initbarchart(Task.Learn);
  initbarchart(Task.Review);
  initbarchart(Task.QwertyMode);
};
//for bar chart ,generate fake datas.
function getVirtualData(): Array<[string, string]> {
  const data: Array<[string, string]> = []; // 声明一个数组，其中的元素是键值对数组

  for (let i = 1; i <= 30; i++) {
    const date = `11/${i < 10 ? '0' + i : i}`; // 格式化日期字符串，补全个位数日期
    const randomValue = Math.floor(Math.random() * 10000).toString(); // 生成随机数并转换为字符串
    data.push([date, randomValue]); // 将键值对推入data数组中
  }

  return data;
}

function initbarchart(task: Task): void {
  console.log(task + ": " + barChartsRef.has(task));
  console.log(heatMapRef[task]);
  if (barChartsRef[task] != undefined) {
    console.log("yes");
    barCharts[task] = echarts.init(barChartsRef[task]);
    const option: echarts.EChartsOption = {
      xAxis: {
    type: "category",
    data: getVirtualData().map(item => item[0]), // 获取虚拟数据中的第一个元素作为x轴数据
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: getVirtualData().map(item => ({
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
function generateData(): Array<[string, string]> {
  const data: Array<[string, string]> = [];
  for (let i = 1; i <= 90; i++) {
    const date = `2023-${Math.floor(i / 30) + 9}-${i % 30 + 1}`;
    const randomValue = Math.floor(Math.random() * 10000).toString();
    data.push([date, randomValue]);
  }
  return data;
}

// heatmap生成模拟系列数据的函数
function generateMockSeries(data: Array<[string, string]>): echarts.SeriesOption[] {
  const recentData = data.slice(-90);

  const series: echarts.SeriesOption[] = [
    {
      name: 'Steps',
      type: 'scatter',
      coordinateSystem: 'calendar',
      data: recentData,
      symbolSize: function (val) {
        return val[1] / 500;
      },
      itemStyle: {
        color: '#ddb926'
      }
    },
    {
      name: 'Top 12',
      type: 'effectScatter',
      coordinateSystem: 'calendar',
      data:generateData(),
      symbolSize: function (val) {
        return val[1] / 500;
      },
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'stroke'
      },
      itemStyle: {
        color: '#f4e925',
        shadowBlur: 10,
        shadowColor: '#333'
      },
      zlevel: 1
    }
  ];

  return series;
}
function initheatchart(): void {
  if (heatMapRef.value) {
    console.log("yes");
    heatMap = echarts.init(heatMapRef.value);
  
    const option: echarts.EChartsOption = {
      // 在这里放置你的图表配置
      backgroundColor: isDark ? "#404a59" : "#000",
      title: {
        top: 30,
        text: "Daily WORD Count in Last Three Months",

        left: "center",
        textStyle: {
          color: isDark.value ? "#fff" : "#409EFF",
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "30",
        left: "100",
        data: ["Steps", "Top 12"],
        textStyle: {
          color: "#fff",
        },
      },
      xAxis: {},
      yAxis: {},
      calendar: [
        {
          top: 100,
          left: "center",
          // range: ["2023-9-01", "2023-11-30"],
          splitLine: {
            show: true,
            lineStyle: {
              color: "#000",
              width: 4,
              type: "solid",
            },
          },
          yearLabel: {
            formatter: "{start}  1st",
            color: "#fff",
          },
          itemStyle: {
            color: "#323c48",
            borderWidth: 1,
            borderColor: "#111",
          },
        },
        {
          top: 340,
          left: "center",
          // range: ["2016-07-01", "2016-12-31"],
          splitLine: {
            show: true,
            lineStyle: {
              color: "#000",
              width: 4,
              type: "solid",
            },
          },
          yearLabel: {
            formatter: "{start}  2nd",
            color: "#fff",
          },
          itemStyle: {
            color: "#323c48",
            borderWidth: 1,
            borderColor: "#111",
          },
        },
        
      ],
      series: generateMockSeries(generateData())  ,// 使用类型断言
      
    };
    heatMap.setOption(option);
  }
}

function initProgress(index: number): void {
  if (heatMapRef[index] != undefined) {
    // dictsToGenerateProgress[index].id;
    progress[index] = echarts.init(progressRef[index]);
    const option: echarts.EChartsOption = {
      // 建表
    };
    progress[index].setOption(option);
  }
}

onMounted(() => {
  initChart();
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

#secondRow {
  flex: 1;
  background-color: #d9ecff;
  border-radius: 20px;
  width: 70vw;
  height: 30vh;
}

.barChart {
  width: 32vw;
  height: 50vh;
}

#heatmap {
  flex: 1;
  width: 32vw;
  height: 50vh;
}

.progress {
  flex: 2;
}
</style>
