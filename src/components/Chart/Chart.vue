<template>
  <el-container direction="vertical" class="statisticsContainer">
    <el-main id="charts">
      <el-row>
        <el-col v-for="task in tasks" :span="8"
          ><div class="chart" :ref="(ele) => (heatchartRef[task] = ele)"></div
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
import { isDark } from "../../main";

const historyStore = useHistoryStore();
const dictsToGenerateProgress: DictVo[] = historyStore.recentlyUsedDicts.slice(
  0,
  4,
);
const tasks = [Task.Learn, Task.Review, Task.QwertyMode];

// 图表div元素绑定
const heatchartRef = reactive(new Map<Task, HTMLElement>());
const progressRef = reactive<HTMLElement[]>([]);

// 实际ECharts图表
let heatcharts = new Map<Task, echarts.ECharts>();
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
  initheatchart(Task.Learn);
  initheatchart(Task.Review);
  initheatchart(Task.QwertyMode);
};
function getVirtualData(year) {
  const date = +echarts.time.parse(year + '-09-01');
  const end = +echarts.time.parse(+year + 1 + '-11-31');
  const dayTime = 3600 * 24 * 1000;
  const data = [];
  for (let time = date; time < end; time += dayTime) {
    data.push([
      echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
      Math.floor(Math.random() * 10000)
    ]);
  }
  return data;
}
const data = getVirtualData('2023');
function initheatchart(task: Task): void {
  console.log(task + ": " + heatchartRef.has(task));
  console.log(heatchartRef[task]);
  if (heatchartRef[task] != undefined) {
    console.log("yes");
    heatcharts[task] = echarts.init(heatchartRef[task]);
    const option: echarts.EChartsOption = {
      // 在这里放置你的图表配置
      backgroundColor: '#404a59',
  title: {
    top: 30,
    text: 'Daily WORD Count in 2016',
   
    left: 'center',
    textStyle: {
      color: isDark.value?'#fff':'#409EFF'
    }
  },
      tooltip: {
        trigger: "item",
    
 

      },
      legend: {
    top: '30',
    left: '100',
    data: ['Steps', 'Top 12'],
    textStyle: {
      color: '#fff'
    }
  },
      xAxis: {},
      yAxis: {},
      calendar: [
    {
      top: 100,
      left: 'center',
      range: ['2023-9-01', '2023-11-30'],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#000',
          width: 4,
          type: 'solid'
        }
      },
      yearLabel: {
        formatter: '{start}  1st',
        color: '#fff'
      },
      itemStyle: {
        color: '#323c48',
        borderWidth: 1,
        borderColor: '#111'
      }
    },
    {
      top: 340,
      left: 'center',
      range: ['2016-07-01', '2016-12-31'],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#000',
          width: 4,
          type: 'solid'
        }
      },
      yearLabel: {
        formatter: '{start}  2nd',
        color: '#fff'
      },
      itemStyle: {
        color: '#323c48',
        borderWidth: 1,
        borderColor: '#111'
      }
    }
  ],
  series: [
    {
      name: 'Steps',
      type: 'scatter',
      coordinateSystem: 'calendar',
      data: data,
      symbolSize: function (val) {
        return val[1] / 500;
      },
      itemStyle: {
        color: '#409EFF'
      }
    },
    {
      name: 'Steps',
      type: 'scatter',
      coordinateSystem: 'calendar',
      calendarIndex: 1,
      data: data,
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
      calendarIndex: 1,
      data: data
        .sort(function (a, b) {
          return b[1] - a[1];
        })
        .slice(0, 12),
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
    },
    {
      name: 'Top 12',
      type: 'effectScatter',
      coordinateSystem: 'calendar',
      data: data
        .sort(function (a, b) {
          return b[1] - a[1];
        })
        .slice(0, 12),
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
  ]
    };
    heatcharts[task].setOption(option);
  }
}

function initProgress(index: number): void {
  if (heatchartRef[index] != undefined) {
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
