import { WordVo } from "./Dicts/common";
import { useDictStore } from "../store/dictStore";
import { useOptionsStore } from "../store/optionsStore";
import { Ref, ref } from "vue";
import { isKana, isKatakana, toHiragana, toKatakana, toKana } from "wanakana";

const dictStore = useDictStore();
const optionsStore = useOptionsStore();

/**
 * Get the main name of the word.
 * English: return name
 * Japanese: return notation excluding text in parentheses
 */
export function getWordMain(word: WordVo | null): string {
  if (!word) return "";

  switch (dictStore.lang) {
    case "en":
      return word.name;
    case "ja":
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
export function getWordPhone(word: WordVo | null): string | undefined {
  if (!word) return "";

  switch (dictStore.lang) {
    case "en":
      return `AmE: ${word.extension.usphone} BrE: ${word.extension.ukphone}`;
    case "ja":
      return isKana(word.extension.notation) ? "" : toKana(word.name);
    default:
      return "";
  }
}

export function getHiddenWord(word: WordVo, input: string): string {
  switch (dictStore.lang) {
    case "en":
      return input + "_ ".repeat(word.name.length - input.length);
    case "ja":
      return isKatakana(word.extension.notation)
        ? toKatakana(input)
        : toHiragana(input) +
            "__".repeat(toKana(word.name).length - toKana(input).length);
    default:
      return "";
  }
}
