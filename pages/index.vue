<template>
  <div
    class="snap-y snap-mandatory h-screen w-full overflow-scroll lg:snap-none lg:overflow-x-hidden"
  >
    <div class="h-screen">
      <UiAppHeader class="container snap-start shrink-0" />
      <Hero class="container" />
    </div>
    <StatisticsIndicator />
    <Statistics id="statistics" class="snap-start shrink-0" />

    <div class="container lg:my-60 mb-60">
      <NuhaIdentity id="learn-more" class="snap-start shrink-0" />
      <NuhaWork class="container snap-start shrink-0" />
    </div>
  </div>
</template>
<script setup></script>
