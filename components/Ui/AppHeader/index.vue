<template>
  <header>
    <div class="lg:hidden">
      <UiAppHeaderMobile :logo-color="props.logoColor" />
    </div>
    <div class="hidden lg:block"><UiAppHeaderDesktop /></div>
  </header>
</template>
<script setup>
  const props = defineProps({
    logoColor: {
      type: String,
      default: 'default',
    },
  })
</script>
