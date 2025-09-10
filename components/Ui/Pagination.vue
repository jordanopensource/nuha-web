<template>
  <div v-if="pageCount > 1" class="pagination-container" :class="`pagination-${size}`">
    <!-- Previous button -->
    <UiButton
      :variant="'ghost'"
      :size="size"
      :disabled="currentPage === 1"
      class="min-w-0"
      @click="handlePageChange(currentPage - 1)"
    >
      <template #icon>
        <Icon name="mdi:chevron-left" class="w-5 h-5" :class="{ 'rotate-180': isRTL }" />
      </template>
    </UiButton>

    <!-- First page button (always visible) -->
    <UiButton
      :variant="currentPage === 1 ? 'primary' : 'ghost'"
      :size="size"
      @click="handlePageChange(1)"
    >
      1
    </UiButton>

    <!-- Ellipsis if needed (left side) -->
    <span v-if="showLeftEllipsis" class="pagination-ellipsis">...</span>

    <!-- Middle page buttons -->
    <UiButton
      v-for="page in visiblePageNumbers"
      :key="page"
      :variant="currentPage === page ? 'primary' : 'ghost'"
      :size="size"
      @click="handlePageChange(page)"
    >
      {{ page }}
    </UiButton>

    <!-- Ellipsis if needed (right side) -->
    <span v-if="showRightEllipsis" class="pagination-ellipsis">...</span>

    <!-- Last page button (if there's more than one page) -->
    <UiButton
      v-if="pageCount > 1"
      :variant="currentPage === pageCount ? 'primary' : 'ghost'"
      :size="size"
      @click="handlePageChange(pageCount)"
    >
      {{ pageCount }}
    </UiButton>

    <!-- Next button -->
    <UiButton
      :variant="'ghost'"
      :size="size"
      :disabled="currentPage === pageCount"
      class="min-w-0"
      @click="handlePageChange(currentPage + 1)"
    >
      <template #icon>
        <Icon name="mdi:chevron-right" class="w-5 h-5" :class="{ 'rotate-180': isRTL }" />
      </template>
    </UiButton>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  /**
   * Current active page
   */
  modelValue: {
    type: Number,
    default: 1,
  },
  /**
   * Total number of pages
   */
  pageCount: {
    type: Number,
    required: true,
  },
  /**
   * Number of items per page
   */
  pageSize: {
    type: Number,
    default: 25,
  },
  /**
   * Total number of items across all pages
   */
  totalItems: {
    type: Number,
    default: 0,
  },
  /**
   * Button size (from UiButton)
   */
  size: {
    type: String as () => 'sm' | 'md' | 'lg',
    default: 'sm',
  },
  /**
   * How many page buttons to show around the current page
   */
  siblingCount: {
    type: Number,
    default: 1,
  },
  /**
   * Name of the URL parameter for the page number
   */
  pageParamName: {
    type: String,
    default: 'page'
  }
})

// events for when page changes
const emit = defineEmits(['update:modelValue', 'page-changed'])

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()

const isRTL = computed(() => {
  return ['ar', 'ckb'].includes(locale.value)
})

const currentPage = ref(props.modelValue)

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  currentPage.value = newValue
})

onMounted(() => {
  const pageFromUrl = parseInt(route.query[props.pageParamName] as string, 10)
  if (!isNaN(pageFromUrl) && pageFromUrl >= 1 && pageFromUrl <= props.pageCount) {
    currentPage.value = pageFromUrl
    emit('update:modelValue', pageFromUrl)
    emit('page-changed', pageFromUrl)
  } else if (currentPage.value !== 1) {
    // If there's no page in URL but we have a different currentPage, update URL
    updateUrl(currentPage.value)
  }
})

// Calculate visible page numbers
const visiblePageNumbers = computed(() => {
  const { siblingCount, pageCount } = props
  const current = currentPage.value
  
  // Start and end of visible range
  let start = Math.max(2, current - siblingCount)
  let end = Math.min(pageCount - 1, current + siblingCount)
  
  // Adjust range to always show same number of siblings if possible
  if (current - start < siblingCount && end < pageCount - 1) {
    end = Math.min(pageCount - 1, end + (siblingCount - (current - start)))
  } else if (end - current < siblingCount && start > 2) {
    start = Math.max(2, start - (siblingCount - (end - current)))
  }
  
  // Generate array of page numbers to show
  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const showLeftEllipsis = computed(() => {
  const min = Math.min(...visiblePageNumbers.value)
  return props.pageCount > 4 && min > 2
})
const showRightEllipsis = computed(() => {
  const max = Math.max(...visiblePageNumbers.value)
  return props.pageCount > 4 && max < props.pageCount - 1
})

function handlePageChange(page: number) {
  if (page === currentPage.value || page < 1 || page > props.pageCount) return
  
  currentPage.value = page
  updateUrl(page)
  
  emit('update:modelValue', page)
  emit('page-changed', page)
}

// Update the URL with the new page
function updateUrl(page: number) {
  const query = {
    ...route.query,
    [props.pageParamName]: page === 1 ? undefined : page.toString()
  }

  if (page === 1) {
    delete query[props.pageParamName]
  }
  
  // update the URL without reload
  router.replace({ 
    query 
  })
}
</script>

<style lang="postcss" scoped>
.pagination-container {
  @apply flex items-center gap-1 justify-center my-6;
  
  .pagination-ellipsis {
    @apply flex items-center justify-center px-2 text-colors-neutral-foreground;
  }
}

.pagination-sm {
  @apply text-sm;
}

.pagination-md {
  @apply text-base;
}

.pagination-lg {
  @apply text-lg;
}
</style>
