import { ref } from "vue";

export interface DictVo {
  readonly id: number;
  readonly language: string;
  readonly name: string;
}

export interface WordVo {
  readonly id: number;
  readonly name: string;
  readonly extension: {
    readonly meanings: string[];
    readonly ukphone: string;
    readonly usphone: string;
    readonly notation: string;
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
