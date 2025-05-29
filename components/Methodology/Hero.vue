<template>
  <div
    class="methodology-border flex flex-col gap-y-14 items-center justify-center"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <h1>{{ $t('methodology.title') }}</h1>
      <p class="text-4xl">
        {{ $t('methodology.description') }}
      </p>
    </div>
    <SvgoMethHero class="w-full" />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="postcss" scoped></style>
