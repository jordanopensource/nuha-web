<template>
  <div class="container">
    <div class="container-sub">
      <img width="75" height="75" src="/logo.svg" />

      <div class="link">
        <div class="link-nav">
          <NuxtLink class="link-nav-item" to="statistics">{{
            $t('link.statistics')
          }}</NuxtLink>
          &VerticalBar;
          <NuxtLink class="link-nav-item" to="learn-more">{{
            $t('link.learnMore')
          }}</NuxtLink>
        </div>

        <NuxtLink
          v-for="localeItem in availableLocales"
          :key="localeItem.code"
          :to="switchLocalePath(localeItem.code)"
          class="link-locale"
          :class="localeItem.code"
          >{{ localeItem.name }}
        </NuxtLink>
      </div>
    </div>
    <div class="header-separator" />
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
    @apply px-10 py-2.5 pt-10 text-nuha-fushia;

    &-sub {
      @apply flex justify-between;
    }
  }

  .link {
    @apply flex justify-between items-center;

    &-locale {
      @apply inline-block rounded-xl border p-2 text-xl px-3.5 border-nuha-fushia flex items-center;
    }

    &-nav {
      @apply text-xl font-light px-7;

      &-item {
        @apply px-5;
      }
    }
  }

  .header-separator {
    @apply block my-2.5 border-t border-t-nuha-fushia-light h-px w-full;
  }
</style>
