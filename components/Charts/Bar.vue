<template>
  <div ref="chart"></div>
</template>

<script lang="ts" setup>
  import * as d3 from 'd3';
  const props = defineProps({
    data: {
      type: Array as PropType<{
        key: string
        value?: number
      }[]>,
      default: [],
    },
    colors: {
      type: Array as PropType<string[]>
    },
    maxWidth: {
      type: Number,
      default: 400,
    },
    maxHeight: {
      type: Number,
      default: 600,
    }
  })

  const chart = ref(null);

  const width  = ref(props.maxWidth),
        height = ref(props.maxHeight);

  onMounted(() => {
    props.data.sort((a, b) => (a.value as number) - (b.value as number));
    
    const svg = d3
      .select(chart.value)
      .append('svg')
      .attr('width', width.value)
      .attr('height', height.value)
      .append('g')

    const x = d3.scaleBand()
      .domain(props.data.map(d => d.key))
      .range([0, width.value])
      .padding(0.1);

    const y = d3.scaleLinear()
      // @ts-ignore
      .domain([0, d3.max(props.data as [], d => d.value)])
      .range([height.value, 0]);

    const color = d3.scaleOrdinal()
      .domain(props.data.map(d => d.key))
      .range(props.colors as string[]);

    svg.selectAll('rect')
      .data(props.data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.key) as number)
      .attr('y', d => y(d.value as number))
      .attr('width', x.bandwidth())
      .attr('height', d => height.value - y(d.value as number))
      .attr('fill', d => color(d.key) as string);
  });

</script>

<style lang="postcss" scoped></style>
