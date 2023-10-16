<template>
  <div class="lg:fixed">
    <div
      class="lg:p-0 dashboard-menu"
      :class="
        props.color === 'white'
          ? 'dashboard-menu-white'
          : 'dashboard-menu-default'
      "
    >
      <NuxtLink
        class="dashboard-menu-item"
        :class="
          props.color === 'white'
            ? 'dashboard-menu-item-white'
            : 'dashboard-menu-item-default'
        "
        :to="localePath('/dashboard')"
        >{{ t('header.userMenu.dashboard') }}</NuxtLink
      >

      <div
        class="separator"
        :class="
          props.color === 'white' ? 'separator-white' : 'separator-default'
        "
      ></div>

      <!-- <NuxtLink
        class="dashboard-menu-item"
        :class="
          props.color === 'white'
            ? 'dashboard-menu-item-white'
            : 'dashboard-menu-item-default'
        "
        :to="localePath('/dashboard/settings')"
        >{{ t('header.userMenu.settings') }}</NuxtLink
      >

      <div
        class="separator"
        :class="
          props.color === 'white' ? 'separator-white' : 'separator-default'
        "
      ></div>
      -->

      <button class="sign-out-button lg:rounded-b-xl" @click="_signOut">
        {{ $t('header.userMenu.signOut') }}
      </button>
    </div>
  </div>
</template>

<script setup>
  const { t } = useI18n()
  const { signOut } = useAuth()
  const localePath = useLocalePath()

  const props = defineProps({
    color: {
      type: String,
      default: 'default',
    },
  })

  async function _signOut() {
    await signOut({ callbackUrl: localePath('/') })
  }
</script>

<style lang="postcss" scoped>
  .dashboard-menu {
    @apply opacity-95;
    @apply lg:relative top-[100px] lg:top-5;
    @apply ltr:right-0 lg:ltr:right-20;
    @apply rtl:left-0 lg:rtl:left-20;
    @apply w-full lg:w-auto;
    @apply grid grid-cols-1 place-items-center;
    @apply lg:border lg:border-nuha-fushia lg:rounded-xl;

    &-default {
      @apply bg-nuha-fushia-100;
    }

    &-white {
      @apply bg-nuha-grey;
    }
  }

  .dashboard-menu-item {
    @apply block p-4 lg:px-8;
    @apply lg:first:rounded-t-xl;
    @apply w-full text-center;

    &-default {
      @apply lg:hover:bg-nuha-fushia-200 text-nuha-fushia;
    }

    &-white {
      @apply lg:hover:bg-nuha-grey-200 text-white;
    }
  }

  .sign-out-button {
    @apply mt-2 lg:my-2 p-2 px-4 border border-nuha-fushia rounded-xl bg-nuha-fushia text-white;
  }

  .separator {
    @apply block lg:last:hidden border-b h-px w-full;

    &-default {
      @apply border-b-nuha-fushia-300;
    }

    &-white {
      @apply border-b-white;
    }
  }
</style>
