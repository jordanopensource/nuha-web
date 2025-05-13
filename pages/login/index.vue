<template>
  <div class="h-screen">
    <div class="main">
      <div class="inner-container">
        <h5 class="login-title">{{ t('login.header') }}</h5>
        <div class="login-btns">
          <form @submit.stop.prevent="loginWithMagicEmail()">
            <input
              class="email-input"
              type="email"
              required
              v-model="email"
              :placeholder="$t('waitlist.email')"
            />
            <button type="submit" class="btn" :disabled="loggingIn">
              <div v-if="!currentLoginMethod.magicEmail">
                {{ $t('login.withMagicEmail') }}
              </div>
              <div v-else class="loader !h-8 !w-8"></div>
            </button>
          </form>

          <div v-if="canLoginWithGithub || canLoginWithJosaId">
            <p class="text-xl font-bold italic my-3">
              {{ $t('dashboard.or') }}
            </p>

            <button
              @click="loginWithGithub"
              class="btn"
              v-if="canLoginWithGithub"
              :disabled="loggingIn"
            >
              <div v-if="!currentLoginMethod.github">
                {{ t('login.withGithub') }}
              </div>
              <div v-else class="loader !h-8 !w-8"></div>
            </button>

            <button
              @click="loginWithJosaId"
              class="btn"
              v-if="canLoginWithJosaId"
              :disabled="loggingIn"
            >
              <div v-if="!currentLoginMethod.josaId">
                {{ t('login.withJosaId') }}
              </div>
              <div v-else class="loader !h-8 !w-8"></div>
            </button>
          </div>

          <div></div>
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
  const currentLoginMethod = reactive({
    github: false,
    josaId: false,
    magicEmail: false,
  })
  
  const loggingIn = computed(() => {
    return currentLoginMethod.github || currentLoginMethod.magicEmail || currentLoginMethod.josaId 
  })

  onMounted(async () => {
    fetch('/api/check-login-methods', {
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
    currentLoginMethod.github = true
    await signIn('github', { callbackUrl: localePath('/dashboard') })
    currentLoginMethod.github = false
  }

  async function loginWithJosaId() {
    currentLoginMethod.josaId = true
    await signIn('authelia', { callbackUrl: localePath('/dashboard') })
    currentLoginMethod.josaId = false
  }

  async function loginWithMagicEmail() {
    currentLoginMethod.magicEmail = true
    await signIn('email', {
      callbackUrl: localePath('/dashboard'),
      email: get(email),
    })
    currentLoginMethod.magicEmail = false
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
  .btn:disabled {
    @apply bg-nuha-grey-100;
  }
  .btn > .loader {
    @apply !border-nuha-fushia-300;
  }
  .login-title {
    @apply text-nuha-grey font-semibold;
  }
  .email-input {
    @apply border border-nuha-grey-100 p-3 mb-2 w-full;
  }
</style>
