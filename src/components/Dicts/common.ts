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
