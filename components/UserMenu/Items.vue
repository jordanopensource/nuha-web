<template>
  <div class="lg:absolute">
    <div class="dashboard-menu">
      <NuxtLink
        class="dashboard-menu-item"
        v-for="(link, index) in links"
        :key="index"
        :to="link.target"
        >{{ link.title }}</NuxtLink
      >

      <button class="dashboard-menu-item" @click="signOut">
        {{ $t('header.userMenu.signOut') }}
      </button>
    </div>
  </div>
</template>

<script setup>
  const { t } = useI18n()

  const links = [
    { title: t('header.userMenu.dashboard'), target: '/dashboard' },
    { title: t('header.userMenu.settings'), target: '/dashboard/settings' },
  ]
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
    @apply border-b border-b-nuha-fushia-200;
  }
</style>
