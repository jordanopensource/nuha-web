<template>
  <header class="container">
    <div class="nav-container">
      <NuxtLink :to="localePath('/')" @click="showMobileMenu = !showMobileMenu">
        <img width="70" height="70" src="/logo.svg" />
      </NuxtLink>

      <button
        class="lg:hidden"
        aria-label="navigation menu"
        @click="showMobileMenu = !showMobileMenu"
      >
        <img
          :src="showMobileMenu ? '/close-icon.svg' : '/burger-menu.svg'"
          width="40"
          height="40"
        />
      </button>
      <!-- Desktop list -->
      <div class="list desktop">
        <UiAppHeaderMenuItems />
      </div>
    </div>
    <!-- Mobile list -->
    <div class="list mobile" :class="showMobileMenu ? 'show' : 'hide'">
      <UiAppHeaderMenuItems />
    </div>
  </header>
</template>

<script setup lang="ts">
  // language switcher
  const localePath = useLocalePath()

  const showMobileMenu = ref(false)
</script>

<style lang="postcss" scoped>
  .nav-container,
  .mobile {
    @apply flex justify-between text-nuha-fushia;
    @apply pb-5 pt-10;
    @apply border-nuha-fushia-300 border-b-2;
  }

  .list {
    @apply gap-8 font-light text-xl;
    @apply justify-between items-center;
  }
  .desktop {
    @apply hidden lg:flex;
  }

  .mobile {
    @apply flex-col gap-y-5 lg:hidden;
  }
  .mobile.show {
    @apply flex;
  }
  .mobile.hide {
    @apply hidden;
  }
</style>
