<template>
  <div class="container flex flex-col gap-y-24 items-center justify-center">
    <div class="flex flex-row flex-wrap justify-between gap-y-8">
      <h2>{{ $t('methodology.title') }}</h2>
      <p class="sm:max-w-[50%]">
        {{ $t('methodology.description') }}
      </p>
    </div>
    <img src="/images/meth-hero.svg" width="838.5" height="323.25" class="w-full"/>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="postcss" scoped></style>
