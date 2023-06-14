<template>
  <Hero />
</template>
  <UiPieChart :chart-data="speechData" :class="'w-full'" />
</template>
<script setup lang="ts">
  const speechData: {
    key: string
    value: number
  }[] = [
    {
      key: 'Hate speech',
      value: 57,
    },
    {
      key: 'Positive speech',
      value: 23,
    },
    {
      key: 'Unrelated to discussion',
      value: 15.99,
    },
    {
      key: 'Neutral',
      value: 4.01,
    },
  ]
</script>
<style scoped lang="postcss"></style>
