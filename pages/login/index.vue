<template>
  <div class="main">
    <div class="inner-container">
      <h2 class="login-title">{{ t('login.header') }}</h2>
      <div class="login-btns">
        <form class="w-full" @submit.stop.prevent="loginWithMagicEmail()">
          <label for="email-input" class="text-xl w-full block text-start">
            {{ $t('login.withMagicEmail') }}
          </label>
          <input
            id="email-input"
            class="email-input"
            type="email"
            required
            v-model="email"
            :placeholder="$t('login.emailPlaceholder')"
          />
          <button type="submit" class="btn" :disabled="loggingIn">
            <div v-if="!currentLoginMethod.magicEmail">
              {{ $t('login.withMagicEmail') }}
            </div>
            <div v-else class="loader !h-8 !w-8"></div>
          </button>
          <p class="text-xl w-full text-start leading-4 mt-2">
            {{ $t('login.emailLoginInfo') }}
          </p>
        </form>

          <div v-if="canLoginWithGithub || canLoginWithJosaId">
            <!-- Divider -->
            <div class="flex items-center justify-center my-3">
              <div class="w-full border-t border-nuha-grey-100"></div>
              <span class="mx-2 text-nuha-grey font-semibold">
                {{ $t('dashboard.or') }}
              </span>
              <div class="w-full border-t border-nuha-grey-100"></div>  
            </div>

            <button
              @click="loginWithGithub"
              class="btn btn-github"
              v-if="canLoginWithGithub"
              :disabled="loggingIn"
            >
            <div class="flex flex-wrap justify-center items-center gap-1">
              <span>{{ t('login.withGithub') }}</span>
              <img
                v-if="!currentLoginMethod.github"
                src="~/assets/icons/mdi_github.svg"
                alt="github"
                class="h-6 w-6 mr-2"
              />
              <div v-else class="loader !border-nuha-white !h-6 !w-6"></div>
            </div>
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
    @apply w-full flex justify-center items-center p-12 max-sm:p-4;
  }
  .inner-container {
    @apply p-10 text-center border rounded-md border-nuha-grey-100;
    @apply max-sm:px-4 max-sm:border-none; 
  }
  .btn {
    @apply w-full p-2 rounded-md bg-nuha-fushia-300 cursor-pointer;
    @apply flex justify-center items-center;
    @apply font-IBMPlexSansArabic text-base text-nuha-white;
    @apply border border-nuha-fushia-300;
    @apply hover:bg-opacity-80  transition-colors duration-200;
    @apply disabled:bg-nuha-grey-300 disabled:border-none disabled:text-white disabled:cursor-not-allowed;
  }
  .btn-github {
    @apply bg-white text-nuha-grey border-nuha-grey-100;
    @apply hover:bg-gray-200;
  }
  .btn-github:disabled  img {
    @apply invert;
  }
  .login-title {
    @apply mb-6 text-nuha-grey font-semibold text-5xl max-sm:text-4xl;
  }
  .email-input {
    @apply border rounded-md border-nuha-grey-100;
    @apply text-2xl text-left p-3 mb-2 w-full;
    @apply placeholder:text-lg rtl:placeholder:text-right;
    direction: ltr;
  }
</style>
