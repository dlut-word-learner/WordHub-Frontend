import { ref } from "vue";

export interface DictVo {
  id: number;
  language: string;
  name: string;
}

export interface WordVo {
  id: number;
  name: string;
  extension: {
    meanings: string[];
    ukphone: string;
    usphone: string;
    notation: string;
  };
}

export enum Lang {
  English = "en",
  Japanese = "ja",
}

export const excludeCache = ref("");

export function sortWithIntersection<T>(a: T[], reference: string[]): T[] {
  const intersection = a.filter((elem) => reference.includes(elem["name"]));
  const rest = a.filter((elem) => !reference.includes(elem["name"]));
  intersection.sort((elem1, elem2) => {
    return reference.indexOf(elem1["name"]) - reference.indexOf(elem2["name"]);
  });
  return intersection.concat(rest);
}
