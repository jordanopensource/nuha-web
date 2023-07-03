<template>
  <div
    class="container"
    :class="
      props.logoColor !== 'white' ? 'text-nuha-fushiaz' : 'text-nuha-fushia-100'
    "
  >
    <div class="container-sub">
      <NuxtLink
        v-for="localeItem in availableLocales"
        :key="localeItem.code"
        :to="switchLocalePath(localeItem.code)"
        class="locale-link"
        :class="
          (localeItem.code,
          props.logoColor !== 'white'
            ? 'border-nuha-fushia text-nuha-fushia'
            : 'border-nuha-fushia-100')
        "
        >{{ localeItem.name }}
      </NuxtLink>

      <NuxtLink to="/">
        <img
          width="50"
          height="50"
          :src="props.logoColor !== 'white' ? '/logo.svg' : 'logo-white.svg'"
        />
      </NuxtLink>

      <UserMenu />
    </div>
    <div
      class="header-separator"
      :class="
        props.logoColor !== 'white'
          ? 'border-nuha-fushia-300 '
          : 'border-nuha-fushia-100'
      "
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables'

  const props = defineProps({
    logoColor: {
      type: String,
      default: 'default',
    },
  })

  const { locale, locales } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const availableLocales = computed(() => {
    return (locales.value as LocaleObject[]).filter(
      (l: LocaleObject) => l.code !== locale.value
    )
  })
</script>

<style lang="postcss" scoped>
  .container {
    @apply py-2.5 pt-10  antialiased;

    &-sub {
      @apply flex justify-between;
    }
  }

  .locale-link {
    @apply rounded-xl border p-0.5 px-2  flex items-center rtl:font-IBMPlexMono ltr:font-IBMPlexSansArabic;
  }

  .header-separator {
    @apply block my-2.5 border-t h-px w-full;
  }
</style>
