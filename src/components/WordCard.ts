import { WordVo } from "./Dicts/common";
import { useDictStore } from "../store/dictStore";
import { useOptionsStore } from "../store/optionsStore";
import { Ref, ref } from "vue";

const dictStore = useDictStore();
const optionsStore = useOptionsStore();

export const currWordSound: Ref<Howl | null> = ref(null);

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
      return word.extension.notation.replace(/\([^)]*\)/, "");
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
      return word.extension.notation.match(/\([^)]*\)/)?.[0];
    default:
      return "";
  }
}

export function playWordSound() {
  if (optionsStore.isSoundEnabled) currWordSound.value?.play();
}
