<template>
  <footer class="mt-auto bg-colors-primary-light print:hidden">
    <div
      class="container grid grid-cols-1 flex-col gap-8 pb-24 pt-16 max-md:flex max-md:px-8 md:grid-cols-3"
    >
      <div class="col-span-1 hidden flex-col gap-4 md:flex">
        <NuxtLink :to="$nuxt.$localePath('/')">
          <img width="86" src="/logo.png" alt="Nuha logo" />
        </NuxtLink>
        <div class="mt-auto">
          <h3 class="!font-bold">Nuha نهى</h3>
          <small>
            {{ $t('links.footer.copyright') }}
          </small>
        </div>
      </div>
      <nav
        class="col-span-1 flex w-max flex-col gap-4 md:mx-auto md:items-center"
      >
        <NuxtLink
          v-for="(link, i) in projectLinks"
          :key="i"
          class="w-full text-base hover:underline max-md:min-w-max md:text-center"
          :to="link.path()"
          :external="link.external"
          :target="link.external ? '_blank' : '_self'"
        >
          {{ link.title() }}
        </NuxtLink>
        <UiRegionLanguageSelector
          size="md"
          class="hover:underline [&_button.lang-btn]:!px-0 [&_button.lang-btn]:max-md:!justify-start"
          button-variant="ghost"
          show-flag-in-button
        />
      </nav>
      <div class="col-span-1 flex flex-col gap-4 max-md:gap-8">
        <nav class="flex flex-col gap-4 md:items-end">
          <NuxtLink
            v-for="(link, i) in infoLinks"
            :key="i"
            class="text-base hover:underline max-md:min-w-max md:text-end"
            :to="link.path()"
            :external="link.external"
            :target="link.external ? '_blank' : '_self'"
          >
            {{ link.title() }}
          </NuxtLink>
        </nav>
        <nav class="flex flex-row gap-4 md:justify-end">
          <UiButton
            v-for="(link, i) in socialLinks"
            :key="i"
            class="!p-0 transition-all hover:scale-105"
            :to="link.path()"
            :external="link.external"
            :target="link.external ? '_blank' : '_self'"
            :aria-label="link.title()"
            variant="ghost"
          >
            <Icon v-if="link.icon" :name="link.icon" size="32" />
          </UiButton>
        </nav>
      </div>
      <div class="col-span-1 flex flex-col gap-4 md:hidden">
        <NuxtLink :to="$nuxt.$localePath('/')">
          <img width="75" height="75" src="/logo.png" alt="Nuha logo" />
        </NuxtLink>
        <div>
          <h3 class="!font-bold">Nuha نهى</h3>
          <small>
            {{ $t('links.footer.copyright') }}
          </small>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  const { getLinksByGroup } = useLinks()
  const projectLinks = getLinksByGroup('footer').filter(
    (l) => !l.groups?.includes('social') && !l.groups?.includes('info')
  )
  const infoLinks = getLinksByGroup('info')
  const socialLinks = getLinksByGroup('social')
</script>

<style scoped lang="postcss"></style>
