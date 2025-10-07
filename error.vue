<template>
  <div
    :lang="head.htmlAttrs!.lang"
    :dir="head.htmlAttrs!.dir"
    class="container py-16 md:p-16 flex flex-col gap-16"
  >
    <!-- 404 Content -->
    <template v-if="props.error?.statusCode === 404">
      <UiPageHeading class="max-md:gap-8">
        <template #title>
          <div class="flex flex-col h-full gap-8">
            <div class="flex flex-col gap-4">
              <h1 class="text-8xl font-extrabold text-colors-primary">{{props.error?.statusCode}}</h1>
              <h2>
                {{ $t('error.404.heading') }}
              </h2>
            </div>
            <p class="font-IBMPlexSansArabic leading-relaxed">
              {{ $t('error.404.description') }}
            </p>
            <div class="flex gap-4 flex-wrap mt-auto max-sm:justify-center">
              <UiButton
                size="lg"
                :to="localePath('/')"
                variant="primary"
              >
                {{ $t('error.404.backHome') }}
                <template #icon>
                  <Icon name="mdi:home" size="24" />
                </template>
              </UiButton>
            </div>
          </div>
        </template>
        <template #second-col>
          <img 
            src="~/assets/images/messy_doodle.svg" 
            loading="lazy" 
            alt="404 illustration" 
            width="480" 
            class="ms-auto max-lg:mx-auto"
          >
        </template>
      </UiPageHeading>

      <!-- Additional helpful links for 404 -->
      <UiPageHeading>
        <template #title>
          <div class="flex flex-col h-full gap-6">
            <h2>
              {{ $t('error.404.exploreNuha') }}
            </h2>
            <p class="font-IBMPlexSansArabic">
              {{ $t('error.404.exploreNuhaText') }}
            </p>
          </div>
        </template>
        <template #second-col>
          <div class="flex flex-col gap-2 md:items-end">
            <UiButton
              size="md"
              variant="outline"
              :to="localePath('/publications')"
              class="w-max"
            >
              {{ $t('links.general.publications') }}
              <template #icon>
                <Icon name="mdi:book-open-variant" size="20" />
              </template>
            </UiButton>
            <UiButton
              size="md"
              variant="outline"
              :to="localePath('/analyze')"
              class="w-max"
            >
              {{ $t('links.general.analyze') }}
              <template #icon>
                <Icon name="mdi:chart-line" size="20" />
              </template>
            </UiButton>
            <UiButton
              size="md"
              variant="outline"
              :to="localePath('/about')"
              class="w-max"
            >
              {{ $t('links.general.about') }}
              <template #icon>
                <Icon name="mdi:information" size="20" />
              </template>
            </UiButton>
          </div>
        </template>
      </UiPageHeading>
    </template>

    <!-- General Error Content -->
    <template v-else>
      <UiPageHeading class="max-md:gap-8">
        <template #title>
          <div class="flex flex-col h-full gap-8">
            <div class="flex flex-col gap-4">
              <h1 class="text-8xl font-extrabold text-colors-primary">{{ props.error?.statusCode || 'Error' }}</h1>
              <h2>
                {{ $t('error.general.heading') }}
              </h2>
            </div>
            <p class="font-IBMPlexSansArabic leading-relaxed">
              {{ props.error?.statusMessage || $t('error.general.description') }}
            </p>
            <div class="flex gap-4 flex-wrap mt-auto max-sm:justify-center">
              <UiButton
                size="lg"
                variant="primary"
                @click="handleError"
              >
                {{ $t('error.general.tryAgain') }}
                <template #icon>
                  <Icon name="mdi:refresh" size="24" />
                </template>
              </UiButton>
              <UiButton
                size="lg"
                variant="outline"
                :to="localePath('/')"
              >
                {{ $t('error.general.backHome') }}
                <template #icon>
                  <Icon name="mdi:home" size="24" />
                </template>
              </UiButton>
            </div>
          </div>
        </template>
        <template #second-col>
          <img 
            src="~/assets/images/messy_doodle.svg" 
            loading="lazy" 
            alt="Error illustration" 
            width="480" 
            class="ms-auto max-lg:mx-auto"
          >
        </template>
      </UiPageHeading>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app'

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true
  }
})

const localePath = useLocalePath()

const handleError = () => clearError({ redirect: '/' })

// Set page meta
useHead({
  title: () => props.error?.statusCode === 404 ? $t('error.404.title') : $t('error.general.title'),
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ],
})

const head = useLocaleHead({
  dir: true,
  lang: true,
  seo: true,
})
</script>

<style lang="postcss" scoped>
</style>