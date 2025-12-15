<script setup lang="ts">
  import { Doughnut } from 'vue-chartjs'
  import type { ChartData, ChartOptions } from 'chart.js'

  defineProps<{
    chartData: ChartData<'doughnut'>
    options?: ChartOptions<'doughnut'>
  }>()
</script>

<template>
  <Doughnut :data="chartData" :options="options" />
</template>
