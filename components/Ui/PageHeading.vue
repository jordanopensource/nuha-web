<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start my-5">
    <div class="title-section h-full">
      <template v-if="title">
        <h1 v-if="useH1" class="title">{{ title }}</h1>
        <h2 v-else class="title">{{ title }}</h2>
      </template>
      <slot name="title" />
    </div>
    <div v-if="subtitle || $slots.subtitle" class="subtitle-section">
      <slot name="subtitle">
        <p v-if="subtitle" class="subtitle font-LTZarid text-2xl">{{ subtitle }}</p>
      </slot>
    </div>
    <slot name="second-col" />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title?: string
  subtitle?: string
  useH1?: boolean
}

defineProps<Props>()
</script>

<style scoped lang="postcss"></style>