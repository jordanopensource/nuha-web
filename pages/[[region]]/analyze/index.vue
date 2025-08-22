<template>
  <div class="page-container">
    <UiPageHeading 
      :title="$t('analyze.page.title')"
      use-h1
      :subtitle="$t('analyze.page.subtitle')" 
    />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start my-5">
      <analyze-form />
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
