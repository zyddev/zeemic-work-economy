import { defineStore } from 'pinia'
import type { AccountContext } from '~/types'

export const useContextStore = defineStore('context', () => {
  const contextType = ref<AccountContext>('user')
  const businessId = ref<string | null>(null)
  const businessName = ref<string | null>(null)
  const unreadCount = ref(3)

  function switchToBusiness(id: string, name: string) {
    contextType.value = 'business'
    businessId.value = id
    businessName.value = name
  }

  function switchToUser() {
    contextType.value = 'user'
    businessId.value = null
    businessName.value = null
  }

  const isBusinessContext = computed(() => contextType.value === 'business')

  return { contextType, businessId, businessName, unreadCount, switchToBusiness, switchToUser, isBusinessContext }
})
