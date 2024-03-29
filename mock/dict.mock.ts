// SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Mock from "mockjs";
import { defineMock } from "vite-plugin-mock-dev-server";
import { DictVo, WordToReviewVo, WordVo } from "../src/components/Dicts/common";

const dicts: DictVo[] = [
  {
    id: -1,
    language: "English",
    name: "English Test Dict (For Test)",
  },
  {
    id: -2,
    language: "Japanese",
    name: "Japanese Test Dict (For Test)",
  },
].concat(
  Mock.mock({
    "array|20": [
      {
        "id|+1": -25,
        language: "English",
        name: "Random Test Dict @id (Don't click)",
      },
    ],
  }).array,
);

const enWords: WordVo[] = [
  {
    id: 1,
    name: "cancel",
    extension: {
      meanings: ["n. 取消", "v. 取消；撤销；终止；废除"],
      ukphone: "/'kæns(ə)l/",
      usphone: "/ˈkæns(ə)l/",
      notation: "",
    },
  },
  {
    id: 2,
    name: "recline",
    extension: {
      meanings: ["v. 斜倚；斜躺；向后倾"],
      ukphone: "/rɪˈklaɪn/",
      usphone: "/rɪˈklaɪn/",
      notation: "",
    },
  },
  {
    id: 3,
    name: "technologically",
    extension: {
      meanings: ["adv. 技术上地"],
      ukphone: "/ˌteknəˈlɒdʒɪkli/",
      usphone: "/ˌteknəˈlɑːdʒɪkli/",
      notation: "",
    },
  },
  {
    id: 3781,
    name: "unique",
    extension: {
      notation: "",
      ukphone: "ju'niːk",
      usphone: "jʊˈniːk",
      meanings: ["a. 惟一的,独一无二的"],
    },
  },
  {
    id: 3194,
    name: "sickness",
    extension: {
      notation: "",
      ukphone: "'sɪknɪs",
      usphone: "ˈsɪknɪs",
      meanings: ["n. 疾病,（想）呕吐"],
    },
  },
  {
    id: 1515,
    name: "find",
    extension: {
      notation: "",
      ukphone: "faɪnd",
      usphone: "faɪnd",
      meanings: ["(found, found) vt. 找到，发现，感到"],
    },
  },
  {
    id: 3313,
    name: "sound",
    extension: {
      notation: "",
      ukphone: "saʊnd",
      usphone: "saʊnd",
      meanings: ["vi.听起来,发出声音n.声音"],
    },
  },
  {
    id: 2133,
    name: "local",
    extension: {
      notation: "",
      ukphone: "'ləʊk(ə)l",
      usphone: "ˈləʊk(ə)l",
      meanings: ["a. 当地的；地方的"],
    },
  },
  {
    id: 2669,
    name: "plus",
    extension: {
      notation: "",
      ukphone: "plʌs",
      usphone: "plʌs",
      meanings: ["prep.加，加上"],
    },
  },
  {
    id: 320,
    name: "analyze",
    extension: {
      notation: "",
      ukphone: "'ænəlaɪz",
      usphone: "`ænl,aɪz",
      meanings: ["v. 分析"],
    },
  },
  {
    id: 568,
    name: "benefit",
    extension: {
      notation: "",
      ukphone: "'benɪfɪt",
      usphone: "ˈbenɪfɪt",
      meanings: ["n. / v.优势,益处,使…受益"],
    },
  },
  {
    id: 3511,
    name: "systematic",
    extension: {
      notation: "",
      ukphone: "ˌsɪstə'mætɪk",
      usphone: "sɪstəˈmætɪk",
      meanings: ["a.系统的,有条理的"],
    },
  },
  {
    id: 2240,
    name: "method",
    extension: {
      notation: "",
      ukphone: "'meθəd",
      usphone: "ˈmeθəd",
      meanings: ["n. 方法，办法"],
    },
  },
  {
    id: 4002,
    name: "worm",
    extension: {
      notation: "",
      ukphone: "wɜːm",
      usphone: "wɜːm",
      meanings: ["n. 软体虫,蠕虫(尤指蚯蚓)"],
    },
  },
];

const jaWords: WordVo[] = [
  {
    id: 1,
    name: "norikae",
    extension: {
      meanings: ["n. transfer (trains, buses, etc.)"],
      ukphone: "",
      usphone: "",
      notation: "乗(の)り換(か)え",
    },
  },
  {
    id: 2,
    name: "tokushoku",
    extension: {
      meanings: ["n. characteristic, feature"],
      ukphone: "",
      usphone: "",
      notation: "特色(とくしょく)",
    },
  },
  {
    id: 3,
    name: "hazureru",
    extension: {
      meanings: [
        "v. to be disconnected, to get out of place, to be off, to be out",
      ],
      ukphone: "",
      usphone: "",
      notation: "外(はず)れる",
    },
  },
  {
    id: 5,
    // qiketto now can pass, too
    name: "chiketto",
    extension: {
      meanings: ["n. ticket"],
      ukphone: "",
      usphone: "",
      notation: "チケット",
    },
  },
  {
    id: 6,
    // gurahu now can pass, too
    name: "gurafu",
    extension: {
      meanings: ["n. graph"],
      ukphone: "",
      usphone: "",
      notation: "グラフ",
    },
  },
];

const enWordsToReview: WordToReviewVo[] = enWords.map((elem) => {
  return { ...elem, tick: 0 };
});

const jaWordsToReview: WordToReviewVo[] = jaWords.map((elem) => {
  return { ...elem, tick: 0 };
});

export default defineMock([
  {
    url: "/api/dicts",
    method: "GET",
    status: 200,
    enabled: true,
    type: "json",
    body: dicts,
  },
  {
    url: "/api/dicts/:dictId/review/num",
    method: "GET",
    status: 200,
    enabled: true,
    type: "text/plain",
    body: "20",
  },
  {
    url: "/api/dicts/-1/learn",
    method: "GET",
    status: 200,
    enabled: true,
    type: "json",
    body: (request) => {
      return enWords.slice(0, request.query.num);
    },
  },
  {
    url: "/api/dicts/-1/review",
    method: "GET",
    status: 200,
    enabled: true,
    type: "json",
    body: (request) => {
      return enWordsToReview.slice(0, request.query.num);
    },
  },
  {
    url: "/api/dicts/-1/qwerty",
    method: "GET",
    status: 200,
    enabled: true,
    type: "json",
    body: (request) => {
      return enWordsToReview.slice(0, request.query.num);
    },
  },
  {
    url: "/api/dicts/-2/learn",
    method: "GET",
    status: 200,
    enabled: true,
    type: "json",
    body: (request) => {
      return jaWords.slice(0, request.query.num);
    },
  },
  {
    url: "/api/dicts/-2/review",
    method: "GET",
    status: 200,
    enabled: true,
    type: "json",
    body: (request) => {
      return jaWordsToReview.slice(0, request.query.num);
    },
  },
  {
    url: "/api/dicts/-2/qwerty",
    method: "GET",
    status: 200,
    enabled: true,
    type: "json",
    body: (request) => {
      return jaWordsToReview.slice(0, request.query.num);
    },
  },
]);
