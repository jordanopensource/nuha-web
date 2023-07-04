<template>
  <div class="my-5">
    <UploadCSVFile
      @update:data="
        (_data: any) => {
        data = _data
        }
      "
    />

    <p
      class="text-4xl text-nuha-grey italic font-semibold w-full text-center my-5"
    >
      {{ t('dashboard.or') }}
    </p>

    <UploadComment
      @update:data="
        (_data: any) => {
        data = _data
        }
      "
    />

    <button
      class="w-full border-2 rounded-xl bg-nuha-fushia-300 text-white text-2xl border-nuha-grey p-3"
      @click="handleSubmit"
    >
      {{ t('dashboard.submit') }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import RequestBody from './RequestBody'

  const { t } = useI18n()
  const data = ref({} as RequestBody)

  async function handleSubmit() {
    console.log(data)
  }
</script>
