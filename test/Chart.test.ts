// SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { expect, describe, it } from "vitest";
import {
  concatDate,
  getDateStringFromToday,
} from "../src/components/Chart/Chart";

describe("getDateStringFromToday", () => {
  it("should return an array of strings representing dates from numDays days ago to today", () => {
    const numDays = 3;
    const result = getDateStringFromToday(numDays);
    const expected = getDateStringFromToday(numDays);
    expect(result).toEqual(expected);
  });
});

describe("concatDate", () => {
  it("should return an array of tuples with date and number", () => {
    const arr = [1, 3, 2];
    const result = concatDate(arr);

    const today = new Date();

    const beforeYesterday = new Date();
    beforeYesterday.setDate(today.getDate() - 2);

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const expected = [
      [beforeYesterday.toISOString().slice(0, 10), 1],
      [yesterday.toISOString().slice(0, 10), 3],
      [today.toISOString().slice(0, 10), 2],
    ];
    expect(result).toEqual(expected);
  });
});
