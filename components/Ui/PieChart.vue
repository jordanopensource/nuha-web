<template>
  <ClientOnly>
    <Responsive class="w-full lg:w-2/3 my-8">
      <template #main="{ width }">
        <div class="block lg:hidden">
          <Chart
            direction="circular"
            :size="{ width, height: 200 }"
            :data="props.chartData"
            :margin="{
              left: Math.round((width - 250) / 2),
              top: 50,
              right: 0,
              bottom: 40,
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
        </div>

        <div class="hidden lg:block">
          <Chart
            direction="circular"
            :size="{ width, height: 500 }"
            :data="props.chartData"
            :margin="{
              left: Math.round((width - 550) / 2),
              top: 50,
              right: 0,
              bottom: 40,
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
