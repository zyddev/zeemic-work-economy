export default defineEventHandler((event) => {
  deleteCookie(event, 'AuthToken', { path: '/' })
  deleteCookie(event, 'UserRole', { path: '/' })
  deleteCookie(event, 'TempToken', { path: '/' })
  deleteCookie(event, 'SessionDuration', { path: '/' })
  return { success: true }
})
