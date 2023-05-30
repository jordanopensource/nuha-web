<template>
  <div class="container">
    <div class="container_sub">
      <img width="75" height="75" src="/logo.svg" />

      <div class="link">
        <div class="link_nav">
          <NuxtLink class="link_nav_item" to="statistics">{{
            $t('link.statistics')
          }}</NuxtLink>
          &VerticalBar;
          <NuxtLink class="link-nav-item" to="learn-more">{{
            $t('link.learnMore')
          }}</NuxtLink>
        </div>

        <NuxtLink
          class="link_locale"
          :to="switchLocalePath($t('otherLocaleCode'))"
          >{{ $t('otherLocale') }}</NuxtLink
        >
      </div>
    </div>
    <div class="header-separator" />
  </div>
</template>

<script lang="ts" setup>
  const switchLocalePath = useSwitchLocalePath()
</script>

<style lang="postcss" scoped>
  .container {
    @apply px-10 py-2.5 pt-10 text-nuha-fushia;

    &_sub {
      @apply flex justify-between;
    }
  }

  .link {
    @apply flex justify-between items-center;

    &_locale {
      @apply inline-block rounded-xl border p-2 text-xl px-3.5 border-nuha-fushia flex items-center;
    }

    &_nav {
      @apply text-xl font-light px-7;

      &_item {
        @apply px-5;
      }
    }
  }

  .header-separator {
    @apply block my-2.5 border-t border-t-nuha-fushia-light h-px w-full;
  }
</style>
