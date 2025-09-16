<template>
  <header class="container py-4">
    <div class="flex lg:grid grid-cols-3">
      <NuxtLink
        class="z-40 me-auto"
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
        <AuthState>
          <template #default="{ loggedIn, user }">
            <template v-if="loggedIn">
              <UiUserMenu :user="user" size="md" />
            </template>
            <template v-else>
              <UiRegionLanguageSelector size="md" mode="language" />
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
      <AuthState>
        <template #default="{ loggedIn, user }">
          <template v-if="loggedIn">
            <UiUserMenu class="lg:!hidden my-auto" :user="user" size="sm" />
          </template>
        </template>
      </AuthState>
      <UiButton
        class="lg:!hidden z-40 justify-end !px-1 aspect-square"
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
          <template #default="{ loggedIn }">
            <template v-if="!loggedIn">
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
</script>

<style lang="postcss" scoped></style>
