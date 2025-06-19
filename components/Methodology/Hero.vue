<template>
  <div
    class="methodology-border flex flex-col gap-y-14 items-center justify-center"
  >
    <div class="hero-grid">
      <h1 class="col-span-1">{{ $t('methodology.title') }}</h1>
      <p class="text-4xl col-span-2 max-lg:text-3xl lg:px-8">
        {{ $t('methodology.description') }}
      </p>
    </div>
    <SvgoMethHero class="w-full" />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="postcss" scoped>
.methodology-border {
  @apply border-b-2 border-[#a066a9] pb-16;
}
</style>
