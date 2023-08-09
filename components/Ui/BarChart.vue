<template>
  <!-- TODO: generalize this component to be used with any data -->
  <ClientOnly>
    <Chart
      :size="{ width: 350, height: 500 }"
      :data="props.chartData"
      :margin="margin"
      :direction="direction"
      :axis="axis"
    >
      <template #layers>
        <Grid strokeDasharray="2,2" />
        <Bar :dataKeys="['name', 'count']" :barStyle="{ fill: '#8e0152' }" />
      </template>

      <template #widgets>
        <Tooltip
          borderColor="#f1b6da"
          :config="{
            count: { color: '#90e0ef' },
          }"
        />
      </template>
    </Chart>
  </ClientOnly>
</template>

<script setup lang="ts">
  import { Chart, Grid, Line, Bar, Tooltip, Marker } from 'vue3-charts'

  const props = defineProps({
    chartData: {
      type: Array<{
        name: String
        value: Number
      }>,
      required: true,
    },
  })

  const direction = ref('horizontal')
  const margin = ref({
    left: 0,
    top: 20,
    right: 20,
    bottom: 0,
  })

  const axis = ref({
    primary: {
      type: 'band',
    },
    secondary: {
      domain: ['dataMin', 'dataMax + 5'],
      type: 'linear',
      ticks: 8,
    },
  })
</script>
