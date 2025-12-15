<script setup lang="ts">
  import { Pie } from 'vue-chartjs'
  import type { ChartData, ChartOptions } from 'chart.js'

  defineProps<{
    chartData: ChartData<'pie'>
    options?: ChartOptions<'pie'>
  }>()
</script>

<template>
  <Pie :data="chartData" :options="options" />
</template>
