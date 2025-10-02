<template>
  <div class="flex items-center gap-2">
    <span v-if="withText" class="text-sm font-mono">{{ (score * 100).toFixed(1) }}%</span>
    <div class="w-12 bg-gray-200 rounded-full h-2">
      <div 
        class="h-2 rounded-full"
        :class="{
          'bg-colors-analysis-hate-600': label === 'hate-speech',
          'bg-colors-analysis-nonhate-600': label === 'non-hate-speech',
          'bg-colors-analysis-neutral-600': label === 'neutral'
        }"
        :style="{ width: `${score * 100}%` }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  score: number;
  label: 'hate-speech' | 'non-hate-speech' | 'neutral'
  withText?: boolean;
}>(), {
  withText: true,
})
</script>
