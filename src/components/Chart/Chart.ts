/**
 * 返回从过去numDays天到今天每天日期字符串数组
 * @param numDays 倒推多少天
 */
export function getDateStringFromToday(numDays: number): string[] {
  const dateList: string[] = [];
  for (let i = numDays - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dateList.push(date.toISOString().slice(0, 10));
  }
  return dateList;
}

/**
 * 将数组拼接上从过去numDays天到今天每天日期字符串数组
 * 例：假如今天是2023-11-13，前天、昨天、今天分别复习了[1, 3, 2]个单词
 * 则可以返回[ [ '2023-11-11', 1 ], [ '2023-11-12', 3 ], [ '2023-11-13', 2 ] ]
 * @param arr 要转换的数组，时间由远到近
 */
export function concatDate(arr: number[]): [string, number][] {
  const dateList = getDateStringFromToday(arr.length);
  return arr.map((num, index) => [dateList[index], num]);
}

export interface progressVo {
  sum: number;
  studied: number;
  mastered: number;
}
