import { createPinia, setActivePinia } from "pinia";
import { expect, describe, it, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { Lang } from "../src/components/Dicts/common";
import WordCardVue from "../src/components/WordCard.vue";

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
  beforeEach(()=>{
    setActivePinia(createPinia());
  })
  
  it('should emit "done" when input "nan"', async () => {
    const props = {
      ...testProps,
      word: { ...testProps.word, name: "nan" },
      userInput: "na",
    };

    const wrapper = mount(WordCardVue, {
      props: props,
    });

    await wrapper.setProps({ ...props, userInput: "nan" });
    expect(wrapper.emitted("done")).toBeTruthy();
  });

  it('should not emit "done" when input "na"', async () => {
    const props = {
      ...testProps,
      word: { ...testProps.word, name: "nan" },
      userInput: "n",
    };

    const wrapper = mount(WordCardVue, {
      props: props,
    });

    await wrapper.setProps({ ...props, userInput: "na" });
    expect(wrapper.emitted("done")).toBeFalsy();
  });
});

describe("Japanese spell check: なな", () => {
  beforeEach(()=>{
    setActivePinia(createPinia());
  })
  it('should emit "done" when input "nana"', async () => {
    const props = {
      ...testProps,
      word: { ...testProps.word, name: "nana" },
      userInput: "nan",
    };

    const wrapper = mount(WordCardVue, {
      props: props,
    });

    await wrapper.setProps({ ...props, userInput: "nana" });
    expect(wrapper.emitted("done")).toBeTruthy();
  });

  it('should not emit "done" when input "nan"', async () => {
    const props = {
      ...testProps,
      word: { ...testProps.word, name: "nana" },
      userInput: "na",
    };

    const wrapper = mount(WordCardVue, {
      props: props,
    });

    await wrapper.setProps({ ...props, userInput: "nan" });
    expect(wrapper.emitted("done")).toBeFalsy();
  });
});
