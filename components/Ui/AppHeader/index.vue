<template>
  <header>
    <div class="container">
      <NuxtLink :to="localePath('/')">
        <img width="70" height="70" src="/logo.svg" />
      </NuxtLink>

      <button
        class="mobile-menu-btn"
        aria-label="navigation menu"
        @click="showMobileMenu = !showMobileMenu"
      >
        <img
          :src="showMobileMenu ? '/close-icon.svg' : '/burger-menu.svg'"
          width="40" height="40"
        />
      </button>
      <div
        class="link link-nav"
        :class="showMobileMenu ? 'mobile-menu' : 'max-sm:!hidden'"
      >
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

        <!-- User items -->
        <UserMenuButton
          @update:showItems="(value: boolean) => {showUserMenu = value}"
        />
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

  const showUserMenu = ref(false)
  const showMobileMenu = ref(false)
</script>

<style lang="postcss" scoped>
  .container {
    @apply flex justify-between text-nuha-fushia;
    @apply pb-5 pt-10 max-lg:mb-10;
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
  .mobile-menu-btn {
    @apply sm:hidden;
  }
  .mobile-menu {
    @apply absolute top-20 ltr:right-4 rtl:left-4;
    @apply flex flex-col gap-y-2 p-4;
    @apply bg-nuha-fushia-100 border border-nuha-fushia-300 shadow-2xl;
  }
  @media (min-width: 640px) {
      .link {
        @apply flex-row static p-0 border-0 shadow-none;
      }
    }
</style>
