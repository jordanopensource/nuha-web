<template>
  <header>
    <div class="container">
      <NuxtLink :to="localePath('/')">
        <img width="75" height="75" src="/logo.svg" />
      </NuxtLink>

      <div class="link link-nav max-sm:!hidden">
        <NuxtLink
          v-for="localeItem in availableLocales"
          :key="localeItem.code"
          :to="switchLocalePath(localeItem.code)"
          class="link-locale link-hover"
          :class="localeItem.code"
          >{{ localeItem.name }}
        </NuxtLink>

        <NuxtLink
          v-for="link in links"
          class="link-nav-item link-hover"
          :to="link.path"
        >
          {{ link.title }}
        </NuxtLink>

        <div>
          <UserMenuButton
            @update:showItems="(value: boolean) => {showMenu = value}"
          />
          <UserMenuItems v-if="showMenu" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables'

  // language switcher
  const { locale, locales, t } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const localePath = useLocalePath()
  const availableLocales = computed(() => {
    return (locales.value as LocaleObject[]).filter(
      (l: LocaleObject) => l.code !== locale.value
    )
  })

  type Link = {
    title: string
    path: string
  }

  const links = ref<Link[]>([
    {
      title: t('link.statistics'),
      path: localePath('/') + '#statistics',
    },
    {
      title: t('link.learnMore'),
      path: localePath('/') + '#learn-more',
    },
  ])

  const showMenu = ref<boolean>(false)
</script>

<style lang="postcss" scoped>
  .container {
    @apply flex justify-between text-nuha-fushia;
    @apply pb-5 pt-10 mb-20;
    @apply border-nuha-fushia-300 border-b-2;
  }

  .link {
    @apply text-xl flex justify-between items-center gap-8;

    &-nav {
      @apply font-light;
    }
    &-hover:hover {
      @apply underline;
    }
  }
</style>
