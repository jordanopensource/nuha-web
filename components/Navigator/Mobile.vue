<template>
  <div class="container">
    <div class="container-sub">
      <NuxtLink
        v-for="localeItem in availableLocales"
        :key="localeItem.code"
        :to="switchLocalePath(localeItem.code)"
        class="locale-link"
        :class="localeItem.code"
        >{{ localeItem.name }}
      </NuxtLink>

      <img width="50" height="50" src="/logo.svg" />
    </div>
    <div class="header-separator"></div>
  </div>
</template>

<script lang="ts" setup>
  const { locale, locales } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const availableLocales = computed(() => {
    return locales.value.filter((i: any) => i.code !== locale.value)
  })
</script>

<style lang="postcss" scoped>
  .container {
    @apply px-10 py-2.5 pt-10 text-nuha-fushia antialiased;

    &-sub {
      @apply flex justify-between;
    }
  }

  .locale-link {
    @apply rounded-xl border p-0.5 px-2 border-nuha-fushia flex items-center rtl:font-IBMPlexMono ltr:font-IBMPlexSansArabic;
  }

  .header-separator {
    @apply block my-2.5 border-t border-t-nuha-fushia-light h-px w-full;
  }
</style>
