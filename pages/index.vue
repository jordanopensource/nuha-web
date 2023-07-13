<template>
  <div
    class="snap-y snap-proximity h-auto overflow-auto lg:snap-none lg:overflow-x-hidden"
  >
    <div class="h-screen container">
      <UiAppHeader class="snap-start shrink-0" />
      <Hero class="container" />
    </div>
    <StatisticsIndicator />
    <Statistics id="statistics" />
    <div id="learn-more" class="container lg:my-60 mb-60">
      <NuhaIdentity />
      <NuhaWork />
    </div>
  </div>
</template>
<script setup lang="ts">
  definePageMeta({ auth: false })
</script>
