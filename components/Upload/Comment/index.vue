<template>
  <h6>{{ t('dashboard.comment.header') }}:</h6>
  <div class="grid gap-2 lg:gap-y-0 grid-cols-1 lg:grid-cols-2">
    <textarea
      class="text-area"
      :placeholder="t('dashboard.comment.context')"
      :value="commentContext"
      cols="30"
      rows="5"
      @keyup="(ev) => {commentContext = (ev.target as HTMLTextAreaElement).value; updateData()}"
    ></textarea>
    <textarea
      class="text-area"
      :placeholder="t('dashboard.comment.content')"
      :value="commentText"
      cols="30"
      rows="5"
      @keyup="(ev) => {commentText = (ev.target as HTMLTextAreaElement).value; updateData()}"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import RequestBody from '../RequestBody'

  const { t } = useI18n()

  const emit = defineEmits(['update:data'])

  const commentContext = ref('')
  const commentText = ref('')

  function updateData() {
    emit('update:data', {
      type: 'comment',
      data: {
        context: commentContext.value,
        comment: commentText.value,
      },
    } as RequestBody)
  }
</script>

<style lang="postcss" scoped>
  .text-area {
    @apply rounded-xl border-2 border-nuha-grey-300 p-3;
  }
</style>
