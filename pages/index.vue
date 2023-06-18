<template>
  <div
    class="snap-y snap-mandatory h-screen overflow-scroll lg:snap-none lg:overflow-x-hidden"
  >
    <div class="h-screen container">
      <UiAppHeader class="snap-start shrink-0" />
      <Hero class="container" />
    </div>
    <StatisticsIndicator />
    <Statistics id="statistics" class="snap-start shrink-0" />

    <div id="learn-more" class="container lg:my-60 mb-60">
      <NuhaIdentity class="snap-start shrink-0" />
      <NuhaWork class="snap-start shrink-0" />
    </div>
  </div>
</template>
<script setup></script>
