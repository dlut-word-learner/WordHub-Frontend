export interface Lang {
  fullName: string;
  abbr: string;
}

export interface DictVo {
  dictId: number;
  lang: string;
  dictName: string;
}

export interface WordVo {
  wordId: number;
  wordName: string;
  extension: {
    meanings: [string];
    ukPhone: string;
    usPhone: string;
    notation: string;
  };
}

export const langs: Lang[] = [
  { fullName: "all", abbr: "all" },
  { fullName: "English", abbr: "en" },
  { fullName: "Japanese", abbr: "ja" },
];
