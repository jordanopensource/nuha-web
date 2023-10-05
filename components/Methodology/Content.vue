<template>
  <div class="grid lg:grid-cols-3">
    <!-- Table of content -->
    <nav class="hidden lg:flex flex-col gap-y-4">
      <span class="text-lg">{{ $t('methodology.content') }}</span>
      <NuxtLink
        v-for="(section, i) in sections"
        :key="section.id"
        :to="`#${section.id}`"
        class="text-nuha-grey-200 hover:text-nuha-grey transition-colors"
        :class="{ '!text-nuha-grey': activeSection === sections[i].id }"
        @click="activeSection = sections[i].id"
      >
        {{ section.title }}
      </NuxtLink>
    </nav>
    <div class="lg:col-span-2 w-full">
      <div
        v-for="(section, i) in sections"
        :key="section.id"
        :id="`${i}`"
        :class="i > 0 && i < sections.length - 1 ? 'border-separator' : ''"
      >
        <h2 class="block lg:hidden" @click="activeSection = section.id">
          <i class="arrow down" v-if="section.id !== activeSection"></i>
          {{ section.title }}
        </h2>

        <section v-if="activeSection === section.id" :id="section.id">
          <MethodologySectionAbout v-if="section.id === 'about'" />
          <MethodologySectionDetails v-if="section.id === 'details'" />
          <MethodologySectionEthics v-if="section.id === 'ethics'" />
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const route = useRoute()
  const { t } = useI18n()

  const activeSection = ref<string | null>(null)
  const sections: {
    id: string
    title: string
  }[] = [
    {
      id: 'about',
      title: computed(() => t('methodology.sections.about.title')).value,
    },
    {
      id: 'details',
      title: computed(() => t('methodology.sections.detailed.title')).value,
    },
    {
      id: 'ethics',
      title: computed(() => t('methodology.sections.ethics.title')).value,
    },
  ]

  onMounted(() => {
    activeSection.value = route.hash
      ? route.hash.replace('#', '')
      : sections[0].id
    console.log(activeSection.value)
  })
</script>

<style lang="postcss" scoped>
  .border-separator {
    @apply border-y-2 border-[#a066a9] py-10 my-10 lg:border-none lg:py-0 lg:my-0;
  }
  .arrow {
    @apply border-solid border-[#a066a9];
    border-width: 0 3px 3px 0;
    @apply inline-block;
    @apply mx-3 mb-2 p-2;
  }

  .down {
    @apply rotate-45;
  }
</style>
