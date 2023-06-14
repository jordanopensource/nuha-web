<template>
  <ClientOnly>
    <Responsive class="w-3/6">
      <template #main="{ width }">
        <Chart
          direction="circular"
          :size="{ width, height: 320 }"
          :data="props.chartData"
          :margin="{
            left: Math.round((width - 300) / 2),
            top: 20,
            right: 0,
            bottom: 20,
          }"
          :axis="chartOptions.axis"
          :config="{ controlHover: false }"
        >
          <template #layers>
            <Pie
              :dataKeys="['key', 'value']"
              :pie-style="chartOptions.pieStyle"
            />
          </template>
          <template #widgets>
            <Tooltip
              :config="{
                key: { label: 'Type' },
                value: { label: '%' },
              }"
            />
          </template>
        </Chart>
      </template>
    </Responsive>
  </ClientOnly>
</template>
<script setup lang="ts">
  import { Chart, Responsive, Pie, Tooltip } from 'vue3-charts'

  const props = defineProps({
    chartData: {
      type: Array<{
        key: String
        value: Number
      }>,
      default: [],
    },
    class: {
      type: String,
    },
  })

  const chartOptions = ref({
    pieStyle: {
      colors: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da'],
      innerRadius: 100,
      padAngle: 0.025,
      cornerRadius: 13,
    },
    axis: {
      primary: {
        hide: true,
      },
      secondary: {
        ticks: 4,
        hide: true,
      },
    },
  })
</script>
<style scoped lang="postcss">
  .chart g.axis {
    @apply hidden;
  }
</style>
