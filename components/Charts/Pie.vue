<template>
  <div class="h-full w-full mb-10">
    <div class="chart-container">
      <div ref="chart"></div>
      <ChartsLegend v-if="showLegend" :data="data" />
    </div>
    <slot name="caption" />
  </div>
</template>

<script lang="ts" setup>
  import * as d3 from 'd3';
  const props = defineProps({
    data: {
      type: Array as PropType<{
        key: string
        value?: number
        color?: string
      }[]>,
      default: [],
    },
    size: {
      type: Number,
      default: 500,
    },
    showLegend: {
      type: Boolean,
      default: false,
    },
  })

  const chart = ref(null);

  const width  = ref(props.size),
        height = ref(props.size);
  const radius = ref(Math.min(width.value, height.value) / 2);
  const innerRadius = ref(radius.value / 2)

  onMounted(() => {
    props.data.sort((a, b) => (a.value as number) - (b.value as number));
    const svg = d3
      .select(chart.value)
      .append('svg')
      .attr('width', width.value)
      .attr('height', height.value)
      .append('g')
      .attr('transform', `translate(${width.value / 2}, ${height.value / 2})`);

    const pie = d3
      .pie()
      // @ts-ignore
      .value((d) => d.value)

    const arc = d3
      .arc()
      .innerRadius(innerRadius.value)
      .outerRadius(radius.value);

    const path = svg
      .selectAll('path')
      .data(pie(props.data as []))
      .enter()
      .append('path')
      // @ts-ignore
      .attr('d', arc)
      // @ts-ignore
      .attr('fill', d => d.data.color)
  });

</script>

<style lang="postcss" scoped>
  .chart-container {
    @apply flex flex-row justify-center items-center gap-8 max-sm:flex-col;
    @apply lg:p-8 h-full border-y-2 border-nuha-grey-100 border-opacity-50;
  }
</style>
