<template>
  <main>
    <section class="container">
      <DashboardHero />
      <DashboardUpload />
    </section>
  </main>
</template>

<script setup lang="ts">
  definePageMeta({ auth: true, callbackUrl: '/login' })
</script>

