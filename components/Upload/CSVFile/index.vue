<template>
  <h6>Upload a CSV file:</h6>
  <div
    class="grid space-y-2 lg:space-y-0 lg:space-x-2 grid-cols-1 lg:grid-cols-2"
  >
    <input class="btn select-file" type="file" @change="updateFile" />
    <button class="btn download-template" @click="downloadTemplate">
      Download Template
    </button>
  </div>
</template>

<script setup lang="ts">
  import RequestBody from '../RequestBody'

  const emit = defineEmits(['update:data'])

  let file: File

  function updateFile(ev: Event) {
    file = (ev.target as HTMLInputElement).files[0]
    updateData()
  }

  function updateData() {
    emit('update:data', {
      type: 'csv',
      data: {
        file: file,
      },
    } as RequestBody)
  }

  function downloadTemplate() {
    const a = document.createElement('a')
    a.hidden = true
    a.href = '/logo.svg'
    a.download = 'template.csv'
    a.click()
  }
</script>

<style lang="postcss" scoped>
  .btn {
    @apply border border-nuha-fushia-200;

    &-download-template {
    }

    &-select-file {
    }
  }
</style>
