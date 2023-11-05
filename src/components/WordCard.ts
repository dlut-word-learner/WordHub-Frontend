import { Lang, WordVo } from "./Dicts/common";
import { isKana, isKatakana, toHiragana, toKatakana, toKana } from "wanakana";

/**
 * Get the main name of the word.
 * English: return name
 * Japanese: return notation excluding text in parentheses
 */
export function getWordMain(word: WordVo | null, lang: Lang): string {
  if (!word) return "";

  switch (lang) {
    case Lang.English:
      return word.name;
    case Lang.Japanese:
      return word.extension.notation.replace(/\([^)]*\)/g, "");
    default:
      return "";
  }
}

/**
 * Get the pronunciation of the word.
 * English: return usphone (AmE) & ukphone (BrE)
 * Japanese: return text in parentheses in notation
 */
export function getWordPhone(
  word: WordVo | null,
  lang: Lang,
): string | undefined {
  if (!word) return "";

  switch (lang) {
    case Lang.English:
      return `AmE: ${word.extension.usphone} BrE: ${word.extension.ukphone}`;
    case Lang.Japanese:
      return isKana(word.extension.notation) ? "" : toKana(word.name);
    default:
      return "";
  }
}

export function getHiddenWord(word: WordVo, input: string, lang: Lang): string {
  switch (lang) {
    case Lang.English:
      return input + "_ ".repeat(word.name.length - input.length);
    case Lang.Japanese:
      return isKatakana(word.extension.notation)
        ? toKatakana(input)
        : toHiragana(input) +
            "__".repeat(toKana(word.name).length - toKana(input).length);
    default:
      return "";
  }
}
