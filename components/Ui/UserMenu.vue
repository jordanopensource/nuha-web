<template>
  <div>
    <!-- User Avatar Button -->
    <UiButton
      type="button"
      variant="ghost"
      class="aspect-square !p-0"
      :class="size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'"
      :aria-label="$t('misc.userMenu')"
      @click="isOpen = true"
    >
      <template #icon>
        <img
          v-if="user?.avatar && !imgError"
          :src="user.avatar"
          :alt="user.name || user.email"
          class="h-full w-full rounded-full border-2 border-colors-primary-light object-cover"
          @error="handleAvatarError"
        />
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
        <div
          class="border-colors-neutral-border flex items-center gap-3 border-b pb-3"
        >
          <div class="h-12 w-12 flex-shrink-0">
            <img
              v-if="user?.avatar && !imgError"
              :src="user.avatar"
              :alt="user?.name || user?.email"
              class="h-full w-full rounded-full object-cover"
              @error="handleAvatarError"
            />
            <Icon
              v-else
              name="mdi:account-circle"
              size="48"
              class="text-colors-primary"
            />
          </div>
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <div
              v-if="user?.name"
              class="truncate font-IBMPlexSansArabic font-medium text-colors-neutral-foreground"
            >
              {{ user.name }}
            </div>
            <div
              class="truncate text-sm"
              :class="{ 'font-medium': !user?.name }"
            >
              {{ user?.email }}
            </div>
            <small class="text-xs capitalize text-colors-neutral-placeholder">
              {{ $t(`login.provider.${user?.provider || 'email'}`) }}
            </small>
          </div>
        </div>

        <!-- Actions section -->
        <div class="flex flex-col gap-2">
          <UiRegionLanguageSelector class="w-full" size="md" mode="language" />
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
    size: 'md',
  })

  const imgError = ref(false)
  const { clear } = useUserSession()
  const localePath = useLocalePath()

  const isOpen = ref(false)

  const handleAvatarError = (_event: Event) => {
    imgError.value = true
  }

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
