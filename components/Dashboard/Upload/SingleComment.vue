<template>
  <p>
    {{ t('dashboard.steps.step2.description') }}
  </p>

  <div class="my-2">
    <textarea
      class="w-full border-2 border-nuha-fushia-200 p-5"
      :value="comment"
      cols="30"
      rows="5"
      @keyup="
        (ev) => {
          comment = (ev.target as HTMLTextAreaElement).value
          updateData()
        }
      "
    ></textarea>
  </div>
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
