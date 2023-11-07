<template>
  <table>
    <thead>
      <tr>
        <th>{{ $t("stats.elapsedTime") }}</th>
        <th>{{ $t("stats.progress") }}</th>
        <th>{{ $t("stats.speed") }}</th>
        <th>{{ $t("stats.accuracy") }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          {{
            stopwatch.hours.value < 10
              ? "0" + stopwatch.hours.value
              : stopwatch.hours.value
          }}:{{
            stopwatch.minutes.value < 10
              ? "0" + stopwatch.minutes.value
              : stopwatch.minutes.value
          }}:{{
            stopwatch.seconds.value < 10
              ? "0" + stopwatch.seconds.value
              : stopwatch.seconds.value
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
              (stopwatch.hours.value * 60 +
                stopwatch.minutes.value +
                stopwatch.seconds.value / 60)
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
  stopwatch: ResUseStopwatch;
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
