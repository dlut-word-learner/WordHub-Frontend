<template>
  <div ref="chartContainer" style="width: auto; height: auto"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import axios from "axios";

const chartContainer = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

const initChart = () => {
  if (chartContainer.value) {
    myChart = echarts.init(chartContainer.value);
    const option: echarts.EChartsOption = {
      // 在这里放置你的图表配置
      xAxis: {},
      yAxis: {},
      series: [
        {
          type: "line",
          smooth: true,
          data: [30, 40, 20, 50, 40, 80, 90],
        },
      ],
    };
    myChart.setOption(option);
  }
};

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
</style>
