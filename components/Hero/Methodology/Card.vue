<template>
  <div class="card">
    <NuxtImg class="image" :src="image" loading="lazy" />
    <p class="font-bold">{{ title }}</p>
    <p>{{ content }}</p>
    <a :href="readMoreLink" class="read-more">
      {{ t('misc.readMore') }}
      <div class="arrow-icon"></div>
    </a>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    title: String,
    content: String,
    image: String,
    readMoreLink: String,
  })

  const { t } = useI18n()
</script>

<style lang="postcss" scoped>
  .card {
    @apply inline-block my-5;
  }
  p,
  .image,
  .card {
    @apply w-full;
  }
  p {
    @apply my-5;
  }
  .read-more {
    @apply text-nuha-fushia-300;
    @apply flex items-center;
    @apply hover:underline;
  }
  .arrow-icon {
    @apply inline-block;
    @apply mx-2 w-5 h-5 transform rtl:rotate-180 text-black;
    @apply bg-[url('/icons/arrow-right.svg')] bg-cover;
  }
</style>
