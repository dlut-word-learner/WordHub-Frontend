<!--
SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div id="options">
    <el-form label-position="left" label-width="50%" size="large">
      <el-form-item :label="$t('options.learnWordsPerRound')">
        <el-input-number
          v-model="optionsStore.learnWordsPerRound"
          :min="5"
          :max="200"
          :step="5"
        />
      </el-form-item>
      <el-form-item :label="$t('options.reviewWordsPerRound')">
        <el-input-number
          v-model="optionsStore.reviewWordsPerRound"
          :min="5"
          :max="200"
          :step="5"
        />
      </el-form-item>
      <el-form-item :label="$t('options.showPrevNext')">
        <el-switch v-model="optionsStore.showPrevNext" />
      </el-form-item>
      <el-divider />
      <el-form-item :label="$t('options.enableSound')">
        <el-switch v-model="optionsStore.isSoundEnabled" />
      </el-form-item>
      <el-form-item :label="$t('options.volume')">
        <el-slider
          v-model="optionsStore.volume"
          :disabled="!optionsStore.isSoundEnabled"
        />
      </el-form-item>
      <el-divider />
      <el-form-item :label="$t('options.lang')">
        <el-select v-model="optionsStore.lang">
          <el-option
            v-for="lang in languages"
            :key="lang.value"
            :label="lang.label"
            :value="lang.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('options.enableAnimation')">
        <el-switch v-model="optionsStore.isAnimationEnabled"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('options.darkMode')">
        <el-switch v-model="isDark"></el-switch>
      </el-form-item>
      <el-divider />
      <div id="qwertyOnly">
        {{ $t("options.qwertyOnly") }}
      </div>
      <el-form-item :label="$t('options.qwertyWordsPerRound')">
        <el-input-number
          v-model="optionsStore.qwertyWordsPerRound"
          :min="5"
          :max="200"
          :step="5"
        />
      </el-form-item>
      <el-form-item :label="$t('options.autoNext')">
        <el-switch v-model="optionsStore.autoNext" />
      </el-form-item>
      <el-form-item :label="$t('options.hideWord')">
        <el-switch v-model="optionsStore.isWordHidden" />
      </el-form-item>
      <el-form-item :label="$t('options.hideMeaning')">
        <el-switch v-model="optionsStore.isMeaningHidden" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useOptionsStore } from "../store/optionsStore";
import { languages } from "../locales/index";
import { isDark } from "../main";

const optionsStore = useOptionsStore();
</script>

<style scoped>
#options {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 2em;
}

#qwertyOnly {
  text-align: left;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 15px;
}
</style>
