<template>
  <div
    class="bg-nuha-grey rounded-t-[2.75rem] text-center text-nuha-fushia-100 text-2xl py-24 lg:hidden snap-end relative"
  >
    <NuxtLink to="#statistics">
      <span class="moving-text wrapper cursor-pointer">
        {{ t('link.statistics') }} <i class="arrow down"></i>
      </span>
    </NuxtLink>
  </div>
</template>
<script setup>
  const { t } = useI18n()
</script>
<style scoped lang="postcss">
  .moving-text {
    @apply absolute top-1/2 left-[33%] md:left-[40%];
    @apply w-[100px] h-[100px];
    animation: move 5s ease-in-out infinite;
  }
  .wrapper {
    @apply flex flex-row justify-between items-center;
  }
  .arrow {
    @apply border-solid;
    border-width: 0 3px 3px 0;
    @apply inline-block;
    @apply mx-3 mb-2 p-2;
  }

  .down {
    @apply rotate-45;
  }

  @keyframes move {
    0% {
      transform: translateY(-50%);
    }
    25% {
      transform: translateY(-35%);
    }
    50% {
      transform: translateY(-50%);
    }

    75% {
      transform: translateY(-35%);
    }

    100% {
      transform: translateY(-50%);
    }
  }
</style>
