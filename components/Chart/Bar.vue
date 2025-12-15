<script setup lang="ts">
  import { Bar } from 'vue-chartjs'
  import type { ChartData, ChartOptions } from 'chart.js'

  defineProps<{
    chartData: ChartData<'bar'>
    options?: ChartOptions<'bar'>
  }>()
</script>

<template>
  <Bar :data="chartData" :options="options"> Chart couldn't be loaded. </Bar>
</template>
