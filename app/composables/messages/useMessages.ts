export interface Conversation {
  id: string
  name: string
  snippet: string
  time: string
  unread: boolean
  unreadCount?: number
  avatarUrl?: string
}

export interface Message {
  id: string
  text: string
  sent: boolean
  time: string
}

function normalizeConversation(c: any): Conversation {
  return {
    id:          c.id ?? c._id ?? '',
    name:        c.name ?? c.participantName ?? c.participant_name ?? '',
    snippet:     c.snippet ?? c.lastMessage ?? c.last_message ?? c.lastMessageText ?? '',
    time:        c.time ?? c.updatedAt ?? c.updated_at ?? '',
    unread:      c.unread ?? c.hasUnread ?? c.has_unread ?? false,
    unreadCount: c.unreadCount ?? c.unread_count ?? undefined,
    avatarUrl:   c.avatarUrl ?? c.avatar_url ?? undefined,
  }
}

function normalizeMessage(m: any, currentUserId?: string): Message {
  const senderId = m.senderId ?? m.sender_id ?? m.from ?? ''
  return {
    id:   m.id ?? m._id ?? '',
    text: m.text ?? m.content ?? m.body ?? '',
    sent: currentUserId ? senderId === currentUserId : (m.sent ?? m.isOwn ?? m.is_own ?? false),
    time: m.time ?? m.createdAt ?? m.created_at ?? '',
  }
}

export function useMessages(userId?: Ref<string> | string) {
  const conversations = ref<Conversation[]>([])
  const loadingConvs = ref(false)
  const selectedId = ref<string | null>(null)
  const messages = ref<Message[]>([])
  const loadingMsgs = ref(false)
  const draftMessage = ref('')

  const selectedConv = computed(() => conversations.value.find(c => c.id === selectedId.value))

  async function loadConversations() {
    loadingConvs.value = true
    try {
      const res = await $fetch<any>('/api/messaging/conversations', {
        query: userId ? { userId: unref(userId) } : {},
      })
      const arr = res?.data ?? res?.conversations ?? res
      conversations.value = Array.isArray(arr) ? arr.map(normalizeConversation) : []
      if (conversations.value.length && !selectedId.value) {
        selectedId.value = conversations.value[0].id
      }
    } catch {
      // keep empty — UI shows placeholder state
    } finally {
      loadingConvs.value = false
    }
  }

  async function loadMessages(conversationId: string) {
    loadingMsgs.value = true
    try {
      const res = await $fetch<any>(
        `/api/messaging/messages/conversation/${conversationId}`
      )
      const arr = res?.data ?? res?.messages ?? res
      messages.value = Array.isArray(arr)
        ? arr.map((m: any) => normalizeMessage(m, unref(userId) as string | undefined))
        : []
    } catch {
      messages.value = []
    } finally {
      loadingMsgs.value = false
    }
  }

  watch(selectedId, (id) => {
    if (id) loadMessages(id)
  })

  async function sendMessage() {
    const text = draftMessage.value.trim()
    if (!text || !selectedId.value) return
    draftMessage.value = ''
    try {
      await $fetch('/api/messaging/messages', {
        method: 'POST',
        body: { conversationId: selectedId.value, text },
      })
      await loadMessages(selectedId.value)
    } catch {
      draftMessage.value = text
    }
  }

  async function markRead(conversationId: string) {
    try {
      await $fetch(`/api/messaging/conversations/${conversationId}/read`, { method: 'PATCH' })
      const conv = conversations.value.find(c => c.id === conversationId)
      if (conv) { conv.unread = false; conv.unreadCount = 0 }
    } catch { /* ignore */ }
  }

  return {
    conversations,
    loadingConvs,
    selectedId,
    selectedConv,
    messages,
    loadingMsgs,
    draftMessage,
    loadConversations,
    loadMessages,
    sendMessage,
    markRead,
  }
}
