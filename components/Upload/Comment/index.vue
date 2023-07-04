<template>
  <h6>Insert the comment and its context:</h6>
  <div
    class="grid space-y-2 lg:space-y-0 lg:space-x-2 grid-cols-1 lg:grid-cols-2"
  >
    <textarea
      class="text-area"
      placeholder="Comment's context"
      :value="commentContext"
      cols="30"
      rows="5"
      @keyup="(ev) => {commentContext = (ev.target as HTMLTextAreaElement).value; updateData()}"
    ></textarea>
    <textarea
      class="text-area"
      placeholder="Comment's content"
      :value="commentText"
      :v-bind="commentText"
      cols="30"
      rows="5"
      @keyup="(ev) => {commentText = (ev.target as HTMLTextAreaElement).value; updateData()}"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import RequestBody from '../RequestBody'

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
