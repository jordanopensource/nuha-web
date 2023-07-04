<template>
  <div>
    <UploadCSVFile
      @update:data="
        (_data: any) => {
        data = _data
        }
      "
    />
    <UploadComment
      @update:data="
        (_data: any) => {
        data = _data
        }
      "
    />

    <button @click="handleSubmit">Submit</button>
  </div>
</template>

<script setup lang="ts">
  import RequestBody from './RequestBody'
  const data = ref({} as RequestBody)

  async function handleSubmit() {
    console.log(data)
  }
</script>
