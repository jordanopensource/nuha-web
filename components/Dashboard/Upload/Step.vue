<template>
  <div class="flex gap-x-3 items-center text-xl font-medium">
    <div
      :id="circleId"
      class="flex justify-center items-center w-[44px] h-[44px] text-white rounded-full bg-nuha-fushia-300"
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
