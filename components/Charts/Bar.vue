<template>
  <div class="h-full w-full mb-10">
    <div ref="chart" class="chart-container">
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
    maxWidth: {
      type: Number,
      default: 400,
    },
    maxHeight: {
      type: Number,
      default: 600,
    },
    showLegend: {
      type: Boolean,
      default: false,
    },
  })

  const chart = ref(null);

  const width  = ref(props.maxWidth),
        height = ref(props.maxHeight);

  onMounted(() => {
    props.data.sort((a, b) => (a.value as number) - (b.value as number));
    
    const svg = d3
      .select(chart.value)
      .append('svg')
      .attr('width', width.value + 40)
      .attr('height', height.value + 20)
      .append('g')

    const x = d3.scaleBand()
      .domain(props.data.map(d => d.key))
      .range([20, width.value + 40])
      .padding(0.3);

    const y = d3.scaleLinear()
      // @ts-ignore
      .domain([0, d3.max(props.data as [], d => d.value)])
      .range([height.value, 20]);

    svg.selectAll('rect')
      .data(props.data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.key) as number)
      .attr('y', d => y(d.value as number))
      .attr('width', x.bandwidth())
      .attr('height', d => height.value - y(d.value as number))
      .attr('fill', d => d.color as string)
      .attr("transform", `translate(0, -${10})`)
      
      const xAxis = svg.append("g")
        .attr("transform", `translate(0, ${height.value - 10})`)
        .call(d3.axisBottom(x));
      xAxis.select('path').attr('stroke', '#ffffff00');
      xAxis.selectAll('line').attr('stroke', '#ffffff00');
      xAxis.selectAll('text').attr("transform", `rotate(-20) translate(-12, -2)`);

      const yAxis = svg.append("g")
        .attr("transform", `translate(20, -10)`)
        .call(d3.axisLeft(y));
      yAxis.select('path').attr('stroke', '#ffffff00');
      yAxis.selectAll('line').attr('stroke', '#ffffff00');
  });

</script>

<style lang="postcss" scoped>
  .chart-container {
    @apply flex flex-row-reverse justify-center items-center gap-8 max-sm:flex-col-reverse;
    @apply p-8 border-y-2 h-full border-nuha-grey-100 border-opacity-50;
  }
</style>
