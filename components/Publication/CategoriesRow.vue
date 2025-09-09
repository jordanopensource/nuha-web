<template>
  <div class="flex gap-2 flex-wrap justify-start items-center">
    <UiChip 
      v-if="category" 
      :text="category.name" 
      variant="primary" 
    />
    <template v-if="regions && regions.length > 0">
      <UiChip
        v-for="region in regions"
        :key="region.code"
        :text="region.name"
        variant="outline"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Category, Region } from '~/types/publication';

defineProps<{
  category?: Category;
  regions?: Region[];
}>();
</script>
