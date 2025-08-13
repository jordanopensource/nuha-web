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
        >
          {{ $t('login.emailButton') }}
          <template #icon>
            <Icon
              name="mdi:email-outline"
              size="24"
            />
          </template>
        </ui-button>
        <small class="font-medium">
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
      
      <!-- Terms and Privacy -->
      <small class="font-medium">
        <i18n-t keypath="login.termsText" tag="span">
          <template #termsLink>
            <NuxtLink 
              :to="termsLink.path"
              class="text-colors-primary hover:underline"
            >
              {{ $t('login.termsLink') }}
            </NuxtLink>
          </template>
          <template #privacyLink>
            <NuxtLink 
              :to="privacyLink.path"
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

const email = ref('')

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
const termsLink = infoLinks.find(link => link.path.includes('/terms')) || { path: localePath('/terms') }
const privacyLink = infoLinks.find(link => link.path.includes('/privacy')) || { path: localePath('/privacy') }

// Sample data for placeholder responses
// TODO: replace with auth logic
const sampleUserData = {
  id: '12345',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: 'https://github.com/github.png',
  provider: 'email'
}

const sampleGithubData = {
  id: '67890',
  email: 'user@github.com',
  name: 'GitHub User',
  username: 'githubuser',
  avatar: 'https://github.com/githubuser.png',
  provider: 'github'
}

// Handle email login
const handleEmailLogin = () => {
  clearMessages()
  
  if (!email.value || !isValidEmail.value) {
    messages.error.text = t('login.messages.invalidEmail')
    messages.error.show = true
    return
  }

  try {
    // TODO: Replace with auth logic for magic link
    const emailLoginData = {
      ...sampleUserData,
      email: email.value
    }
    console.log('Email login initiated - sample response:', emailLoginData)
    
    // Simulate successful login for now
    setTimeout(() => {
      messages.success.text = t('login.messages.emailSent', { email: email.value })
      messages.success.show = true
    }, 500)
  } catch (error) {
    messages.error.text = t('login.messages.emailError')
    messages.error.show = true
    console.error('Email login error:', error)
  }
}

// Handle GitHub login
const handleGithubLogin = () => {
  clearMessages()
  
  try {
    // TODO: Replace with actual GitHub OAuth flow
    console.log('GitHub login initiated - sample response:', sampleGithubData)
    
    // Simulate successful login for now
    setTimeout(() => {
      messages.success.text = t('login.messages.githubSuccess')
      messages.success.show = true
    }, 500)
  } catch (error) {
    messages.error.text = t('login.messages.githubError')
    messages.error.show = true
    console.error('GitHub login error:', error)
  }
}
</script>

<style lang="postcss" scoped>
</style>