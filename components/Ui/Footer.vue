<template>
  <footer class="bg-colors-primary-light mt-auto">
    <div
      class="container grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 pb-24 max-md:px-8 max-md:flex flex-col"
    >
      <div class="flex-col gap-4 col-span-1 hidden md:flex">
        <NuxtLink :to="$nuxt.$localePath('/')">
          <img width="75" height="75" src="/logo.png" alt="Nuha logo">
        </NuxtLink>
        <div>
          <h3>Nuha نهى</h3>
          <small>
            {{ $t('links.footer.copyright') }}
          </small>
        </div>
      </div>
      <nav class="flex flex-col md:items-center gap-4 col-span-1">
        <NuxtLink
          v-for="(link, i) in projectLinks"
          :key="i"
          class="max-md:min-w-max text-base hover:underline"
          :to="$nuxt.$localePath(link.path)"
          :external="link.external"
          :target="link.external ? '_blank' : '_self'"
        >
          {{ link.title() }}
        </NuxtLink>
      </nav>
      <div class="flex flex-col gap-4 col-span-1">
        <nav class="flex flex-col gap-4 md:items-end">
          <NuxtLink
            v-for="(link, i) in infoLinks"
            :key="i"
            class="max-md:min-w-max text-base hover:underline"
            :to="$nuxt.$localePath(link.path)"
            :external="link.external"
            :target="link.external ? '_blank' : '_self'"
          >
            {{ link.title() }}
          </NuxtLink>
        </nav>
        <nav class="flex flex-row gap-4 md:justify-end">
          <NuxtLink
            v-for="(link, i) in socialLinks"
            :key="i"
            class="hover:scale-105 transition-all hover:text-colors-primary-hover"
            :to="link.path"
            :external="link.external"
            :target="link.external ? '_blank' : '_self'"
          >
            <Icon v-if="link.icon" :name="link.icon" size="32" />
          </NuxtLink>
        </nav>
      </div>
      <div class="flex flex-col gap-4 col-span-1 md:hidden">
        <NuxtLink :to="$nuxt.$localePath('/')">
          <img width="75" height="75" src="/logo.png" alt="Nuha logo" />
        </NuxtLink>
        <div> 
          <h3>Nuha نهى</h3>
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
