<template>
  <NuxtLink
    :to="localePath('/login')"
    v-if="!isLoggedIn()"
    class="login-btn"
    :class="
      props.logoColor === 'white' ? 'login-btn-white' : 'login-btn-default'
    "
  >
    {{ t('header.login') }}
  </NuxtLink>
  <div v-else>
    <button
      @click="
        () => {
          emit('update:showItems', !showItems)
          showItems = !showItems
        }
      "
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
  </div>
</template>

<script setup>
  import { set } from '@vueuse/core'
  import { ref } from 'vue'

  const emit = defineEmits(['update:showItems'])

  const { t } = useI18n()
  const hideMenu = useHideMenu()
  const showItems = ref(false)
  watch(hideMenu, (value) => {
    if (value) {
      set(showItems, false)
      emit('update:showItems', false)
    }
  })

  const props = defineProps({
    logoColor: {
      type: String,
      default: 'default',
    },
  })
  const localePath = useLocalePath()

  function isLoggedIn() {
    return useAuthCheck()
  }
</script>

<style lang="postcss" scoped>
  .login-btn {
    @apply rounded-xl p-2 lg:rtl:mr-2 lg:ltr:ml-2 text-lg border flex items-center ltr:font-IBMPlexMono rtl:font-IBMPlexSansArabic;

    &-default {
      @apply border-nuha-fushia text-nuha-fushia;
    }
    &-white {
      @apply border-white text-white;
    }
  }
</style>
