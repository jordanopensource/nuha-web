<template>
  <div class="lg:absolute">
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
  </div>
</template>

<script setup>
  async function signOut() {
    window.alert('sign out')
  }
</script>

<style lang="postcss" scoped>
  .dashboard-menu {
    @apply absolute lg:relative bg-nuha-fushia-100 top-28 lg:top-5;
    @apply ltr:right-0 lg:ltr:right-10;
    @apply rtl:left-0 lg:rtl:left-10;
    @apply w-full lg:w-auto;
    @apply grid grid-cols-1 place-items-center;
    @apply lg:border lg:border-nuha-fushia lg:rounded-xl;
  }

  .dashboard-menu-item {
    @apply block p-4 text-nuha-fushia;
    @apply lg:hover:bg-nuha-fushia-200;
    @apply lg:first:rounded-t-xl lg:last:rounded-b-xl;
  }
</style>
