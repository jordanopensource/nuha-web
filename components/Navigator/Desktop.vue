<template>
  <div class="px-[40px] py-[10px] pt-[40px] text-nuha-fushia">
    <div class="flex justify-between">
      <img width="75" height="75" src="/logo.svg" />

      <div class="flex justify-between items-center">
        <div class="text-[20px] font-[300] px-[30px]">
          <NuxtLink class="px-[20px]" to="statistics">{{
            $t('link.statistics')
          }}</NuxtLink>
          &VerticalBar;
          <NuxtLink class="px-[20px]" to="learn-more">{{
            $t('link.learnMore')
          }}</NuxtLink>
        </div>
        <NuxtLink
          class="inline-block rounded-[10px] border-[1px] p-[8px] text-[18px] px-[16px] border-nuha-fushia flex items-center"
          :to="switchLocalePath($t('otherLocaleCode'))"
          >{{ $t('otherLocale') }}</NuxtLink
        >
      </div>
    </div>
    <div
      class="block my-[10px] border-t-[1px] border-t-nuha-fushia-light h-[0.5px] w-full"
    />
  </div>
</template>

<script lang="ts" setup>
  const switchLocalePath = useSwitchLocalePath()
</script>
