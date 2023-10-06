<template>
  <section class="w-full my-5 lg:my-20" id="upload-container">
    <div class="flex items-top min-h-[150px]">
      <div class="w-1/4 inline-block">
        <DashboardUploadStep
          circle-id="step-one"
          :order="1"
          :description="t('dashboard.steps.step1.name')"
        />
      </div>
      <div class="w-3/4 inline-block mt-2">
        <ul>
          <li
            v-for="item in t('dashboard.steps.step1.description').split('\n')"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <div class="flex items-top">
      <div class="w-1/4 inline-block">
        <DashboardUploadStep
          circle-id="step-two"
          :order="2"
          :description="t('dashboard.steps.step2.name')"
        />
      </div>
      <div class="w-3/4 inline-block mt-2">
        {{ t('dashboard.steps.step2.description') }}
        <br />
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus, fuga
        aspernatur incidunt accusantium adipisci ex at similique dolores.
        Praesentium quae aut enim fugit quos quis harum saepe molestiae
        exercitationem ex.
      </div>
    </div>
  </section>

  <!-- the mysterous line  -->
  <ClientOnly>
    <div
      class="hidden lg:block lg:absolute top-0 ltr:left-0 rtl:right-0 z-[-1]"
    >
      <svg
        :key="changeIndicator"
        :width="windowDimensions.width"
        :height="windowDimensions.height"
      >
        <line
          :x1="stepOneCoordinates.x.value"
          :y1="stepOneCoordinates.y.value"
          :x2="stepTwoCoordinates.x.value"
          :y2="stepTwoCoordinates.y.value"
          stroke="#e53076"
          stroke-dasharray="5,5"
        />
      </svg>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
  const { t } = useI18n()

  let stepOneCoordinates = { x: ref(0), y: ref(0) }
  let stepTwoCoordinates = { x: ref(0), y: ref(0) }
  const changeIndicator = ref(0)
  let windowDimensions = { width: 0, height: 0 }

  function getElementCoodinates(id: string) {
    const el = document.getElementById(id)
    if (el === null) {
      return { x: ref(0), y: ref(0) }
    }
    const rect = el.getBoundingClientRect()
    return {
      x: ref(rect.x + rect.width / 2),
      y: ref(rect.y + rect.height / 2),
    }
  }

  function updateLineCoordinates() {
    /*
    Hi reader of this code,

    All JS developers have one thing in common, that is SUFERRING,
    in which it leads to hacking with the code, and that why I'm writing this,
    as you can see in the template the line takes its points coordinates from the given steps indicators elements,
    WHICH might and will change on resizes and locale changing,
    focus on the last one, because of the locale changing, the page has to reload,
    and there's no such event to detect that, so, as far as the line knows,
    the steps' elements never changed places (the huge shift from left to right),
    and to make that happen, a timer is needed to ONLY update the line's points' coordinates
    using the new and correct position, and 20ms is enough (i.e. not much noticable) to detect that (at least on my machine).

    Hope that cleared the confusion for you!

    PS: if the line's position doesn't update correctly, and that's what made you see this monstresity of a code,
    kindly open a PR with the new value, and mention your devices specs.

    Sincerely,
    Baraa Al-Masri
  */
    setTimeout(() => {
      stepOneCoordinates = getElementCoodinates('step-one')
      stepTwoCoordinates = getElementCoodinates('step-two')
      changeIndicator.value++
    }, 20)
  }

  function updateWindowDimensions() {
    windowDimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  onMounted(() => {
    updateWindowDimensions()
    updateLineCoordinates()
    window.addEventListener('resize', () => {
      updateLineCoordinates()
      updateWindowDimensions()
    })
  })
</script>

<style scoped lang="postcss"></style>
