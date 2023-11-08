<template>
  <el-container>
    <el-main id="charts">
      <div
        v-for="task in tasks"
        :ref="(ele) => (barChartRef[task] = ele)"
        class="chart"
      ></div>
    </el-main>
    <el-main id="progess">
      <div v-for="(_dict, index) in historyStore.recentlyUsedDicts.slice(10)">
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

const tasks = [Task.Learn, Task.Review, Task.QwertyMode];
// 图表div元素绑定
const barChartRef = reactive(new Map<Task, HTMLElement>());
const progressRef = reactive<HTMLElement[]>([]);

// 实际ECharts图表
let barCharts = new Map<Task, echarts.ECharts>();
let progress: echarts.ECharts[] = [];

const historyStore = useHistoryStore();

const initChart = () => {
  if (progressRef) {
    for (let i = 0; i < 10; i++) {
      if (progressRef[i] != undefined) {
        console.debug("recentlyUsed: " + i);
        progress.push(echarts.init(progressRef[i]));
      } else break;
    }
  }
  initBarChart(Task.Learn);
  initBarChart(Task.Review);
  initBarChart(Task.QwertyMode);
};

function initBarChart(task: Task) {
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

onMounted(() => {
  initChart();
});

// 通过ref获取信息的示例
const fetchData = async () => {
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
.charts {
  flex: 1;
}

.progress {
  flex: 1;
}

.chart {
  height: 300px;
  width: 500px;
}
</style>
