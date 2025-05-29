<template>
  <div class="main">
    <div v-if="!currentLoginMethod.magicEmail" class="inner-container">
      <h2 class="login-title">{{ t('login.header') }}</h2>
      <div class="login-btns">
        <form class="w-full" @submit.stop.prevent="loginWithMagicEmail()">
          <label for="email-input" class="text-xl w-full block text-start">
            {{ $t('login.withMagicEmail') }}
          </label>
          <input
            id="email-input"
            class="email-input placeholder:select-none"
            type="email"
            required
            v-model="email"
            :placeholder="$t('login.emailPlaceholder')"
          />
          <UiButton
            :loading="currentLoginMethod.magicEmail"
            :disabled="loggingIn"
            size="md"
            class="w-full"
            type="submit"
          >
            {{ $t('login.withMagicEmail') }}
          </UiButton>
          <div class="text-xl w-full text-start mt-2">
            {{ $t('login.emailLoginInfo') }}
          </div>
        </form>

        <div class="flex flex-col gap-2" v-if="canLoginWithGithub || canLoginWithJosaId">
          <!-- Divider -->
          <div class="flex items-center justify-center my-3">
            <div class="w-full border-t border-nuha-grey-100"></div>
            <span class="mx-2 text-nuha-grey font-semibold">
              {{ $t('dashboard.or') }}
            </span>
            <div class="w-full border-t border-nuha-grey-100"></div>  
          </div>

          <UiButton
            v-if="canLoginWithJosaId"
            @click="loginWithJosaId"
            :disabled="loggingIn"
            :loading="currentLoginMethod.josaId"
            variant="outline"
            class="w-full"
            size="md"
          >
            {{ t('login.withJosaId') }}
          </UiButton>

          <UiButton
            @click="loginWithGithub"
            class="w-full bg-white !text-black !border-black"
            variant="outline"
            v-if="canLoginWithGithub"
            :loading="currentLoginMethod.github"
          >
            <span>{{ t('login.withGithub') }}</span>
            <template #icon>
              <SvgoIconsMdiGithub class="h-6 w-6 mr-2 select-none" />
            </template>
          </UiButton>
        </div>

        <div class="legal-info">
          {{ t('login.legalInfo') }}
          <NuxtLink to="/privacy">{{ t('login.privacyPolicy') }}</NuxtLink>
          {{ t('login.and') }}
          <NuxtLink to="/terms">{{ t('login.termsOfService') }}</NuxtLink>.
        </div>
      </div>
    </div>
    <div v-else class="inner-container mail-sent">
      <h2 class="text-3xl font-semibold text-nuha-grey mb-4">
        {{ t('login.emailLoginSentTitle') }}
      </h2>
      <p class="text-xl text-nuha-grey">
        {{ t('login.emailLoginSentInfo') }}
      </p>
      <UiButton
        @click="currentLoginMethod.magicEmail = false"
        variant="outline"
        class="w-full mt-4"
      >
        {{t('login.backToLogin')}}
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' },
  })
  import { get, set } from '@vueuse/core'

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
      redirect: false,
      email: get(email),
    })
  }
</script>

<style lang="postcss" scoped>
  .main {
    @apply w-full flex justify-center items-center p-12 max-sm:p-4;
  }
  .inner-container {
    @apply p-10 text-center border rounded-md border-nuha-grey-100 sm:shadow-lg;
    @apply max-sm:px-4 max-sm:border-none;
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
  .legal-info {
    @apply text-xl mt-2 text-start;
  }
  .legal-info a {
    @apply text-xl text-nuha-fushia hover:underline font-LTZarid;
  }
</style>
