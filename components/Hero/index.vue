<script setup lang="ts"></script>

<template>
  <div class="main">
    <HeroIntroText />
    <div>
      <HeroWaitlist />
      <HeroLearnMore />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .main {
    @apply h-5/6 grid grid-cols-1 place-items-center md:flex md:items-center md:justify-between;
  }
</style>
