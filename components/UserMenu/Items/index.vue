<template>
  <div class="dashboard-menu">
    <NuxtLink class="dashboard-menu-item" to="/dashboard">{{
      $t('dashboard.menu.dashboard')
    }}</NuxtLink>

    <UserMenuItemsSeparator />

    <NuxtLink class="dashboard-menu-item" to="/dashboard/settings">{{
      $t('dashboard.menu.settings')
    }}</NuxtLink>

    <UserMenuItemsSeparator />

    <button class="dashboard-menu-item" @click="signOut">
      {{ $t('dashboard.menu.signOut') }}
    </button>
  </div>
</template>

<script setup>
  async function signOut() {
    window.alert('sign out')
  }
</script>

<style lang="postcss" scoped>
  .dashboard-menu {
    @apply absolute bg-nuha-fushia-100 top-28;
    @apply ltr:right-0 lg:ltr:right-16;
    @apply rtl:left-0 lg:rtl:left-16;
    @apply w-full lg:w-auto;
    @apply grid grid-cols-1 place-items-center;
  }

  .dashboard-menu-item {
    @apply block p-4 text-nuha-fushia;
    @apply lg:hover:bg-nuha-fushia-200;
  }
</style>
