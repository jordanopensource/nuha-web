<template>
  <div class="text-center p-4 rounded-lg border">
      <div class="text-2xl font-bold">
      {{ value }}
    </div>
      <div class="text-sm">{{ title }}</div>
    <div v-if="numberOfComments" class="text-xs text-gray-600">
      {{ numberOfComments }} {{ $t('analyze.results.summary.commentsLabel') }}
    </div>
    <small v-if="confidence" class="flex gap-1 justify-center mt-2">
      <div>{{ $t('analyze.results.summary.confidence') }}</div>
      <div>
        {{ confidence }}%
      </div>
    </small>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  title: string;
  value: string;
  numberOfComments?: number | null;
  confidence?: number | string | null;
}>(), {
  numberOfComments: null,
  confidence: null
})
</script>
