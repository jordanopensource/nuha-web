<template>
  <label>
    <div class="mb-4">{{ t('dashboard.steps.step2.description') }}</div>
    <textarea
      class="block max-h-48 min-h-16 w-full placeholder:text-lg"
      rows="3"
      name="comment"
      v-model="comment"
      @change="updateData()"
      :placeholder="t('dashboard.steps.step2.commentPlaceholder')"
    ></textarea>
  </label>
</template>

<script setup lang="ts">
  const { t } = useI18n()
  const comment = ref('')
  const emit = defineEmits(['update:data'])

  function updateData() {
    emit('update:data', {
      type: 'comment',
      data: {
        comment: comment.value,
      } as SingleComment,
    } as PredictionRequestBody)
  }
</script>

<style scoped lang="postcss"></style>
