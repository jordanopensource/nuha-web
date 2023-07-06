<template>
  <button v-if="!isLoggedIn()" class="sign-in-btn">
    {{ $t('header.signIn') }}
  </button>
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
    return true
  }
</script>

<style lang="postcss" scoped>
  .sign-in-btn {
    @apply text-nuha-fushia rounded-xl border p-1 text-lg border-nuha-fushia flex items-center ltr:font-IBMPlexMono rtl:font-IBMPlexSansArabic;
  }
</style>
