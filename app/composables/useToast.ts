export type ToastTone = 'error' | 'success' | 'warning' | 'info'

export interface ToastItem {
  id: string
  tone: ToastTone
  message: string
}

const toasts = ref<ToastItem[]>([])

function push(tone: ToastTone, message: string, duration: number) {
  const id = Math.random().toString(36).slice(2, 9)
  toasts.value.push({ id, tone, message })
  if (duration > 0) setTimeout(() => dismiss(id), duration)
  return id
}

function dismiss(id: string) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    error:   (message: string, duration = 6000) => push('error',   message, duration),
    success: (message: string, duration = 3500) => push('success', message, duration),
    warning: (message: string, duration = 5000) => push('warning', message, duration),
    info:    (message: string, duration = 4000) => push('info',    message, duration),
    dismiss,
  }
}
