<template>
  <div
    class="findings-border flex flex-col gap-y-14 items-center justify-center"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <h1>{{ title ? title : t('findings.title') }}</h1>
      <p class="text-4xl">
        {{ description ? description : t('findings.description') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const { t } = useI18n()
  defineProps({
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  })
</script>

<style lang="postcss" scoped></style>
