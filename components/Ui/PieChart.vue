<template>
  <ClientOnly>
    <div class="flex justify-center w-full">
      <Chart
        direction="circular"
        :size="{ width, height: width }"
        :data="props.chartData"
        :margin="{
          left: 20,
          top: 20,
          right: 20,
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
              key: { label: $t('statistical.tooltip.type') },
              value: { label: $t('statistical.tooltip.percentage') },
            }"
          />
        </template>
      </Chart>
    </div>
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
    width: {
      type: Number,
      default: 500,
    },
  })

  const chartOptions = ref({
    pieStyle: {
      colors: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da'],
      innerRadius: 95,
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
<style scoped lang="postcss"></style>
