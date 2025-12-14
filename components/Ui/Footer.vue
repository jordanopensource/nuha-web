<template>
  <footer class="bg-colors-primary-light mt-auto print:hidden">
    <div
      class="container grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 pb-24 max-md:px-8 max-md:flex flex-col"
    >
      <div class="flex-col gap-4 col-span-1 hidden md:flex">
        <NuxtLink :to="$nuxt.$localePath('/')">
          <img width="86" src="/logo.png" alt="Nuha logo">
        </NuxtLink>
        <div class="mt-auto">
          <h3 class="!font-bold">Nuha نهى</h3>
          <small>
            {{ $t('links.footer.copyright') }}
          </small>
        </div>
      </div>
      <nav class="flex flex-col md:items-center gap-4 col-span-1 w-max md:mx-auto">
        <NuxtLink
          v-for="(link, i) in projectLinks"
          :key="i"
          class="w-full max-md:min-w-max text-base md:text-center hover:underline"
          :to="link.path()"
          :external="link.external"
          :target="link.external ? '_blank' : '_self'"
        >
          {{ link.title() }}
        </NuxtLink>
        <UiRegionLanguageSelector
          size="md"
          class="[&_button.lang-btn]:!px-0 [&_button.lang-btn]:max-md:!justify-start hover:underline"
          button-variant="ghost"
          show-flag-in-button
        />
      </nav>
      <div class="flex flex-col gap-4 max-md:gap-8 col-span-1">
        <nav class="flex flex-col gap-4 md:items-end">
          <NuxtLink
            v-for="(link, i) in infoLinks"
            :key="i"
            class="max-md:min-w-max text-base hover:underline md:text-end"
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
            class="!p-0 hover:scale-105 transition-all"
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
      <div class="flex flex-col gap-4 col-span-1 md:hidden">
        <NuxtLink :to="$nuxt.$localePath('/')">
          <img width="75" height="75" src="/logo.png" alt="Nuha logo">
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
  const projectLinks = getLinksByGroup('footer').filter(l => 
    !l.groups?.includes('social') && !l.groups?.includes('info')
  )
  const infoLinks = getLinksByGroup('info')
  const socialLinks = getLinksByGroup('social')
</script>

<style scoped lang="postcss">
</style>
