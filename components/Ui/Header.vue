<template>
  <header class="container py-4">
    <div class="flex">
      <NuxtLink
        class="z-40 me-auto"
        :to="localePath('/')"
        aria-label="home"
        @click="showMobileMenu = false"
      >
        <img
          class="select-none max-sm:w-14"
          width="70"
          height="70"
          src="/logo.png"
          alt="Nuha logo"
        />
      </NuxtLink>

      <!-- Desktop list -->
      <nav class="list me-4 ms-auto hidden gap-2 lg:flex print:hidden">
        <AuthState>
          <template #default="{ loggedIn }">
            <UiButton
              v-for="(link, i) in getLinksByGroup('desktop-header')"
              :key="i"
              :to="link.path()"
              :variant="
                loggedIn && link.path().includes('analyze')
                  ? 'primary'
                  : 'ghost'
              "
              :size="loggedIn && link.path().includes('analyze') ? 'md' : 'lg'"
              class="min-w-fit"
              :class="{
                '!font-semibold': loggedIn && link.path().includes('analyze'),
              }"
            >
              {{ link.title() }}
            </UiButton>
          </template>
          <template #placeholder>
            <UiButton
              v-for="(link, i) in getLinksByGroup('desktop-header')"
              :key="i"
              :to="link.path()"
              variant="ghost"
              size="lg"
              class="min-w-fit"
            >
              {{ link.title() }}
            </UiButton>
          </template>
        </AuthState>
      </nav>

      <!-- Desktop auth section -->
      <div class="list hidden items-center gap-2 lg:flex print:hidden">
        <AuthState>
          <template #default="{ loggedIn, user }">
            <template v-if="loggedIn">
              <UiUserMenu :user="user" size="md" />
            </template>
            <template v-else>
              <UiRegionLanguageSelector size="md" mode="language" />
              <UiButton :to="localePath('/login')" variant="primary" size="md">
                {{ $t('links.general.login') }}
              </UiButton>
            </template>
          </template>
          <template #placeholder>
            <UiButton variant="outline" size="md" disabled>
              {{ $t('misc.loading') }}
            </UiButton>
          </template>
        </AuthState>
      </div>

      <!-- Mobile menu control & user menu -->
      <AuthState>
        <template #default="{ loggedIn, user }">
          <template v-if="loggedIn">
            <UiUserMenu
              class="z-40 my-auto lg:!hidden print:hidden"
              :user="user"
              size="sm"
            />
          </template>
        </template>
      </AuthState>
      <UiButton
        class="z-40 aspect-square justify-end !px-1 lg:!hidden print:!hidden"
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
    <Transition name="menu-dropdown">
      <div
        v-if="showMobileMenu"
        class="absolute start-0 top-0 z-30 h-screen w-full border bg-colors-neutral-background bg-opacity-20 backdrop-blur-xl lg:hidden"
        @click="showMobileMenu = false"
      />
    </Transition>
    <Transition name="menu-items-dropdown">
      <div
        v-if="showMobileMenu"
        class="container absolute left-0 right-0 z-40 print:hidden"
      >
        <nav
          class="flex w-full flex-col gap-y-2.5 p-5 transition-all lg:!hidden"
          :class="
            showMobileMenu
              ? 'visible opacity-100 duration-200'
              : 'invisible absolute opacity-0'
          "
        >
          <UiButton
            v-for="(link, i) in getLinksByGroup('desktop-header')"
            :key="i"
            :to="link.path()"
            variant="ghost"
            size="lg"
            class="border border-colors-neutral-placeholder border-opacity-0 !font-medium hover:border-opacity-20"
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
              <UiButton variant="outline" size="lg" disabled>
                {{ $t('misc.loading') }}
              </UiButton>
            </template>
          </AuthState>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
  const localePath = useLocalePath()
  const { getLinksByGroup } = useLinks()
  const showMobileMenu = ref(false)
</script>

<style>
  .menu-dropdown-enter-active,
  .menu-items-dropdown-enter-active {
    transition: all 200ms ease-out;
  }
  .menu-dropdown-leave-active,
  .menu-items-dropdown-leave-active {
    transition: all 200ms ease-in;
  }

  .menu-dropdown-enter-from,
  .menu-items-dropdown-enter-from {
    transform: translateY(-100%);
  }
  .menu-dropdown-enter-to {
    transform: translateY(0px);
  }
  .menu-dropdown-leave-from {
    transform: translateY(0px);
  }
  .menu-dropdown-leave-to,
  .menu-items-dropdown-leave-to {
    transform: translateY(-100%);
  }

  .menu-items-dropdown-enter-to {
    transform: translateY(2px);
  }
  .menu-items-dropdown-leave-from {
    transform: translateY(2px);
  }
</style>
