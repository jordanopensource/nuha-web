<template>
  <div class="card flex flex-col gap-y-5">
    <div
      class="bg-cover w-full aspect-square p-8 bg-no-repeat"
      :style="`background-image: url('${image}')`"
    >
      <h4 class="text-4xl text-nuha-fushia-100 w-3/5 leading-[0.83]">{{ subtitle }}</h4>
    </div>
    <h3 class="font-bold font-IBMPlexSansArabic text-lg">{{ title }}</h3>
    <p class="text-xl">{{ content }}</p>
    <NuxtLink
      v-if="readMoreLink"
      :to="$nuxt.$localePath(readMoreLink) + readMoreLink.substring(readMoreLink.lastIndexOf('#'))"
      class="read-more"
    >
      {{ t('misc.readMore') }}
      <div class="arrow-icon"></div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    title: String,
    subtitle: String,
    content: String,
    image: String,
    readMoreLink: String,
  })

  const { t } = useI18n()
</script>

<style lang="postcss" scoped>
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
