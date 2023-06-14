<template>
  <g class="layer-labels">
    <text
      v-for="(p, i) in points"
      :key="i"
      :x="p.x"
      :y="p.y - 10"
      text-anchor="middle"
      font-size="12"
      fill="#969696"
    >
      {{ p.props.data[dataKeys[1]] }}
    </text>
  </g>
</template>
<script setup lang="ts">
  import { usePoints } from 'vue3-charts'
  const { points } = usePoints(props.dataKeys)
  const props = defineProps({
    dataKeys: {
      type: Object as () => [string, string],
      required: true,
    },
  })
</script>
