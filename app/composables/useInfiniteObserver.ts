export function useInfiniteObserver(
  anchorRef: Ref<HTMLElement | null>,
  onIntersect: () => void,
  options?: IntersectionObserverInit,
) {
  let observer: IntersectionObserver | null = null

  function attach(el: HTMLElement) {
    if (typeof IntersectionObserver === 'undefined') return
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersect()
      },
      { threshold: 0.1, ...options },
    )
    observer.observe(el)
  }

  function detach() {
    observer?.disconnect()
    observer = null
  }

  watch(
    anchorRef,
    (el) => {
      detach()
      if (el) attach(el)
    },
    { immediate: true },
  )

  onUnmounted(detach)

  return { detach }
}
