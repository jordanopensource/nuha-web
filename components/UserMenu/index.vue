<template>
  <button v-if="!isLoggedIn()" class="sign-in-btn">
    {{ $t('header.signIn') }}
  </button>
  <div v-else>
    <button
      @click="toggleMenu"
      class="lg:ltr:pl-8 lg:rtl:pr-8 text-nuha-fushia"
    >
      <UserMenuIcon />
    </button>

    <UserMenuItems v-if="showItems" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  const showItems = ref(false)

  function isLoggedIn(): boolean {
    return true
  }

  function toggleMenu() {
    showItems.value = !showItems.value
  }
</script>

<style lang="postcss" scoped>
  .sign-in-btn {
    @apply text-nuha-fushia rounded-xl border p-1 text-lg border-nuha-fushia flex items-center ltr:font-IBMPlexMono rtl:font-IBMPlexSansArabic;
  }
</style>
