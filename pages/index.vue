<template>
  <div>
    <div class="container h-[75vh]">
      <UiAppHeader class="container" />
      <Hero />
    </div>
    <StatisticsIndicator @emit-scroll="scrollTo" />
    <Statistics ref="statisticsSection" class="lg:container" />
  </div>
</template>
<script setup>
  const statisticsSection = ref(null)
  const scrollTo = () => {
    statisticsSection.value?.$el.scrollIntoView({ behavior: 'smooth' })
  }
</script>
