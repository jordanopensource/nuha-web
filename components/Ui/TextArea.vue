<template>
  <label class="block" :class="{'mb-2': showExpandButton}">
    <div v-if="label" class="mb-2">{{ label }}</div>
    <textarea
      v-model="text"
      class="block resize-none h-36 bg-colors-neutral-background bg-opacity-85"
      rows="3"
      name="text"
      :required="required"
      :placeholder="placeholder"
      @change="updateData()"
    />
    <UiButton
      v-if="showExpandButton"
      size="md"
      variant="ghost"
      class="aspect-square block w-8 !p-0 ms-auto -mt-10 me-2"
      :aria-label="$t('misc.expandText')"
      :title="$t('misc.expandText')"
      @click.prevent="showModal = true"
    >
      <Icon name="mdi:arrow-expand-all" size="24"/>
    </UiButton>
  </label>

  <!-- Expand text field modal -->
  <UiModal 
    v-model="showModal"
    :title="label || modalLabel"
    size="lg"
    :show-footer="false"
    @close="updateData"
  >
    <template #default>
      <div class="p-2 flex-grow overflow-auto">
        <textarea
          v-model="text"
          class="h-[50vh] resize-y"
          :placeholder="placeholder"
          @change="updateData()"
        />
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
  const emit = defineEmits(['update:text'])

  defineProps({
    showExpandButton: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: null,
    },
    modalLabel: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
  })

  const showModal = ref(false)
  const text = ref('')

  function updateData() {
    emit('update:text', {
      type: 'text',
      data: {
        text,
      },
    })
  }
</script>

<style lang="postcss" scoped>
textarea, input[type="text"] {
  @apply w-full border border-colors-neutral-placeholder rounded-md p-4;
  @apply focus:!border-colors-primary focus:outline-none focus:border-2 focus:p-[15px];
}
textarea::placeholder {
  @apply select-none;
}

</style>