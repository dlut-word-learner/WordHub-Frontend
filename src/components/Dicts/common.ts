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
  const intersection = a.filter((elem) => includesDict(reference, elem));
  const rest = a.filter((elem) => !includesDict(reference, elem));
  intersection.sort((elem1, elem2) => {
    return reference.indexOf(elem1) - reference.indexOf(elem2);
  });
  return intersection.concat(rest);
}

export function includesDict(list: DictVo[], dict: DictVo): boolean {
  return list.some(
    (x) =>
      dict.name == x.name && dict.id == x.id && dict.language == x.language,
  );
}
