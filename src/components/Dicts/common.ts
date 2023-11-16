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

/**
 * @param ticks - how many times a word have been learned
 */
export interface WordToReviewVo extends WordVo {
  readonly tick: number;
}

export enum Lang {
  English = "en",
  Japanese = "ja",
}

export enum Rating {
  Hard,
  Good,
  Easy,
}

export const excludeCache = ref("");

// 先展示reference(与dicts的交集，确保词库有效)，再展示dicts中除reference的
export function sortWithIntersection(
  dicts: DictVo[],
  reference: DictVo[],
): DictVo[] {
  const intersection = reference.filter((elem) => includesDict(dicts, elem));
  const rest = dicts.filter((elem) => !includesDict(reference, elem));

  return intersection.concat(rest);
}

export function includesDict(list: DictVo[], dict: DictVo): boolean {
  return list.some(
    (x) =>
      dict.name == x.name && dict.id == x.id && dict.language == x.language,
  );
}

export interface WordReviewPeekVo {
  hard: number;
  good: number;
  easy: number;
}
