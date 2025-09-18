<template>
  <div>
    <!-- User Avatar Button -->
    <UiButton
      type="button"
      variant="ghost"
      class="!p-0 aspect-square"
      :class="size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'"
      :aria-label="$t('misc.userMenu')"
      @click="isOpen = true"
    >
      <template #icon>
        <img 
          v-if="user?.avatar" 
          :src="user.avatar" 
          :alt="user.name || user.email"
          class="h-full w-full rounded-full object-cover border-2 border-colors-primary-light"
        >
        <Icon
          v-else
          name="mdi:account-circle-outline" 
          :size="size === 'sm' ? 32 : 40"
          class="text-colors-primary"
        />
      </template>
    </UiButton>

    <UiModal 
      v-model="isOpen" 
      :title="$t('misc.userMenu')"
      size="sm"
      :show-footer="false"
    >
      <div class="flex flex-col gap-4 p-4">
        <!-- User info section -->
        <div class="flex items-center gap-3 pb-3 border-b border-colors-neutral-border">
          <div class="h-12 w-12 flex-shrink-0">
            <img 
              v-if="user?.avatar" 
              :src="user.avatar" 
              :alt="user?.name || user?.email"
              class="h-full w-full rounded-full object-cover"
            >
            <Icon 
              v-else
              name="mdi:account-circle" 
              size="48"
              class="text-colors-primary"
            />
          </div>
          <div class="flex flex-col gap-1 min-w-0 flex-1">
            <div 
              v-if="user?.name" 
              class="font-medium font-IBMPlexSansArabic text-colors-neutral-foreground truncate"
            >
              {{ user.name }}
            </div>
            <div class="text-sm truncate" :class="{'font-medium': !user?.name}">
              {{ user?.email }}
            </div>
            <small class="text-xs text-colors-neutral-placeholder capitalize">
              {{ $t(`login.provider.${user?.provider || 'email'}`) }}
            </small>
          </div>
        </div>

        <!-- Actions section -->
        <div class="flex flex-col gap-2">
          <UiRegionLanguageSelector
            class="w-full"
            size="md"
            mode="language"
          />
          <UiButton
            variant="ghost"
            size="lg"
            class="justify-start"
            @click="handleLogout"
          >
            <template #icon>
              <Icon name="mdi:logout" size="20" />
            </template>
            {{ $t('links.general.logout') }}
          </UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { User } from '#auth-utils'
interface Props {
  user?: User | null
  size?: 'sm' | 'md'
}

withDefaults(defineProps<Props>(), {
  user: null,
  size: 'md'
})

const { clear } = useUserSession()
const localePath = useLocalePath()

const isOpen = ref(false)

const handleLogout = async () => {
  try {
    await clear()
    isOpen.value = false
    await navigateTo(localePath('/'))
  } catch (error) {
    console.error('Logout error:', error)
    await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    reloadNuxtApp()
  }
}
</script>
