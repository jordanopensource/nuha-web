<template>
  <div class="main">
    <div class="inner-container">
      <h5 class="login-title">{{ t('login.header') }}</h5>
      <div class="login-btns">
        <button @click="loginWithGithub" class="btn">
          {{ t('login.withGithub') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { get } from '@vueuse/core'
  const { signIn } = useAuth()
  const { t, locale } = useI18n()

  async function loginWithGithub() {
    // HACK: login and sign out in NuxtAuth must be called before any user defined composable.
    // hence the repeated code over here :(
    let link = '/dashboard'
    if (get(locale) !== 'en') {
      link = `/${get(locale)}${link}`
    }
    await signIn('github', { callbackUrl: link })
  }
</script>

<style lang="postcss" scoped>
  .main {
    @apply w-full h-4/5 grid place-items-center;
  }
  .inner-container {
    @apply p-5 text-center shadow-sm shadow-nuha-grey-100 rounded-xl bg-nuha-fushia-200;
  }
  .login-btns {
    @apply p-10 py-28 lg:p-20 lg:py-28 grid grid-cols-1 gap-2;
  }
  .btn {
    @apply text-white rounded-xl text-lg p-2 bg-nuha-fushia flex items-center ltr:font-IBMPlexMono rtl:font-IBMPlexSansArabic;
  }
  .login-title {
    @apply text-nuha-grey font-semibold;
  }
</style>
