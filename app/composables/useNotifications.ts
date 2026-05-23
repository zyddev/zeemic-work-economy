import type { Notification } from '~/types'

export function useNotifications() {
  const {
    data: notifications,
    pending,
    error,
    refresh,
  } = useFetch<Notification[]>('/api/notification', {
    default: () => [] as Notification[],
  })

  async function markRead(notificationId: string): Promise<void> {
    await $fetch(`/api/notification/${notificationId}/read`, { method: 'PATCH' })
    await refresh()
  }

  async function markAllRead(): Promise<void> {
    await $fetch('/api/notification/read-all', { method: 'PATCH' })
    await refresh()
  }

  return { notifications, pending, error, refresh, markRead, markAllRead }
}
