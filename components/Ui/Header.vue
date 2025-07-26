<template>
  <header class="container py-4">
    <div class="flex justify-between">
      <NuxtLink
        class="z-40"
        :to="localePath('/')"
        aria-label="home"
        @click="showMobileMenu = false"
      >
        <img class="select-none" width="70" height="70" src="/logo.png" alt="Nuha logo">
      </NuxtLink>

      <!-- Desktop list -->
      <div class="list hidden lg:flex">
        <UiButton
          v-for="link, i in getLinksByGroup('desktop-header')"
          :key="i"
          :to="link.path"
          variant="ghost"
          size="lg"
        >
          {{ link.title() }}
        </UiButton>
      </div>
      <!-- TODO: replace this with a user menu when logged-in -->
       <!-- TODO: i18n -->
      <div class="list hidden lg:flex">
        <UiButton
          :to="localePath('/login')"
          variant="primary"
          size="lg"
        >
          Login
        </UiButton>
      </div>

      <!-- Mobile menu control -->
      <UiButton
        class="lg:!hidden z-40 ms-auto"
        aria-label="navigation menu"
        variant="ghost"
        @click="showMobileMenu = !showMobileMenu"
      >
      <!-- TODO: ARIA label i18n -->
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
    <div class="absolute z-40 left-0 right-0 ">
      <div
        class="w-full flex flex-col transition-all gap-y-2.5 p-5 lg:!hidden"
        :class="showMobileMenu ? 'visible opacity-100 duration-200' : 'opacity-0 invisible absolute'"
      >
        <!-- FIXME: hide mobile menu when any button is clicked -->
        <UiButton
          v-for="link, i in getLinksByGroup('desktop-header')"
          :key="i"
          :to="link.path"
          variant="ghost"
          size="lg"
          class="!font-medium"
        >
          {{ link.title() }}
        </UiButton>
        
        <UiButton
          :to="localePath('/login')"
          variant="primary"
          size="lg"
        >
          Login
        </UiButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  const localePath = useLocalePath()
  const { getLinksByGroup } = useLinks()

  const showMobileMenu = ref(false)
</script>

<style lang="postcss" scoped></style>
