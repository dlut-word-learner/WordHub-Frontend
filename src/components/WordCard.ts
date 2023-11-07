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

export function getHiddenWord(
  word: WordVo,
  input: string,
  lang: Lang,
  isInitialShown?: boolean,
): string {
  switch (lang) {
    case Lang.English:
      if (isInitialShown && word.name.length > 1)
        return (
          word.name[0] +
          input.slice(1) +
          "_ ".repeat(
            input == ""
              ? word.name.length - 1
              : word.name.length - input.length,
          )
        );
      else return input + "_ ".repeat(word.name.length - input.length);

    case Lang.Japanese:
      return isKatakana(word.extension.notation)
        ? toKatakana(input)
        : toHiragana(input) +
            "__".repeat(
              toKana(word.name).length -
                toKana(input)
                  .split("")
                  .filter((x) => isKana(x))
                  .join("").length -
                toKana(input)
                  .split("")
                  .filter((x) => !isKana(x))
                  .join("").length /
                  3,
            );
    default:
      return "";
  }
}
