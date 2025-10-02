<template>
  <span 
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="{
      'bg-colors-analysis-hate-100 text-colors-analysis-hate-800': label === 'hate-speech',
      'bg-colors-analysis-nonhate-100 text-colors-analysis-nonhate-800': label === 'non-hate-speech',
      'bg-colors-analysis-neutral-100 text-colors-analysis-neutral-800': label === 'neutral'
    }"
  >
    {{ label }}
  </span>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  label: 'hate-speech' | 'non-hate-speech' | 'neutral'
}>(), {})
</script>
