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
    size: {
      type: Number,
      default: 500,
    },
  })

  const chart = ref(null);

  const width  = ref(props.size),
        height = ref(props.size);
  const radius = ref(Math.min(width.value, height.value) / 2);
  const innerRadius = ref(radius.value / 2)

  onMounted(() => {
    const svg = d3
      .select(chart.value)
      .append('svg')
      .attr('width', width.value)
      .attr('height', height.value)
      .append('g')
      .attr('transform', `translate(${width.value / 2}, ${height.value / 2})`);

    const color = d3.scaleOrdinal()
      .domain(props.data.map(d => d.key))
      .range(props.colors as string[]);

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
      .attr('fill', (d, i) => color(i.toString()) as string);
  });

</script>

<style lang="postcss" scoped></style>
