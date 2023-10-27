<template>
  <div id="options">
    <el-form label-position="left" label-width="50%">
      <el-form-item :label="$t('options.autoNext')">
        <el-switch v-model="optionsStore.autoNext" />
      </el-form-item>
      <el-form-item :label="$t('options.showPrevNext')">
        <el-switch v-model="optionsStore.showPrevNext" />
      </el-form-item>
      <el-form-item :label="$t('options.hideWord')">
        <el-switch v-model="optionsStore.isWordHidden" />
      </el-form-item>
      <el-form-item :label="$t('options.hideMeaning')">
        <el-switch v-model="optionsStore.isMeaningHidden" />
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
      <el-form-item :label="$t('options.darkMode')">
        <el-switch v-model="isDark"></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useOptionsStore } from "../store/optionsStore";
import { languages } from "../lang/list";
import { isDark } from "../main";

const optionsStore = useOptionsStore();
</script>

<style scoped>
#options {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 2em;
}
</style>
