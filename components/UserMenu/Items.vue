<template>
  <div class="lg:fixed">
    <div class="container lg:p-0 dashboard-menu">
      <NuxtLink class="dashboard-menu-item" to="/dashboard">{{
        t('header.userMenu.dashboard')
      }}</NuxtLink>

      <div class="separator"></div>

      <NuxtLink class="dashboard-menu-item" to="/dashboard/settings">{{
        t('header.userMenu.settings')
      }}</NuxtLink>

      <div class="separator"></div>

      <button class="sign-out-button lg:rounded-b-xl" @click="signOut">
        {{ $t('header.userMenu.signOut') }}
      </button>

      <div class="separator"></div>
    </div>
  </div>
</template>

<script setup>
  const { t } = useI18n()

  async function signOut() {
    window.alert('sign out')
  }
</script>

<style lang="postcss" scoped>
  .dashboard-menu {
    @apply opacity-90;
    @apply absolute lg:relative bg-nuha-fushia-100 top-[100px] lg:top-5;
    @apply ltr:right-0 lg:ltr:right-20;
    @apply rtl:left-0 lg:rtl:left-20;
    @apply w-full lg:w-auto;
    @apply grid grid-cols-1 place-items-center;
    @apply lg:border lg:border-nuha-fushia lg:rounded-xl;
  }

  .dashboard-menu-item {
    @apply block p-4 lg:px-8 text-nuha-fushia;
    @apply lg:hover:bg-nuha-fushia-200;
    @apply lg:first:rounded-t-xl;
    @apply w-full text-center;
  }

  .sign-out-button {
    @apply my-2 p-2 px-4 border border-nuha-fushia rounded-xl bg-nuha-fushia text-white;
  }

  .separator {
    @apply block lg:last:hidden border-b border-b-nuha-fushia-300 h-px w-11/12;
  }
</style>
