export function useListingInfiniteScroll<T>(
  allItems: Ref<T[]>,
  pageSize = 12,
) {
  const page = ref(1)
  const anchor = ref<HTMLElement | null>(null)

  const visibleItems = computed(() => allItems.value.slice(0, page.value * pageSize))
  const hasMore = computed(() => visibleItems.value.length < allItems.value.length)

  function loadMore() {
    if (hasMore.value) page.value++
  }

  // Post-load check: if anchor is still in view after load, trigger another page
  function checkViewport() {
    if (!anchor.value || !hasMore.value) return
    const rect = anchor.value.getBoundingClientRect()
    if (rect.top <= window.innerHeight + 100) loadMore()
  }

  useInfiniteObserver(anchor, () => {
    loadMore()
    nextTick(checkViewport)
  })

  watch(allItems, () => {
    page.value = 1
    nextTick(checkViewport)
  })

  return { visibleItems, hasMore, loadMore, anchor, page }
}
