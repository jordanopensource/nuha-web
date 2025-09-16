<template>
  <header class="container py-4">
    <div class="flex lg:grid grid-cols-3">
      <NuxtLink
        class="z-40"
        :to="localePath('/')"
        aria-label="home"
        @click="showMobileMenu = false"
      >
        <img class="select-none max-sm:w-14" width="70" height="70" src="/logo.png" alt="Nuha logo">
      </NuxtLink>

      <!-- Desktop list -->
      <nav class="list hidden lg:flex gap-2 mx-auto">
        <UiButton
          v-for="link, i in getLinksByGroup('desktop-header')"
          :key="i"
          :to="link.path()"
          variant="ghost"
          size="lg"
          class="min-w-fit"
        >
          {{ link.title() }}
        </UiButton>
      </nav>
      
      <!-- Desktop auth section -->
      <div class="list hidden lg:flex items-center gap-2 ms-auto">
        <UiRegionLanguageSelector size="md" mode="language" />

        <AuthState>
          <template #default="{ loggedIn, user, clear }">
            <!-- TODO: replace with user menu -->
            <template v-if="loggedIn">
              <div class="flex items-center gap-2">
                <!-- user info and avatar -->
                <span class="text-sm text-colors-neutral-foreground">
                  {{ user?.name || user?.email }}
                </span>
                <img v-if="user?.avatar" :src="user?.avatar" class="h-6 aspect-square rounded-full" />
                <!-- logout button -->
                <UiButton
                  variant="ghost"
                  size="md"
                  @click="handleLogout(clear)"
                >
                  {{ $t('links.general.logout') }}
                </UiButton>
              </div>
            </template>

            <template v-else>
              <UiButton
                :to="localePath('/login')"
                variant="primary"
                size="md"
              >
                {{ $t('links.general.login') }}
              </UiButton>
            </template>
          </template>
          <template #placeholder>
            <UiButton
              variant="outline"
              size="md"
              disabled
            >
              {{ $t('misc.loading') }}
            </UiButton>
          </template>
        </AuthState>
      </div>

      <!-- Mobile menu control -->
      <UiButton
        class="lg:!hidden z-40 ms-auto justify-end !px-1 aspect-square"
        aria-label="navigation menu"
        variant="ghost"
        @click="showMobileMenu = !showMobileMenu"
      >
        <template #icon>
          <Icon
            :name="showMobileMenu ? 'mdi:close' : 'mdi:menu'"
            :aria-label="$t('misc.close')"
            size="32"
          />
        </template>
      </UiButton>
    </div>
    <!-- Mobile menu & backdrop -->
    <div
      v-if="showMobileMenu"
      class="w-full h-screen start-0 top-0 z-30 absolute bg-colors-neutral-background bg-opacity-20 backdrop-blur-lg border lg:hidden"
      @click="showMobileMenu = false"
    />
    <div v-if="showMobileMenu" class="absolute container z-40 left-0 right-0 ">
      <nav
        class="w-full flex flex-col transition-all gap-y-2.5 p-5 lg:!hidden"
        :class="showMobileMenu ? 'visible opacity-100 duration-200' : 'opacity-0 invisible absolute'"
      >
        <UiButton
          v-for="link, i in getLinksByGroup('desktop-header')"
          :key="i"
          :to="link.path()"
          variant="ghost"
          size="lg"
          class="!font-medium"
          @click="showMobileMenu = false"
        >
          {{ link.title() }}
        </UiButton>

        <UiRegionLanguageSelector size="lg" mode="language" />

        <AuthState>
          <template #default="{ loggedIn, user, clear }">
            <template v-if="loggedIn">
              <div class="flex flex-col gap-2 w-full">
                <div class="text-sm text-colors-neutral-foreground px-4">
                  {{ $t('misc.welcomeUser', { name: user?.name || user?.email }) }}
                </div>
                <UiButton
                  variant="ghost"
                  size="lg"
                  @click="handleLogout(clear)"
                >
                  {{ $t('links.general.logout') }}
                </UiButton>
              </div>
            </template>
            <template v-else>
              <UiButton
                :to="localePath('/login')"
                variant="primary"
                size="lg"
                @click="showMobileMenu = false"
              >
                {{ $t('links.general.login') }}
              </UiButton>
            </template>
          </template>
          <template #placeholder>
            <UiButton
              variant="outline"
              size="lg"
              disabled
            >
              {{ $t('misc.loading') }}
            </UiButton>
          </template>
        </AuthState>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
  const localePath = useLocalePath()
  const { getLinksByGroup } = useLinks()
  const showMobileMenu = ref(false)

  const handleLogout = async (clearSession: () => Promise<void>) => {
    try {
      await clearSession()
      showMobileMenu.value = false
      await navigateTo(localePath('/'))
    } catch (error) {
      console.error('Logout error:', error)
      await navigateTo(localePath('/'))
    }
  }
</script>

<style lang="postcss" scoped></style>
