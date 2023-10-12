<template>
  <section>
    <h3>{{ $t('methodology.sections.about.firstParagraph.title') }}</h3>
    <p>{{ $t('methodology.sections.about.firstParagraph.p1') }}</p>
    <p>{{ $t('methodology.sections.about.firstParagraph.p2') }}</p>
    <figure>
      <img
        src="/images/methodology-cycle.png"
        :alt="$t('methodology.sections.about.firstParagraph.fig1')"
      />
      <figcaption class="mt-4">
        <span class="font-semibold">{{ $t('methodology.figure') }} 1:</span>
        {{ $t('methodology.sections.about.firstParagraph.fig1') }}
      </figcaption>
    </figure>
  </section>
  <section>
    <h3>{{ $t('methodology.sections.about.secondParagraph.title') }}</h3>
    <p>{{ $t('methodology.sections.about.secondParagraph.p1') }}</p>
    <p>{{ $t('methodology.sections.about.secondParagraph.p2') }}</p>
  </section>
  <div class="footnotes py-8">
    <p class="text-lg">{{ $t('methodology.footnotes') }}</p>
    <ol class="list-decimal">
      <li id="fn-1">
        <a href="http://" target="_blank" rel="noopener noreferrer">
          {{ $t('methodology.sections.about.footnotes.1') }}
        </a>
      </li>
      <li id="fn-2">
        <a href="http://" target="_blank" rel="noopener noreferrer">
          {{ $t('methodology.sections.about.footnotes.2') }}
        </a>
      </li>
      <li id="fn-2">
        <a href="http://" target="_blank" rel="noopener noreferrer">
          {{ $t('methodology.sections.about.footnotes.2') }}
        </a>
      </li>
      <li id="fn-2">
        <a href="http://" target="_blank" rel="noopener noreferrer">
          {{ $t('methodology.sections.about.footnotes.1') }}
        </a>
      </li>
    </ol>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="postcss" scoped>
  div.container {
    section {
      @apply flex flex-col gap-y-8 py-10;
      @apply border-b border-nuha-grey-200;
      h3 {
        @apply font-semibold text-lg;
      }
    }
    .footnotes {
      ol {
        counter-reset: custom;
        list-style-type: none;

        li {
          @apply my-4;
          &::before {
            content: '[' counter(custom) '] ';
            counter-increment: custom;
            @apply font-semibold;
          }
        }
      }
    }
  }
</style>
