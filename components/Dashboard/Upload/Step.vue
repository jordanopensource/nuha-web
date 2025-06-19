<template>
  <div class="flex gap-4 items-center font-medium font-IBMPlexSansArabic text-2xl">
    <div
      :id="circleId"
      class="flex justify-center items-center w-10 h-10 aspect-square text-nuha-white rounded-full bg-nuha-fushia-300"
    >
      {{ order }}
    </div>
    <p>
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
