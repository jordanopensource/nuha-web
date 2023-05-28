<template>
  <div class="px-[40px] py-[10px] pt-[40px] text-nuha-fushia" dir="ltr">
    <div class="flex justify-between">
      <NuxtLink
        class="inline-block rounded-[10px] border-[1px] p-[3px] px-[8px] border-nuha-fushia flex items-center"
        :to="switchLocalePath($t('otherLocaleCode'))"
        >{{ $t('otherLocale') }}</NuxtLink
      >

      <img width="50" height="50" src="/logo.svg" />
    </div>
    <div
      class="block my-[10px] border-t-[1px] border-t-nuha-fushia-light h-[0.5px] w-full"
    />
  </div>
</template>

<script lang="ts" setup>
  const switchLocalePath = useSwitchLocalePath()
</script>
