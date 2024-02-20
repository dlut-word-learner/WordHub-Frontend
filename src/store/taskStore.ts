// SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { defineStore } from "pinia";
import { ref, watch } from "vue";

export enum Task {
  Learn,
  Review,
  QwertyMode,
  None,
}

export const useTaskStore = defineStore(
  "task",
  () => {
    const type = ref(Task.None);
    const url = ref("");
    watch(type, (newType) => {
      if (newType == Task.None) url.value = "";
    });
    return {
      type,
      url,
    };
  },
  // {
  //   persist: true,
  // },
);
