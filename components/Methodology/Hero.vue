<template>
  <div class="container flex flex-col gap-y-24 items-center justify-center">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <h1 class="text-6xl">{{ $t('methodology.title') }}</h1>
      <p class="text-xl text-justify">
        {{ $t('methodology.description') }}
      </p>
    </div>
    <img
      src="/images/meth-hero.svg"
      width="838.5"
      height="323.25"
      class="w-full"
    />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="postcss" scoped></style>
