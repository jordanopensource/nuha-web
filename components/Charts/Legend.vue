<template>
  <div
    class="legend font-IBMPlexSansArabic"
  >
    <div
      v-for="(item, i) in data"
      :key="item.key"
      class="legend-item"
    >
      <div
        class="w-6 aspect-square h-full"
        :style="`background-color: ${colors[i]};`"
      ></div>
      <div class="flex flex-col">
        <span class="key">{{ item.key }}</span>
        <span class="text-xs">
          {{ $t('predictionResult.percentage')}}:
          <span class="font-bold">{{ item.value?.toFixed(1) }}%</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    data: {
      type: Array as PropType<{
        key: string
        value?: number
      }[]>,
      default: [],
    },
    colors: {
      type: Array as PropType<string[]>,
      default: [],
    },
  })
</script>

<style lang="postcss" scoped>
  .legend {
    @apply flex flex-col gap-y-4 max-sm:w-full;
    &-item {
      @apply flex items-center gap-4;
      @apply pb-4 border-b border-nuha-grey-100 border-dotted;
    }
  }
</style>
