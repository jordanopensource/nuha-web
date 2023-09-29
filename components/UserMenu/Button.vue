<template>
  <NuxtLink
    :to="localePath('/login')"
    v-if="!isLoggedIn()"
    class="login-btn login-btn-default"
  >
    {{ t('header.login') }}
    <span class="mt-1 ms-2 rtl:rotate-180">￫</span>
  </NuxtLink>
  <!-- TODO -->
  <!-- <div v-else>
    <button
      @click="
        () => {
          emit('update:showItems', !showItems)
          showItems = !showItems
        }
      "
      class="lg:ps-8 text-nuha-fushia"
    >
      <img
        src="/burger-menu.svg"
        class="w-10 h-10"
      />
    </button>
  </div> -->
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

  const localePath = useLocalePath()

  function isLoggedIn() {
    return useAuthCheck()
  }
</script>

<style lang="postcss" scoped>
  .login-btn {
    @apply p-2 ms-2 text-lg border flex items-center;

    &-default {
      @apply border-nuha-fushia text-nuha-fushia;
      @apply hover:bg-nuha-fushia-300 hover:text-nuha-fushia-100;
    }
  }
</style>
