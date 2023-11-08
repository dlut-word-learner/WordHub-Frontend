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

export function sortWithIntersection(
  a: DictVo[],
  reference: DictVo[],
): DictVo[] {
  const intersection = a.filter((elem) => reference.includes(elem));
  const rest = a.filter((elem) => !reference.includes(elem));
  intersection.sort((elem1, elem2) => {
    return reference.indexOf(elem1) - reference.indexOf(elem2);
  });
  return intersection.concat(rest);
}
