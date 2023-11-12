// chart.mock.ts
import { defineMock } from "vite-plugin-mock-dev-server";
import Mock from "mockjs";
import * as echarts from "echarts";

//for bar chart ,generate fake datas.
function getVirtualData(): Array<[string, string]> {
  const data: Array<[string, string]> = [];

  for (let i = 1; i <= 30; i++) {
    const date = `11/${i < 10 ? "0" + i : i}`;
    const randomValue = Math.floor(Math.random() * 10000).toString();
    data.push([date, randomValue]);
  }

  return data;
}
function getheatmapVirtualData() {
  const currentDate = new Date();

  const startMonth = currentDate.getMonth() - 2;
  currentDate.setMonth(startMonth);
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
function getprogressmockdata() {
  const data1: string[] = [
    "苹果",
    "香蕉",
    "橘子",
    "梨子",
    "葡萄",
    "柿子",
    "草莓",
    "蓝莓",
    "柚子",
    "橙子",
  ];
  const data2: number[] = [702, 350, 800, 600, 550, 700, 600, 800, 900, 600];
  const data3: number[] = [80, 40, 60, 10, 80, 50, 70, 80, 90, 60];
  const data4: number[] = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

  return { data1, data2, data3, data4 };
}
export default defineMock([
  {
    url: "/dicts/:dictId/learn/review/qwerty",
    method: "GET",
    status: 200,
    enabled: true,
    type: "json",
    body: (request) => {
      return {
        virtualData: getVirtualData(),
        responseData: getheatmapVirtualData(),
        progressData: getprogressmockdata(),
      };
    },
  },
]);
