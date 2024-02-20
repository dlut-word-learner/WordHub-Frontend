// SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// chart.mock.ts
import { defineMock } from "vite-plugin-mock-dev-server";
import { Task } from "../src/store/taskStore";
import { progressVo } from "../src/components/Chart/Chart";

//for bar chart ,generate fake datas.
function getBarChartMockData(_userId: number, _task: Task): number[] {
  const data: number[] = [];

  for (let i = 1; i <= 30; i++) {
    const randomValue = Math.floor(Math.random() * 100);
    data.push(randomValue);
  }

  return data;
}

/**
 * 获取过去duration天学习记录的Mock
 * @param duration
 */
function getheatmapVirtualData(_userId: number, duration: number): number[] {
  let data: number[] = [];
  for (let time = 0; time < duration; time++) {
    data.push(Math.floor(Math.random() * 50));
  }
  return data;
}

/**
 * 获取某个词典的进度Mock
 * @param dictId
 */
function getProgressMockData(_dictId: number): progressVo {
  const sum = Math.floor(
    2500 + Math.random() * (Math.random() > 0.5 ? -1 : 1) * 2000,
  );
  const studied = Math.floor(Math.random() * sum);
  const mastered = Math.floor(Math.random() * studied);
  return { sum, studied, mastered };
}

export default defineMock([
  {
    url: "/api/users/:userId/study-rec/:task",
    method: "GET",
    status: 200,
    enabled: true,
    type: "json",
    body: (request) => {
      const userId = request.params.userId as number;
      const task = request.params.task as Task;
      return getBarChartMockData(userId, task);
    },
  },
  {
    url: "/api/dicts/:dictId/progress",
    method: "GET",
    status: 200,
    enabled: true,
    type: "json",
    body: (request) => {
      const id = request.params.dictId as number;
      return getProgressMockData(id);
    },
  },
  {
    url: "/api/users/:userId/study-rec",
    method: "GET",
    status: 200,
    enabled: true,
    type: "json",
    body: (request) => {
      const userId = request.params.userId as number;
      const duration = request.query.duration as number;
      return getheatmapVirtualData(userId, duration);
    },
  },
]);
