<template>
  <label>
    <div class="mb-4">{{ t('dashboard.steps.step2.description') }}</div>
    <textarea
      class="block resize-none h-36 w-full placeholder:text-lg"
      rows="3"
      name="comment"
      v-model="comment"
      @change="updateData()"
      :placeholder="t('dashboard.steps.step2.commentPlaceholder')"
    ></textarea>
    <UiButton
      size="lg"
      variant="ghost"
      class="aspect-square block !rounded-full w-8 !p-0 ms-auto -mt-9 me-1"
      :aria-label="t('dashboard.comment.enlargeBtn')"
      @click.prevent="enlarged = true"
    >
      <IconArrowExpand />
    </UiButton>
  </label>

  <!-- Modal overlay -->
  <div 
    v-if="enlarged" 
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    @click="closeModal"
  >
    <!-- Modal content -->
    <div 
      class="bg-white rounded-md w-full lg:max-w-3xl max-h-[90vh] flex flex-col"
      @click.stop
    >
      <div class="p-4 border-b border-nuha-grey-200 flex justify-between items-center">
        <h3 class="text-xl font-medium">{{ t('dashboard.steps.step2.description') }}</h3>
        <UiButton
          variant="ghost"
          class="!p-1 !rounded-full"
          :aria-label="t('misc.close')"
          @click="closeModal"
        >
          <SvgoIconsCloseIcon class="w-5 h-5" />
        </UiButton>
      </div>
      
      <div class="p-4 flex-grow overflow-auto">
        <textarea
          class="w-full h-[50vh] resize-y p-3 border border-nuha-grey-200 rounded-md placeholder:text-lg"
          v-model="comment"
          @change="updateData()"
          :placeholder="t('dashboard.steps.step2.commentPlaceholder')"
        ></textarea>
      </div>
      
      <div class="p-4 border-t border-nuha-grey-200 flex justify-end">
        <UiButton
          variant="primary"
          @click="closeModal"
        >
          {{ t('misc.done') }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { t } = useI18n()
  const comment = ref('')
  const emit = defineEmits(['update:data'])

  const enlarged = ref(false)

  function updateData() {
    emit('update:data', {
      type: 'comment',
      data: {
        comment: comment.value,
      } as SingleComment,
    } as PredictionRequestBody)
  }

  function closeModal() {
    enlarged.value = false
    updateData()
  }

  // Close modal on escape key
  onMounted(() => {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && enlarged.value) {
        closeModal()
      }
    })
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', (e) => {
      if (e.key === 'Escape' && enlarged.value) {
        closeModal()
      }
    })
  })
</script>

<style scoped lang="postcss">
  /* Modal animation */
  .fixed {
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
