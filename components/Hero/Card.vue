<template>
  <div class="card flex flex-col gap-y-5">
    <div
      class="bg-cover rounded-md w-full aspect-square p-8 bg-no-repeat bg-nuha-fushia-300"
      :style="`background-image: url('${image}')`"
    >
      <span
        class="category text-2xl block text-nuha-fushia-100 w-3/5 leading-[0.83]"
        v-if="category"
      >{{ category }}</span>
      <span class="subtitle font-bold block text-3xl text-nuha-fushia-100 w-3/5 leading-[0.83]">{{ subtitle }}</span>
    </div>
    <h3 class="font-bold font-IBMPlexSansArabic text-lg">{{ title }}</h3>
    <p class="text-xl">{{ content }}</p>
    <NuxtLink
      v-if="readMoreLink"
      :to="$nuxt.$localePath(readMoreLink)"
      class="text-nuha-fushia-300 flex items-center hover:underline"
    >
      {{ t('misc.readMore') }}
      <IconArrowForward class="ms-2 rtl:rotate-180"/>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    title: String,
    category: String,
    subtitle: String,
    content: String,
    image: String,
    readMoreLink: String,
  })

  const { t } = useI18n()
</script>
