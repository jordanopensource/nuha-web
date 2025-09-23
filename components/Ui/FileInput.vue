<!-- TODO: i18n -->
<template>
  <div class="w-full">
    <div v-if="label" class="mb-2">{{ label }}</div>
    <UiButton
      ref="dropzone"
      variant="ghost"
      class="w-full h-36 border border-dashed border-colors-primary"
      :class="isOverDropZone ? '!bg-colors-primary !text-colors-primary-light scale-105' : '!bg-colors-primary-light'"
      @click="() => clickUpload()"
    >
      <label :for="id" class="cursor-pointer" @click.prevent>
        {{
          !file
            ? placeholder
            : `Selected file: ${file.name}`
        }}
      </label>
      <template #icon>
        <Icon name="mdi:upload" size="24"/>
      </template>
    </UiButton>
  </div>

  <input
    :id="id"
    hidden
    style="visibility: hidden"
    type="file"
    :accept="acceptedTypes.join(', ')"
    @change="updateFile"
  >
</template>

<script setup lang="ts">
  import { useDropZone } from '@vueuse/core'

  const props = defineProps({
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null,
    },
    acceptedTypes: {
      type: Array as PropType<string[]>,
      default: () => [
        'text/plain',
        'text/csv',
        'application/json',
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      ]
    }
  })

  const emit = defineEmits(['update:file', 'error'])
  const file = ref<File | null>()
  const id = useId()

  watch(file, () => {
    updateData()
  })

  function isValidFileType(file: File): boolean {
    return props.acceptedTypes.includes(file.type)
  }

  function updateFile(ev: Event) {
    const files = (ev.target as HTMLInputElement).files
    if (files === null || files.length === 0) {
      return
    }
    
    const selectedFile = files[0]
    
    // TODO: i18n for error message
    // TODO: show only accepted file types name not their mime-types
    if (!isValidFileType(selectedFile)) {
      emit('error', {
        message: `Invalid file type. Accepted types: ${props.acceptedTypes.join(', ')}`,
        file: selectedFile
      })
      return
    }
    
    file.value = selectedFile
    updateData()
  }

  function updateData() {
    emit('update:file', {
      data: file.value,
    })
  }
  function clickUpload() {
    const fileInput = document.getElementById(id) as HTMLInputElement
    fileInput.click()
  }
  
  // Dropzone
  const dropzone = ref<HTMLButtonElement>()
  
  async function onDrop (files : File[] | null) {
    file.value = files ? files[0] : null
    updateData()
  }

  const { isOverDropZone } = useDropZone(dropzone, {
    onDrop,
    dataTypes: props.acceptedTypes ? props.acceptedTypes : [],
    multiple: false, // accept one file
    preventDefaultForUnhandled: true,
  })
</script>
