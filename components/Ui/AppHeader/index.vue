<template>
  <header class="container">
    <div class="nav-container">
      <NuxtLink :to="localePath('/')" @click="showMobileMenu = false">
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
        <UiAppHeaderMenuItems @showMobileMenu="showMobileMenu = false" />
      </div>
    </div>
    <!-- Mobile list -->
    <div class="list mobile" :class="showMobileMenu ? 'show' : 'hide'">
      <UiAppHeaderMenuItems @showMobileMenu="showMobileMenu = false" />
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
    @apply flex justify-between;
    @apply pb-5 pt-10;
    @apply border-nuha-fushia-300 border-b-2;
  }

  .list {
    @apply gap-12 font-light;
    @apply justify-between items-center;
  }
  .list a {
    @apply text-lg text-red-500  bg-red-600 !important;
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