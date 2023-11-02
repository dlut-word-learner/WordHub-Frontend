import { defineMock } from "vite-plugin-mock-dev-server";
import { DictVo } from "../src/components/Dicts/common";
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

export default defineMock([
  {
    url: "/api/dicts",
    method: "GET",
    status: 200,
    enabled: true,
    type: "json",
    body: dicts,
  },
]);
