<template>
  <section class="w-full my-5 lg:my-20" id="upload-container">
    <div class="flex items-top">
      <div class="w-1/4 inline-block">
        <DashboardUploadStep
          circle-id="step-one"
          :order="1"
          :description="t('dashboard.steps.step1.name')"
        />
      </div>
      <div class="w-2/4 inline-block bg-green-500">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        laborum sunt ut et earum debitis, harum sequi molestiae odit corporis
        doloribus odio. Blanditiis et explicabo sed dignissimos non atque ut!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur esse
        recusandae ducimus facilis doloribus repellat in libero quidem! Pariatur
        natus corrupti delectus error necessitatibus consectetur at totam ab
        modi quia! Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Aspernatur animi corporis sapiente, porro illum error, consequuntur
        itaque similique fugit, magni molestias cumque? Perspiciatis hic
        consequuntur maxime nostrum. Possimus, est ad.
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
      <div class="w-2/4 inline-block bg-green-500">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        laborum sunt ut et earum debitis, harum sequi molestiae odit corporis
        doloribus odio. Blanditiis et explicabo sed dignissimos non atque ut!
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
    const rect = el.getBoundingClientRect()
    return {
      x: ref(rect.x + rect.width / 2),
      y: ref(rect.y),
    }
  }

  function updateLineCoordinates() {
    changeIndicator.value++
    stepOneCoordinates = getElementCoodinates('step-one')
    stepTwoCoordinates = getElementCoodinates('step-two')
  }

  onMounted(() => {
    updateLineCoordinates()
    window.addEventListener('resize', () => {
      updateLineCoordinates()
    })

    windowDimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  })
</script>

<style scoped lang="postcss"></style>
