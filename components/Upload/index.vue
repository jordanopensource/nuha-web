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
      class="w-full border-2 rounded-xl bg-nuha-fushia-300 text-white text-2xl border-nuha-grey p-3 flex items-center justify-center"
      @click="handleSubmit"
    >
      <div v-if="!loading">
        {{ t('dashboard.submit') }}
      </div>
      <div v-else class="loader my-8"></div>
    </button>
  </div>
</template>

<script setup lang="ts">
  import RequestBody from './RequestBody'
  import { set } from '@vueuse/core'

  const { t } = useI18n()
  const data = ref({} as RequestBody)
  const loading = ref(false)

  async function handleSubmit() {
    set(loading, true)

    // TODO: upload logic goes here
    console.log(data)

    setTimeout(() => set(loading, false), 2500)
  }
</script>
