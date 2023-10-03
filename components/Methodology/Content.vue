<template>
  <div class="container grid lg:grid-cols-3">
    <!-- Table of content -->
    <nav class="hidden lg:flex flex-col gap-4">
      <span class="text-lg">Content</span> <!-- TODO: i18n -->
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

    <!-- Section 1 -->
    <section
      v-if="activeSection === sections[0].id"
      class="container lg:col-span-2"
      :id="sections[0].id"
    >
      section 1
    </section>

    <!-- Section 2 -->
    <section
      v-if="activeSection === sections[1].id"
      class="container lg:col-span-2"
      :id="sections[1].id"
    >
      section 2
    </section>

     <!-- Section 3 -->
     <section
      v-if="activeSection === sections[2].id"
      class="container lg:col-span-2"
      :id="sections[2].id"
    >
      section 3
    </section>
  </div>
</template>

<script lang="ts" setup>
  const route = useRoute()
  const activeSection = ref<string | null>(null)
  // TODO: i18n
  const sections: {
    id: string
    title: string
  }[] = [
    {
      id: 'about',
      title: 'About this project',
    },
    {
      id: 'detailed',
      title: 'Detailed Methodology',
    },
    {
      id: 'ethics',
      title: 'Ethical Considerations',
    },
  ]

  onMounted(() => {
    activeSection.value = route.hash ? route.hash.replace('#', '') : sections[0].id
    console.log(activeSection.value);
    
  })
</script>

<style lang="postcss" scoped></style>
