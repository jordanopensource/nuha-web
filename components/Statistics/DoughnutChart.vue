<template>
  <Doughnut :class="props.class" :data="data" :options="options" />
</template>

<script setup lang="ts">
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
  import { Doughnut } from 'vue-chartjs'
  ChartJS.register(ArcElement, Tooltip, Legend)

  const props = defineProps({
    speechData: {
      type: Array<{ speech: String; percentage: Number }>,
    },
    class: {
      type: String,
    },
  })

  const data = {
    labels: props.speechData.map((s) => s.speech as string),
    datasets: [
      {
        backgroundColor: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da'],
        data: props.speechData.map((s) => s.percentage as number),
        borderRadius: 10,
        spacing: 5,
        hoverOffset: 4,
        rotation: 120,
      },
    ],
  }

  const options = {
    responsive: false,
    maintainAspectRatio: true,
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: false,
      },
    },
  }
</script>
