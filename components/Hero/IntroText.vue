<template>
  <div class="text">
    <h1 class="main">{{ $t('intro.text') }}</h1>
    <span>&nbsp;</span>
    <h2 class="sub">{{ $t('intro.sub') }}</h2>
  </div>
</template>

<style lang="postcss" scoped>
  .text {
    @apply text-nuha-fushia-300 px-10 text-4xl md:text-6xl italic leading-snug;
    .main {
      @apply inline font-thin;
    }

    .sub {
      @apply inline font-bold;
    }
  }
</style>
