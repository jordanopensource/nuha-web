<template>
  <NuxtLink to="/login" v-if="!isLoggedIn()" class="login-btn">
    {{ $t('header.login') }}
  </NuxtLink>
  <div v-else>
    <button
      @click="() => (showItems = !showItems)"
      class="lg:ltr:pl-8 lg:rtl:pr-8 text-nuha-fushia"
    >
      <nuxt-img
        :src="
          props.logoColor === 'white'
            ? '/burger-menu-white.svg'
            : '/burger-menu.svg'
        "
        class="w-10 h-10"
      />
    </button>

    <UserMenuItems id="items" v-if="showItems" />
  </div>
</template>

<script setup>
  import { set } from '@vueuse/core'
  import { ref } from 'vue'

  const hideMenu = useHideMenu()
  const showItems = ref(false)
  watch(hideMenu, (value) => {
    if (value) {
      set(showItems, false)
    }
  })

  const props = defineProps({
    logoColor: {
      type: String,
      default: 'default',
    },
  })

  function isLoggedIn() {
    return useAuthCheck()
  }
</script>

<style lang="postcss" scoped>
  .login-btn {
    @apply rounded-xl p-2 lg:rtl:mr-2 lg:ltr:ml-2 text-lg border border-nuha-fushia text-nuha-fushia flex items-center ltr:font-IBMPlexMono rtl:font-IBMPlexSansArabic;
  }
</style>
