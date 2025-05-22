<template>
  <template v-if="!isLoggedIn()">
    <UiButton
      v-if="!isLoginPage"
      :to="localePath('/login')"
      size="md"
      variant="primary"
    >
      {{ t('header.login') }}
      <template #icon>
        <IconArrowForward class="rtl:rotate-180"/>
      </template>
    </UiButton>
  </template>
  <UiButton
    v-else
    @click="signOut"
    variant="ghost"
  >
    {{ t('header.logout') }}
    <template #icon>
      <IconArrowForward class="rtl:rotate-180"/>
    </template>
  </UiButton>
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
  const { signOut } = useAuth()

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
  const isLoginPage = computed(() =>
    useRoute().path.endsWith('/login') ||
      useRoute().path.endsWith('/login/')
  )
</script>

<style lang="postcss" scoped>
  .login-btn {
    @apply px-6 py-2 text-lg border flex items-center;

    &-default {
      @apply border-nuha-fushia text-nuha-fushia text-base leading-none;
      @apply hover:bg-nuha-fushia-300 hover:text-nuha-fushia-100;
    }
  }
</style>
