<template>
  <div class="flex gap-2 flex-wrap items-center text-xl font-medium">
    <div
      :id="circleId"
      class="flex justify-center items-center w-[44px] h-[44px] aspect-square text-white rounded-full bg-nuha-fushia-300"
    >
      {{ order }}
    </div>
    <p class="me-2">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    order: Number,
    description: String,
    circleId: String,
  })
</script>
