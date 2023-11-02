import { defineMock } from "vite-plugin-mock-dev-server";
import { DictVo, WordVo } from "../src/components/Dicts/common";

const dicts: DictVo[] = [
  {
    id: 1,
    language: "English",
    name: "English Test Dict",
  },
  {
    id: 2,
    language: "Japanese",
    name: "Japanese Test Dict",
  },
];

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
    name: "explosive",
    extension: {
      meanings: ["adj. 易爆炸的；易爆发的", "n. 炸药；爆炸物"],
      ukphone: "/ɪkˈspləʊsɪv/",
      usphone: "/ɪkˈsploʊsɪv/",
      notation: "",
    },
  },
];

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
    url: "/api/dicts/1/learn",
    method: "GET",
    status: 200,
    enabled: true,
    type: "json",
    body: enWords,
  },
]);
