<template>
  <div class="page-container">
    <UiPageHeading 
      :title="$t('login.title')"
      use-h1
      class="!flex mx-auto"
    />

    <div class="flex flex-col w-full max-w-2xl mx-auto gap-4 border border-colors-primary-light rounded-md p-4 lg:px-8 bg-white">
      <!-- Messages -->
      <UiMessage
        v-if="messages.success.show && messages.success.text"
        type="success"
        :message="messages.success.text"
      />
      <UiMessage
        v-if="messages.error.show && messages.error.text"
        type="error"
        :message="messages.error.text"
        show-close-button
        @close="messages.error.show = false"
      />

      <!-- Email login -->
      <form class="flex flex-col gap-2" @submit.prevent="handleEmailLogin">
        <div class="flex flex-col gap-2">
          <label 
            for="email-input" 
            class="text-sm font-medium text-colors-neutral-foreground"
          >
            {{ $t('login.emailLabel') }}
          </label>
          <input
            id="email-input"
            v-model="email"
            type="email"
            :placeholder="$t('login.emailPlaceholder')"
            class="bg-colors-neutral-background bg-opacity-85 placeholder:rtl:text-right"
            required
            dir="ltr"
            @input="clearMessages()"
          >
        </div>
        <ui-button
          size="lg"
          variant="primary"
          class="w-full"
          type="submit"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
            {{ $t('login.sending') }}
          </template>
          <template v-else>
            {{ $t('login.emailButton') }}
          </template>
        </ui-button>
        <small>
          {{ $t('login.emailDescription') }}
        </small>
      </form>
      
      <!-- Divider -->
        <!-- TODO: make divider a separate component -->
      <div class="flex items-center gap-4 my-2">
        <hr class="flex-1 border-colors-neutral-placeholder opacity-30">
        <small class="font-medium">{{ $t('misc.or', 'or') }}</small>
        <hr class="flex-1 border-colors-neutral-placeholder opacity-30">
      </div>
      
      <div class="flex gap-2 max-sm:flex-col">
        <!-- Google login option -->
        <ui-button
          size="lg"
          variant="outline"
          class="w-full"
          type="button"
          @click="handleGoogleLogin"
        >
          {{ $t('login.googleButton') }}
          <template #icon>
            <Icon
              name="mdi:google"
              size="24"
            />
          </template>
        </ui-button>

        <!-- GitHub login option -->
        <ui-button
          size="lg"
          variant="outline"
          class="w-full"
          type="button"
          @click="handleGithubLogin"
        >
          {{ $t('login.githubButton') }}
          <template #icon>
            <Icon
              name="mdi:github"
              size="24"
            />
          </template>
        </ui-button>
      </div>
      
      <!-- Terms and Privacy -->
      <small>
        <i18n-t keypath="login.termsText" tag="span">
          <template #termsLink>
            <NuxtLink 
              :to="termsLink.path()"
              class="text-colors-primary hover:underline"
            >
              {{ $t('login.termsLink') }}
            </NuxtLink>
          </template>
          <template #privacyLink>
            <NuxtLink 
              :to="privacyLink.path()"
              class="text-colors-primary hover:underline"
            >
              {{ $t('login.privacyLink') }}
            </NuxtLink>
          </template>
        </i18n-t>
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getLinksByGroup } = useLinks()
const localePath = useLocalePath()
const { t } = useI18n()
const route = useRoute()
const { loggedIn } = useUserSession()

useHead({
  title: () => $t('login.title')
})


const email = ref('')
const isLoading = ref(false)

// Redirect if already logged in
// TODO: replace this with a middleware to prevent rendering the login page altogether when already logged in
watch(loggedIn, (newLoggedIn) => {
  if (newLoggedIn) {
    const returnTo = route.query.returnTo as string || '/analyze'
    navigateTo(returnTo)
  }
})

// Check for initial login state
onMounted(() => {
  if (loggedIn.value) {
    const returnTo = route.query.returnTo as string || '/analyze'
    navigateTo(returnTo)
  }
})

const messages = reactive({
  success: {
    show: false,
    text: '',
  },
  error: {
    show: false,
    text: '',
  },
})

// Check for URL error parameters
onMounted(() => {
  const error = route.query.error as string
  if (error) {
    messages.error.text = getErrorMessage(error)
    messages.error.show = true
  }
})

const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'github_oauth_failed':
      return t('login.messages.githubError')
    case 'google_oauth_failed':
      return t('login.messages.googleError')
    case 'authentication_failed':
      return t('login.messages.authError')
    case 'Invalid or expired magic link':
      return t('login.messages.expiredMagicLink')
    default:
      return t('login.messages.genericError')
  }
}

const clearMessages = () => {
  messages.success.text = ''
  messages.error.text = ''
  messages.success.show = false
  messages.error.show = false
}

// Email validation
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

// Get terms and privacy links with fallbacks
const infoLinks = getLinksByGroup('info')
const termsLink = infoLinks.find(link => link.path().includes('/terms')) || { path: () => localePath('/terms') }
const privacyLink = infoLinks.find(link => link.path().includes('/privacy')) || { path: () => localePath('/privacy') }

const handleEmailLogin = async () => {
  clearMessages()
  
  if (!email.value || !isValidEmail.value) {
    messages.error.text = t('login.messages.invalidEmail')
    messages.error.show = true
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch('/api/auth/magic-link/send', {
      method: 'POST',
      body: {
        email: email.value
      }
    })
    
    if (response.success) {
      messages.success.text = t('login.messages.emailSent', { email: email.value })
      messages.success.show = true
      email.value = '' // Clear the email field
    }
  } catch (error) {
    console.error('Email login error:', error)
    messages.error.text = t('login.messages.emailError')
    messages.error.show = true
  } finally {
    isLoading.value = false
  }
}

const handleGithubLogin = () => {
  clearMessages()
  
  try {
    // Store return URL in sessionStorage before redirecting
    const returnTo = route.query.returnTo as string || '/analyze'
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('auth_return_to', returnTo)
    }
    
    // Redirect to GitHub OAuth
    navigateTo('/auth/github', { external: true })
  } catch (error) {
    messages.error.text = t('login.messages.githubError')
    messages.error.show = true
    console.error('GitHub login error:', error)
  }
}

const handleGoogleLogin = () => {
  clearMessages()
  
  try {
    // Store return URL in sessionStorage before redirecting
    const returnTo = route.query.returnTo as string || '/analyze'
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('auth_return_to', returnTo)
    }
    
    // Redirect to Google OAuth
    navigateTo('/auth/google', { external: true })
  } catch (error) {
    messages.error.text = t('login.messages.googleError')
    messages.error.show = true
    console.error('Google login error:', error)
  }
}
</script>

<style lang="postcss" scoped>
</style>