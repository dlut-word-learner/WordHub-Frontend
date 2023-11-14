import { expect, describe, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import WordCardVue from "../src/components/WordCard.vue";
import { Lang } from "../src/components/Dicts/common";

const testProps = {
  word: {
    id: 1,
    name: "",
    extension: {
      meanings: [],
      ukphone: "",
      usphone: "",
      notation: "",
    },
  },
  lang: Lang.Japanese,
  userInput: "",
};
describe("Japanese spell check: なん", () => {
  it('should emit "done" when input "nan"', async () => {
    const wrapper = shallowMount(WordCardVue, {
      props: {
        ...testProps,
        word: { ...testProps.word, name: "nan" },
        userInput: "na",
      },
    });

    await wrapper.setProps({ userInput: "nan", lang: Lang.Japanese });
    expect(wrapper.emitted("done")).toBeTruthy();
  });
  it('should not emit "done" when input "na"', async () => {
    const wrapper = shallowMount(WordCardVue, {
      props: {
        ...testProps,
        word: { ...testProps.word, name: "nan" },
        userInput: "n",
      },
    });
    await wrapper.setProps({ userInput: "na", lang: Lang.Japanese });
    expect(wrapper.emitted("done")).toBeFalsy();
  });
});

describe("Japanese spell check: なな", () => {
  it('should emit "done" when input "nana"', async () => {
    const wrapper = shallowMount(WordCardVue, {
      props: {
        ...testProps,
        word: { ...testProps.word, name: "nana" },
        userInput: "nan",
      },
    });
    await wrapper.setProps({ userInput: "nana", lang: Lang.Japanese });
    expect(wrapper.emitted("done")).toBeTruthy();
  });
  it('should not emit "done" when input "nan"', async () => {
    const wrapper = shallowMount(WordCardVue, {
      props: {
        ...testProps,
        word: { ...testProps.word, name: "nana" },
        userInput: "na",
      },
    });
    await wrapper.setProps({ userInput: "nan", lang: Lang.Japanese });
    expect(wrapper.emitted("done")).toBeFalsy();
  });
});
