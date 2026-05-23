export interface UserInfo {
  id?: string
  name: string
  handle: string
  email?: string
  location?: string
  avatar?: string
  bio?: string
}

const DEFAULT_USER: UserInfo = {
  name: 'Enoch Boison',
  handle: '@enochboison',
  email: '',
  location: '',
}

export function useUserInfo() {
  const { data, pending, error, refresh } = useFetch<UserInfo>(
    '/api/user/profile/me/info',
    {
      default: () => DEFAULT_USER,
      transform: (res: any) => {
        const u = res?.data ?? res
        if (!u || typeof u !== 'object') return DEFAULT_USER
        return {
          id:       u.id ?? u._id ?? undefined,
          name:     u.name ?? u.fullName ?? u.full_name ?? DEFAULT_USER.name,
          handle:   u.handle ?? u.username ? `@${u.username}` : u.handle ?? DEFAULT_USER.handle,
          email:    u.email ?? '',
          location: u.location ?? '',
          avatar:   u.avatar ?? u.avatarUrl ?? u.avatar_url ?? undefined,
          bio:      u.bio ?? u.description ?? '',
        }
      },
    }
  )
  return { user: data, pending, error, refresh }
}
