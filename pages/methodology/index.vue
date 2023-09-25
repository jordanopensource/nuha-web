<template>
  <div>
    <div class="container">
      <!-- TODO: Add AppHeader to default layout project-wide -->
      <UiAppHeader
        class="mb-10"
      />
    </div>
    <MethodologyHero />
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ auth: false })
</script>

<style lang="postcss" scoped></style>
