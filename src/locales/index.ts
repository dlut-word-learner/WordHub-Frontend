import { createI18n } from "vue-i18n";
import messages from "./lang/index";
export const languages = [
  { value: "zh-CN", label: "简体中文" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
];

export const i18n = createI18n({
  legacy: false,
  locale: "zh-CN",
  fallbackLocale: "en",
  messages,
});
