// SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { defineStore } from "pinia";
import { ref } from "vue";
import { DictVo, includesDict } from "../components/Dicts/common";
import axios from "axios";
import { useUserStore } from "./userStore";

export const useHistoryStore = defineStore("history", () => {
  const recentlyUsedDicts = ref<DictVo[]>([]);

  const isRecentlyUsed = (dict: DictVo): boolean => {
    return includesDict(recentlyUsedDicts.value, dict);
  };

  const updateRecentlyUsedDicts = (): void => {
    if (useUserStore().userVo) {
      axios.get("/api/dicts/recently-used").then((res) => {
        recentlyUsedDicts.value = res.data;
      });
    }
  };
  return {
    recentlyUsedDicts,
    isRecentlyUsed,
    updateRecentlyUsedDicts,
  };
});
