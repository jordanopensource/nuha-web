<template>
  <header class="container">
    <div class="nav-container">
      <NuxtLink
        :to="localePath('/')"
        @click="showMobileMenu = false"
        aria-label="home"
      >
        <img class="select-none" width="70" height="70" src="/logo.svg" alt="Nuha logo" />
      </NuxtLink>

      <button
        class="lg:hidden z-20"
        aria-label="navigation menu"
        @click="showMobileMenu = !showMobileMenu"
      >
        <SvgoIconsCloseIcon
          v-if="showMobileMenu"
          class="mobile-icon p-0"
        />
        <SvgoIconsBurgerMenu
          v-else
          class="mobile-icon"
        />
      </button>
      <!-- Desktop list -->
      <div class="list hidden lg:flex">
        <UiAppHeaderMenuItems @showMobileMenu="showMobileMenu = false" />
      </div>
    </div>
    <!-- Mobile list & backdrop -->
    <div
      v-if="showMobileMenu"
      class="w-full h-screen start-0 top-0 absolute bg-transparent border lg:hidden"
      @click="showMobileMenu = false"
    ></div>
    <div class="relative">
      <div
        v-if="showMobileMenu"
        class="list mobile z-20 w-full flex flex-col gap-y-5 lg:!hidden"
      >
        <UiAppHeaderMenuItems @showMobileMenu="showMobileMenu = false" />
      </div>
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
    @apply flex justify-between py-5 lg:pt-10;
    @apply border-nuha-fushia-300 border-b-2;
  }

  .list {
    @apply lg:gap-12 font-light;
    @apply justify-between items-center;
  }
  .list a {
    @apply text-lg text-red-500  bg-red-600 !important;
  }
  .mobile-icon {
    @apply w-12 h-12 p-2 rounded-md transition-colors;
    @apply hover:bg-nuha-fushia-100 [&_path]:hover:fill-nuha-fushia-hover;
    @apply active:bg-nuha-fushia-200;
  }
</style>