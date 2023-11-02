<template>
  <table>
    <thead>
      <tr>
        <th>{{ $t("learn.elapsedTime") }}</th>
        <th>{{ $t("learn.progress") }}</th>
        <th>{{ $t("learn.speed") }}</th>
        <th>{{ $t("learn.accuracy") }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          {{
            stopWatch.hours.value < 10
              ? "0" + stopWatch.hours.value
              : stopWatch.hours.value
          }}:{{
            stopWatch.minutes.value < 10
              ? "0" + stopWatch.minutes.value
              : stopWatch.minutes.value
          }}:{{
            stopWatch.seconds.value < 10
              ? "0" + stopWatch.seconds.value
              : stopWatch.seconds.value
          }}
        </td>
        <td>
          {{
            words
              ? currWordIndex < words.length
                ? currWordIndex + 1
                : currWordIndex
              : 0
          }}
          / {{ words ? words.length : 0 }}
        </td>
        <td>
          {{
            (
              (currWordIndex - skips) /
              (stopWatch.hours.value * 60 +
                stopWatch.minutes.value +
                stopWatch.seconds.value / 60)
            ).toFixed(0)
          }}
          WPM
        </td>
        <td>
          {{
            currWordIndex - skips > tries
              ? "100.00"
              : (((currWordIndex - skips) / tries) * 100).toFixed(2)
          }}
          %
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { WordVo } from "./Dicts/common";
import { ResUseStopwatch } from "vue-timer-hook";

defineProps<{
  stopWatch: ResUseStopwatch;
  words: WordVo[] | null;
  currWordIndex: number;
  tries: number;
  skips: number;
}>();
</script>

<style scoped>
table {
  width: 100%;
}

th,
td {
  padding: 0.5em;
  width: 25%;
}

th {
  border-bottom: 1px solid #ddd;
}

td {
  font-size: 1.5em;
}
</style>
