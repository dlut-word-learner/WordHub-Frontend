<template>
  <el-container direction="vertical" class="statisticsContainer">
    <el-main id="charts">
      <el-row>
        <el-col v-for="task in tasks" :span="8"
          ><div class="chart" :ref="(ele) => (barChartRef[task] = ele)"></div
        ></el-col>
      </el-row>
    </el-main>
    <el-main id="progress">
      <div v-for="(_dict, index) in dictsToGenerateProgress">
        <div :ref="(ele) => (progressRef[index] = ele as HTMLElement)"></div>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import * as echarts from "echarts";
import axios from "axios";
import { useHistoryStore } from "../../store/historyStore";
import { Task } from "../../store/taskStore";
import { DictVo } from "../Dicts/common";

const historyStore = useHistoryStore();
const dictsToGenerateProgress: DictVo[] = historyStore.recentlyUsedDicts.slice(0,4);
const tasks = [Task.Learn, Task.Review, Task.QwertyMode];

// 图表div元素绑定
const barChartRef = reactive(new Map<Task, HTMLElement>());
const progressRef = reactive<HTMLElement[]>([]);

// 实际ECharts图表
let barCharts = new Map<Task, echarts.ECharts>();
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
  initBarChart(Task.Learn);
  initBarChart(Task.Review);
  initBarChart(Task.QwertyMode);
};

function initBarChart(task: Task): void{
  console.log(task + ": " + barChartRef.has(task));
  console.log(barChartRef[task]);
  if (barChartRef[task] != undefined) {
    console.log("yes");
    barCharts[task] = echarts.init(barChartRef[task]);
    const option: echarts.EChartsOption = {
      // 在这里放置你的图表配置
      title: {
        text: "Referer of a Website",
        subtext: "Fake Data",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      xAxis: {},
      yAxis: {},
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "50%",
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    barCharts[task].setOption(option);
  }
}

function initProgress(index: number): void{
  if (barChartRef[index] != undefined) {
    // dictsToGenerateProgress[index].id;
    progress[index] = echarts.init(progressRef[index]);
    const option:echarts.EChartsOption = {
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

#charts {
  flex: 1;
}

#progress {
  flex: 1;
  background-color: #d9ecff;
  border-radius: 20px;
  width: 70vw;
  height: 30vh;
}

.chart {
  width: 32vw;
  height: 50vh;
}
</style>
