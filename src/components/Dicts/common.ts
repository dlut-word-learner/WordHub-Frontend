export interface Lang {
  fullName: string;
  abbr: string;
}

export interface DictVo {
  id: number;
  language: string;
  name: string;
}

export interface WordVo {
  id: number;
  name: string;
  extension: {
    meanings: [string];
    ukphone: string;
    usphone: string;
    notation: string;
  };
}

export const langs: Lang[] = [
  { fullName: "all", abbr: "all" },
  { fullName: "English", abbr: "en" },
  { fullName: "Japanese", abbr: "ja" },
];
