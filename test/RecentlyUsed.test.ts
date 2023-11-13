import { expect, describe, it } from "vitest";
import { DictVo, Lang, includesDict } from "../src/components/Dicts/common";

const N3: DictVo = { id: 1, language: Lang.Japanese, name: "N3" };
const CET6: DictVo = { id: 2, language: Lang.English, name: "CET-6" };
const CET4: DictVo = { id: 3, language: Lang.English, name: "CET-4" };
describe("sort with intersection", () => {
  const dicts: DictVo[] = [CET6, N3];
  it("should be unshifted", () => {
    expect(includesDict(dicts, N3)).toBeTruthy();
    expect(includesDict(dicts, CET6)).toBeTruthy();
    expect(includesDict(dicts, CET4)).toBeFalsy();
  });
});
