<template>
  <div class="main container my-24 flex flex-col gap-y-10">
    <FindingsHero />
    <div class="grid md:grid-cols-2 lg:grid-cols-4">
      <nav v-if="sections.length" class="hidden lg:flex flex-col gap-y-4 w-1/4">
        <span class="text-xl">{{ t('methodology.content') }}</span>
        <button
          v-for="(section, i) in sections"
          :key="section.target"
          class="text-nuha-grey-200 hover:text-nuha-grey transition-colors text-left"
          :class="{ '!text-nuha-grey': activeSection === section.target }"
          @click="
            () => {
              activeSection = section.target
              router.push(
                router.currentRoute.value.fullPath.substring(
                  0,
                  router.currentRoute.value.fullPath.indexOf('#'),
                ) +
                  '#' +
                  section.target,
              )
            }
          "
        >
          {{ section.title }}
        </button>
      </nav>

      <section class="lg:col-span-3">
        <ContentDoc />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ auth: false })

  const { t, locale } = useI18n()
  const router = useRouter()
  const activeSection = ref('')

  const findingName = router.currentRoute.value.fullPath.substring(
    router.currentRoute.value.fullPath.lastIndexOf('/') + 1,
    !!router.currentRoute.value.hash
      ? router.currentRoute.value.fullPath.lastIndexOf('#')
      : undefined,
  )

  const { data } = await useAsyncData(() => {
    return locale.value === 'en'
      ? queryContent(`/findings/${findingName}`).find()
      : queryContent(`/ar/findings/${findingName}`).find()
  })

  const sections = ref(
    !!data.value && !!data.value[0] && !!data.value[0].body
      ? data
          .value![0].body?.children.filter(
            (element) =>
              element.tag?.startsWith('h') &&
              element.props &&
              element.props['id'] &&
              element.children &&
              element.children.length > 0 &&
              element.children![0].value,
          )
          .map((element) => {
            return {
              target: element.props!['id'],
              title: element.children![0].value,
            }
          })
      : [],
  )

  onMounted(() => {
    if (router.currentRoute.value.fullPath.endsWith('findings')) {
      router.push(`${router.currentRoute.value.fullPath}/about`)
    }
  })
</script>

<style lang="postcss" scoped>
  .main {
    .findings-border {
      @apply border-b-2 border-[#a066a9] pb-16;
    }
  }
</style>
