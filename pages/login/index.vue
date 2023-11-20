<template>
  <div class="h-screen">
    <div class="main">
      <div class="inner-container">
        <h5 class="login-title">{{ t('login.header') }}</h5>
        <div class="login-btns">
          <form
            @submit="
              (ev) => {
                ev.stopPropagation()
                ev.preventDefault()
                loginWithMagicEmail()
              }
            "
          >
            <input
              class="email-input"
              type="email"
              required
              :placeholder="$t('waitlist.email')"
              :value="email"
              @keyup="
                (ev) => {
                  email = (ev.target as HTMLInputElement).value
                }
              "
            />
            <input
              type="submit"
              class="btn"
              :value="$t('login.withMagicEmail')"
            />
          </form>

          <div v-if="canLoginWithGithub || canLoginWithJosaId">
            <p class="text-xl font-bold italic my-3">
              {{ $t('dashboard.or') }}
            </p>

            <button @click="loginWithGithub" class="btn">
              {{ t('login.withGithub') }}
            </button>

            <button
              @click="loginWithJosaId"
              class="btn"
              v-if="canLoginWithJosaId"
            >
              {{ t('login.withJosaId') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' },
  })
  import { get, set } from '@vueuse/core'
  import { ElNotification } from 'element-plus'

  const { signIn } = useAuth()
  const { t } = useI18n()
  const localePath = useLocalePath()
  const route = useRoute()

  const canLoginWithGithub = ref(false)
  const canLoginWithJosaId = ref(false)
  const email = ref('')

  onMounted(async () => {
    await fetch('/api/check-login-methods', {
      method: 'GET',
      mode: 'cors',
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp) {
          set(canLoginWithGithub, resp.github)
          // set(canLoginWithJosaId, resp.josaId)
        }
      })

    if (route.query['email-login']) {
      ElNotification({
        title: t('status.success'),
        message: t('login.emailLoginSuccess'),
        type: 'success',
        duration: 10000,
        position: 'bottom-right',
      })
      console.log('hello, I have hacked your computer')
    }
  })

  async function loginWithGithub() {
    await signIn('github', { callbackUrl: localePath('/dashboard') })
  }

  async function loginWithJosaId() {
    await signIn('authelia', { callbackUrl: localePath('/dashboard') })
  }

  async function loginWithMagicEmail() {
    await signIn('email', {
      callbackUrl: localePath('/dashboard'),
      email: get(email),
    })
  }
</script>

<style lang="postcss" scoped>
  .main {
    @apply w-full h-4/5 grid place-items-center;
  }
  .inner-container {
    @apply border-solid border-nuha-fushia-300 border-2;
    @apply py-5 text-center shadow-sm shadow-nuha-grey-100;
  }
  .login-btns {
    @apply p-10 lg:p-20 grid grid-cols-1 gap-2;
  }
  .btn {
    @apply w-full p-2 bg-nuha-fushia-300 flex justify-center items-center cursor-pointer;
    @apply font-IBMPlexSansArabic text-base text-nuha-white;
    @apply border border-nuha-fushia-300;
    @apply hover:bg-nuha-white hover:text-nuha-fushia-300;
    @apply disabled:cursor-not-allowed disabled:bg-nuha-grey-200 disabled:border-none disabled:text-nuha-fushia-100;
  }
  .login-title {
    @apply text-nuha-grey font-semibold;
  }
  .email-input {
    @apply border border-nuha-grey-100 p-3 mb-2 w-full;
  }
</style>
